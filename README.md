# alexleeza.github.io

Recruiter-facing resume site for Alex K. Lee. Companion to [alexklee.com](https://alexklee.com).

Single-page site with a blueprint/schematic design language. No frameworks, no build step, no external CSS. Deploys directly to GitHub Pages.


## File Overview

```
index.html     Site shell (layout, styles, renderer). Rarely needs editing.
data.json      All resume content. This is the only file you edit.
404.html       Custom error page.
robots.txt     Crawler permissions.
sitemap.xml    Search engine sitemap.
README.md      This file.
LICENSE         MIT license.
```


## Editing Your Resume

Open `data.json` in any text editor. Every section of the site is driven by this file.

### Photo

Set the `photo` field to an image filename and place the image in the same directory:

```json
"photo": "headshot.jpg"
```

Set to `null` to show a placeholder box.

### Contact info

Each entry in the `contact` array is either a link or plain text:

```json
{ "label": "you@email.com", "href": "mailto:you@email.com" }
{ "label": "linkedin.com/in/you", "href": "https://linkedin.com/in/you", "external": true }
{ "label": "City, State" }
```

Entries without `href` render as plain text. Set `external` to `true` to open in a new tab.

### Skills

Add an object to the `skills` array inside the appropriate capabilities column:

```json
{ "name": "New Skill", "level": 3 }
```

`level` ranges from 1 to 4 and controls the pip indicator squares.

### Experience

Add an object to the `entries` array under the appropriate category:

```json
{
  "title": "Role Title",
  "org":   "Company Name",
  "date":  "Date Range",
  "desc":  "What you did.",
  "tags":  ["Tag1", "Tag2"],
  "span":  "1yr"
}
```

`span` is optional and adds a small duration annotation.

To create a new category (e.g. VOLUNTEER), add a new object to the `experience` array:

```json
{
  "category": "VOLUNTEER",
  "entries": [ ... ]
}
```

### Projects

Add an object to the `projects` array:

```json
{
  "name": "Project Name",
  "url":  "https://github.com/...",
  "desc": "One-line description.",
  "tags": ["Tech1", "Tech2"]
}
```

Set `url` to `null` if there is no public link.

### Placeholders

Search `data.json` for the word `placeholder` (case-insensitive) to find all values that need your real information: email, LinkedIn, GitHub, GPA, company names, and organization names.


## Local Testing

The site uses `fetch()` to load `data.json`, which does not work when opening the HTML file directly from your filesystem. To test locally, start a simple server:

```
cd alexleeza.github.io
python3 -m http.server
```

Then open `http://localhost:8000` in your browser.


## Deploying

1. Push all files to a repository named `alexleeza.github.io`.
2. Go to Settings, then Pages, then set the source to the main branch.
3. The site is live at `https://alexleeza.github.io`.

No build step required.


## Contrast Mode

The page defaults to soft contrast (lower luminance range, easier on the eyes). Visitors can switch to high contrast via the toggle in the top-left corner. The preference persists in localStorage.


## License

See [LICENSE](LICENSE).
