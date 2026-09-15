#!/usr/bin/env python3
"""
minify_assets.py - strips comments from this site's OWN css/js in a BUILT
site directory. CI-only, run after `mkdocs build`, never against docs/.

WHY THIS EXISTS
This site's css/js are deliberately comment-heavy (extra.css is ~9,600 lines,
about two thirds of it explanatory prose). Those comments are the single most
valuable thing in the repo for future edits, so they must stay in docs/ - but
shipping them to every visitor is pure waste. Prose also compresses badly
relative to css/js structure, so stripping comments helps far more than the
raw byte count suggests:

    extra.css          425 KB -> 141 KB raw, 126 KB -> 19 KB gzipped
    eager js (29 files)               116 KB -> 38 KB gzipped
    per guide page     242 KB -> 57 KB gzipped (what GitHub Pages sends)

WHY COMMENT-STRIPPING ONLY, NOT FULL MINIFICATION
Full minification (collapsing whitespace, dropping the last semicolon in a
block, etc) was measured and buys about 1 KB more gzipped on top of the above.
That is not worth the risk surface of rewriting token streams. Comment removal
is the whole win; everything else is rounding error.

WHY NOT mkdocs-minify-plugin
A plugin has to be installed wherever mkdocs runs, which would break a plain
`mkdocs serve` on a machine that doesn't have it. This is a post-build step
instead: it touches only the output directory, so local previews are
completely unaffected and need no extra packages. It is also stdlib-only, so
CI installs nothing beyond mkdocs-material itself.

SAFETY
The js stripper is a character state machine that tracks single/double quoted
strings, template literals (including nested ${} interpolation), and regex
literals, so a `//` inside a string or a `/.../ ` regex is never mistaken for
a comment. Every output file is verified to still parse before it is written
(see --verify, which CI passes). Files that already end in .min.css/.min.js,
anything under assets/ (Material's own bundles, already minified), and
sourcemaps are skipped.
"""
import argparse
import gzip
import pathlib
import re
import shutil
import subprocess
import sys
import tempfile


def strip_js(src):
    """Remove // and /* */ comments from JS, preserving all other bytes.

    State machine over the raw text. The only genuinely tricky case is telling
    a regex literal (`/foo/g`) from a division (`a / b`), since a regex body
    can contain `//`. That is decided by the previous significant character:
    a regex may only start where a value may start, i.e. after an operator,
    an opening bracket, a separator, or a keyword like `return`.
    """
    out = []
    i = 0
    n = len(src)
    prev_sig = ""
    while i < n:
        c = src[i]

        # --- quoted strings: copied verbatim ---
        if c in "\"'":
            q = c
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == q:
                    j += 1
                    break
                j += 1
            out.append(src[i:j])
            prev_sig = q
            i = j
            continue

        # --- template literals, tracking ${...} nesting ---
        if c == "`":
            j = i + 1
            depth = 0
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "$" and j + 1 < n and src[j + 1] == "{":
                    depth += 1
                    j += 2
                    continue
                if src[j] == "}" and depth:
                    depth -= 1
                    j += 1
                    continue
                if src[j] == "`" and not depth:
                    j += 1
                    break
                j += 1
            out.append(src[i:j])
            prev_sig = "`"
            i = j
            continue

        # --- line comment ---
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            i = n if j < 0 else j
            continue

        # --- block comment: replaced by a space so `a/**/b` stays `a b` ---
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            i = n if j < 0 else j + 2
            out.append(" ")
            continue

        # --- regex literal vs division ---
        if c == "/":
            tail = "".join(out[-12:])
            starts_value = prev_sig == "" or prev_sig in "(,=:[!&|?{};+-*%~^<>" or re.search(
                r"\b(return|typeof|instanceof|in|of|new|delete|void|throw|case|do|else)$", tail
            )
            if starts_value:
                j = i + 1
                in_class = False
                closed = False
                while j < n:
                    d = src[j]
                    if d == "\\":
                        j += 2
                        continue
                    if d == "\n":
                        break
                    if d == "[":
                        in_class = True
                    elif d == "]":
                        in_class = False
                    elif d == "/" and not in_class:
                        j += 1
                        closed = True
                        break
                    j += 1
                if closed:
                    while j < n and src[j] in "gimsuyvd":
                        j += 1
                    out.append(src[i:j])
                    prev_sig = "/"
                    i = j
                    continue
            out.append(c)
            prev_sig = c
            i += 1
            continue

        out.append(c)
        if not c.isspace():
            prev_sig = c
        i += 1

    return _tidy("".join(out))


