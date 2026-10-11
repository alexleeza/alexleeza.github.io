# alexleeza.github.io

A centered personal portal for Alex K. Lee. The page keeps the original content: name and professional tagline, Personal Site and Recruiter Portal links, the complete 23-project catalog, and GitHub, LinkedIn, and Email links.

Static HTML, CSS, and a small JavaScript animation controller. No compilation or package installation.

## Files

- `index.html`: complete page content, including the project catalog and interactive portal. All navigation and the project disclosure work without JavaScript.
- `data.json`: the matching compact content source. Keep its project catalog in sync with the HTML.
- `script.js`: portal interaction, pixel transition between the entrance and projects, button attraction, 30 fps scheduling, and motion controls.
- `styles.css`: shared warm ivory/forest palette, fonts, responsive layout, and scene animation.
- `assets/brand/portal.js`: original 160 × 176 pixel portal renderer, with cached stonework and a small animated aperture.
- `assets/brand/portal-idle.png`: 4.3 KB original static fallback, rendered from the same code.
- `assets/fonts/`: the main website's local font assets and licenses.
- `404.html`: error page using the same design system.

## Preview

```powershell
python -m http.server 8124 --bind 127.0.0.1
```

Open http://127.0.0.1:8124.

## Design

Space Grotesk Variable supplies the name and headings, Inter Variable the body, and JetBrains Mono Variable small labels. Shared colors include `#f6f5ef`, `#222923`, `#4b554d`, `#626c64`, `#2a5a42`, and `#d5dad6`.

The portal is one original Canvas sprite: carved stone, bronze inlay, moss, runes, and green energy. The stonework is cached once; only the aperture is updated, capped at 30 frames per second. The loop stops offscreen, when the tab is hidden, when paused, or with reduced motion. A static PNG remains available without JavaScript.

Hover or keyboard focus visibly charges the portal. Destination buttons resist a gentle pull toward its center while shedding pixel flecks. Their stationary hit areas keep the links easy to click. A normal click pulls the button out of its place, shrinks it, and spirals it into the portal's animated tunnel before navigating to that button's destination. Personal Site and Recruiter Portal keep their existing URLs; View Projects and the portal itself enter the project catalog. Modified clicks retain normal browser behavior. Back to portal returns to the entrance; browser history and the #projects address work too. Focus moves with the view. Reduced motion or Pause makes navigation immediate.

The existing destination links and native project disclosure remain usable without JavaScript. Flat pixel borders have no shadows, and the four interest areas are individually separated. No image generation service, external request, dependency, or build step is used.

## License

See [LICENSE](LICENSE). Bundled font licenses are in `assets/fonts/`.

## Production package

Run `python scripts/package_site.py` to stage the explicit public-file allowlist in a new, empty `_site/` directory. Publish only that directory. The packager rejects missing assets, unapproved references, symlinks, and nonempty output; repository documents, scripts, and unused artwork stay out of the artifact. Remove only the rebuildable `_site/` directory before packaging again.

The Pages workflow pins its direct actions to full commit hashes and separates read-only build permissions from deployment permissions. It uploads `_site/`, never the repository root. The upstream upload action still references its internal upload-artifact action by major version.

Both pages restrict resources through a Content Security Policy. Fonts and artwork are local, no analytics or backend calls run, and no user input is evaluated as HTML. Animation honors reduced motion and pause controls. Production hosting must enforce HTTPS; response headers and redirects must be checked on the deployed hostname. The local preview does not certify those host settings.
