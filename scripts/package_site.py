#!/usr/bin/env python3
"""Stage the public GitHub Pages files, without copying the repository root.

Run: python scripts/package_site.py
Use --source-root and --output to check another checkout without modifying it.
The output must be absent or empty; this script never deletes existing files.
"""

import argparse
from html.parser import HTMLParser
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import sys
from urllib.parse import unquote, urlsplit


PUBLIC_FILES = (
    "index.html",
    "404.html",
    "robots.txt",
    "sitemap.xml",
    "styles.css",
    "script.js",
    "data.json",
    "assets/favicon.svg",
    "assets/logo-a.svg",
    "assets/brand/portal.js",
    "assets/brand/portal-idle.png",
    "assets/fonts/inter-latin-wght-normal.woff2",
    "assets/fonts/space-grotesk-latin-wght-normal.woff2",
    "assets/fonts/jetbrains-mono-latin-wght-normal.woff2",
    "assets/fonts/inter-LICENSE.txt",
    "assets/fonts/space-grotesk-LICENSE.txt",
    "assets/fonts/jetbrains-mono-LICENSE.txt",
)
FONT_LICENSES = {
    "assets/fonts/inter-LICENSE.txt",
    "assets/fonts/space-grotesk-LICENSE.txt",
    "assets/fonts/jetbrains-mono-LICENSE.txt",
}
CSS_URL = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
JS_ASSET = re.compile(r"(['\"])((?:/?assets/|\./assets/)[^'\"]+)\1")
JS_LOAD = re.compile(
    r"\b(?:fetch|import|importScripts|new\s+(?:Worker|SharedWorker|URL))"
    r"\s*\(\s*(['\"])([^'\"]+)\1"
)


class PageReferences(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        for key in ("src", "poster"):
            if key in attributes:
                self.urls.append(attributes[key])
        if "href" in attributes:
            self.urls.append(attributes["href"])
        if "srcset" in attributes:
            self.urls.extend(part.strip().split()[0] for part in attributes["srcset"].split(",") if part.strip())


def local_reference(url, owner):
    """Normalize a literal browser URL without ever fetching external URLs."""
    parts = urlsplit(url)
    if parts.scheme or parts.netloc or not parts.path:
        return None
    path = unquote(parts.path)
    if "\\" in path or "\0" in path:
        raise ValueError(f"Unsupported local URL in {owner}: {url!r}")
    combined = PurePosixPath(path.lstrip("/")) if path.startswith("/") else PurePosixPath(owner).parent / path
    normalized = []
    for part in combined.parts:
        if part == "..":
            if not normalized:
                raise ValueError(f"Local URL escapes the site in {owner}: {url!r}")
            normalized.pop()
        elif part != ".":
            normalized.append(part)
    result = "/".join(normalized)
    return result or "index.html"


def references(root, name):
    if not name.endswith((".html", ".css", ".js")):
        return set()
    source = (root / name).read_text(encoding="utf-8")
    if name.endswith(".html"):
        page = PageReferences()
        page.feed(source)
        urls = page.urls
    elif name.endswith(".css"):
        urls = [match.group(2) for match in CSS_URL.finditer(source)]
    else:
        urls = [match.group(2) for pattern in (JS_ASSET, JS_LOAD) for match in pattern.finditer(source)]
    return {resolved for url in urls if (resolved := local_reference(url, name)) is not None}


def reject_links(path, boundary):
    """Do not follow symlinks or Windows junctions while staging public files."""
    current = path
    while True:
        if current.exists() or current.is_symlink():
            metadata = current.lstat()
            reparse = getattr(metadata, "st_file_attributes", 0) & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0x400)
            if current.is_symlink() or reparse:
                raise ValueError(f"Refusing a linked path: {current}")
        if current == boundary or current.parent == current:
            break
        current = current.parent


def package_site(source_root, output):
    root = Path(os.path.abspath(source_root))
    destination = Path(os.path.abspath(output))
    reject_links(root, Path(root.anchor))
    reject_links(destination, Path(destination.anchor))
    if not root.is_dir():
        raise ValueError(f"Source directory does not exist: {root}")
    if destination == root or root.is_relative_to(destination):
        raise ValueError("Output must not be the source directory or one of its parents.")
    if destination.exists() and (not destination.is_dir() or any(destination.iterdir())):
        raise ValueError(f"Output must be absent or empty: {destination}")

    # Validate the entire explicit list before creating any output.
    allowed = set(PUBLIC_FILES)
    used = set()
    for name in PUBLIC_FILES:
        path = root / name
        reject_links(path, root)
        if not path.is_file():
            raise ValueError(f"Missing public file: {name}")
        used.update(references(root, name))
    missing = used - allowed
    if missing:
        raise ValueError("Referenced paths are not approved for publishing: " + ", ".join(sorted(missing)))
    unused = {name for name in allowed if name.startswith("assets/")} - used - FONT_LICENSES
    if unused:
        raise ValueError("Unused assets must leave the publish list: " + ", ".join(sorted(unused)))

    destination.mkdir(parents=True, exist_ok=True)
    for name in PUBLIC_FILES:
        target = destination / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(root / name, target)
    staged = {path.relative_to(destination).as_posix() for path in destination.rglob("*") if path.is_file()}
    if staged != allowed:
        raise ValueError("The staged directory does not match the publish list.")
    size = sum((destination / name).stat().st_size for name in PUBLIC_FILES)
    print(f"Staged {len(staged)} public files ({size:,} bytes) in {destination}")
    for name in sorted(staged):
        print(f"  {name}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--output", type=Path)
    arguments = parser.parse_args()
    try:
        package_site(arguments.source_root, arguments.output or arguments.source_root / "_site")
    except (OSError, ValueError) as error:
        print(f"Packaging failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