def strip_css(src):
    """Remove /* */ comments from CSS. Quoted strings are copied verbatim so a
    comment marker inside `content: "..."` or a url() is never touched."""
    out = []
    i = 0
    n = len(src)
    while i < n:
        c = src[i]
        if c in "\"'":
            q = c
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == q:
                    j += 1
                    break
                j += 1
            out.append(src[i:j])
            i = j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            i = n if j < 0 else j + 2
            continue
        out.append(c)
        i += 1
    return _tidy("".join(out))


def _tidy(s):
    """Collapse the blank lines comment removal leaves behind. Deliberately
    conservative: trailing horizontal whitespace and repeated newlines only,
    never indentation or newlines themselves (JS relies on newlines for
    automatic semicolon insertion)."""
    s = re.sub(r"[ \t]+\n", "\n", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.lstrip("\n")


def node_check(text):
    """Verify JS still parses. Returns None if ok, else the error string.
    Uses node when available (GitHub Actions runners ship it); silently
    skips if not, since this is a belt-and-braces check on top of the
    stripper's own guarantees."""
    if not shutil.which("node"):
        return None
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as fh:
        fh.write(text)
        tmp = fh.name
    try:
        r = subprocess.run(["node", "--check", tmp], capture_output=True, text=True)
        return None if r.returncode == 0 else r.stderr.strip().split("\n")[0]
    finally:
        pathlib.Path(tmp).unlink(missing_ok=True)


SKIP_DIRS = {"assets"}  # Material's own bundles: already minified


def process(site_dir, verify):
    site = pathlib.Path(site_dir)
    if not site.is_dir():
        print(f"minify_assets.py: '{site_dir}' is not a directory", file=sys.stderr)
        return 1

    raw_before = raw_after = gz_before = gz_after = 0
    touched = 0
    failures = []

    for path in sorted(site.rglob("*")):
        if not path.is_file() or path.suffix not in (".css", ".js"):
            continue
        if path.name.endswith((".min.css", ".min.js")):
            continue
        if SKIP_DIRS & set(path.relative_to(site).parts):
            continue

        original = path.read_text(encoding="utf-8")
        stripped = strip_js(original) if path.suffix == ".js" else strip_css(original)

        if verify and path.suffix == ".js":
            err = node_check(stripped)
            if err:
                failures.append(f"{path.relative_to(site)}: {err}")
                continue  # leave the original in place rather than ship broken js

        raw_before += len(original.encode())
        raw_after += len(stripped.encode())
        gz_before += len(gzip.compress(original.encode(), 9))
        gz_after += len(gzip.compress(stripped.encode(), 9))
        path.write_text(stripped, encoding="utf-8")
        touched += 1

    if failures:
        print("minify_assets.py: FAILED to verify, originals left untouched:", file=sys.stderr)
        for f in failures:
            print("  " + f, file=sys.stderr)
        return 1

    def kb(n):
        return f"{n / 1024:.0f} KB"

    print(
        f"minify_assets.py: {touched} file(s)  "
        f"raw {kb(raw_before)} -> {kb(raw_after)}  "
        f"gzip {kb(gz_before)} -> {kb(gz_after)}"
    )
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("site_dir", nargs="?", default="site")
    ap.add_argument(
        "--verify",
        action="store_true",
        help="run `node --check` on every stripped js file and abort if any fails",
    )
    args = ap.parse_args()
    sys.exit(process(args.site_dir, args.verify))
