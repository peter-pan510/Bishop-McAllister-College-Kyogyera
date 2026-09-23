# Bishop McAllister College Kyogyera &mdash; Website

A front-end-only, multi-page website for Bishop McAllister College Kyogyera (BMCK),
an Anglican boarding secondary school and seminary in Kyogyera, western Uganda.
Plain HTML, CSS and JavaScript &mdash; no build step, no backend, no dependencies.
It can be deployed to any static host (GitHub Pages, Netlify, Vercel, cPanel, etc.)
by uploading these files as they are.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | Our Story &mdash; history, crest symbolism, mission/vision, impact |
| `academics.html` | O-Level, A-Level, seminary track, subjects, co-curricular |
| `admissions.html` | Requirements, how to apply, FAQ, inquiry form |
| `gallery.html` | Photo gallery with category filters + lightbox |
| `memories.html` | Memory Lane &mdash; year-by-year alumni memories with real photos and a full-screen photo viewer |
| `staff.html` | Rector, leadership team, teaching departments |
| `news.html` | School life / events calendar |
| `contact.html` | Contact details, map link, general inquiry form |

Shared code lives in `assets/css/style.css` and `assets/js/main.js`, so editing
one thing (e.g. the navigation, the footer, the colour palette) usually means
editing it in every page's copy of that markup &mdash; there's no templating engine,
by design, so the site needs nothing but a web server to run.

## Before you go live &mdash; things to fill in

Real information was used wherever it could be verified (founding year 1983,
the Anglican Diocese of West Ankole, the Rector's name, the 2007&ndash;2021 facility
timeline, the motto and crest). Everything below is a clearly-marked placeholder
that still needs the school's real details:

1. **Contact details.** Open `assets/js/main.js` and fill in the `window.BMCK`
   config block at the top: `admissionsEmail`, `generalEmail`, `phone`. These
   values automatically populate every `data-cfg="..."` element across all
   pages (currently shown as `[Add phone number]` / `[Add office email]` etc.
   in the footer and contact/admissions pages).
2. **Physical address.** Update the `address` value in the same config block,
   and the matching text in each page's footer (`Kyogyera, Ankole Sub-region...`).
3. **Photos.** Every image tile (gallery, home preview, news cards) is a
   deliberately-styled placeholder (`.ph-photo`), not a real photo, so nothing
   pretends to show the actual campus. To swap one in: replace the `<div class="ph-photo">...</div>`
   block with an `<img>` tag pointing at a real photo saved under
   `assets/images/gallery/`. Keep the `data-caption` attribute if you want the
   lightbox caption to keep working on `gallery.html`.
4. **Staff names & photos.** `staff.html` has a full leadership grid with
   `[Add Name]` placeholders and generic avatar icons &mdash; the Rector (Rev.
   Canon Paul Jeffries) is the only name currently filled in. Replace the
   `<b>[Add Name]</b>` text and swap the `.avatar` div for an `<img>` once you
   have real photos.
5. **Fee structure.** Deliberately left as "contact the Bursar's office" rather
   than invented numbers &mdash; add real fees to the card in `admissions.html`
   once confirmed for the academic year.
6. **News & events.** `news.html` ships with recurring, generic event types
   (Term Opening Day, Prize-Giving Day, etc.) rather than invented specific
   headlines. Replace with real dated posts as they happen.
7. **Subjects & term dates.** The subject lists in `academics.html` and the
   term dates in `admissions.html` reflect typical Uganda secondary-school
   patterns &mdash; confirm exact current offerings with the academic office.

Everything else (the Facebook link, the crest artwork, the founding history,
the impact figures) is sourced from the school's public presence and should
not need editing.

## Memory Lane photos

`memories.html` uses real photos stored in `assets/images/memories/`, resized to
at most 1400px and converted to WebP. The small copies in `thumbs/` are used
only for the photo collage at the top of the page. To add a photo, save it as a
`.webp` file there and copy one of the `<button class="shot">` blocks. Change its
`src`, `alt` and `data-caption`. The photo viewer (`assets/js/memories.js`) finds
every photo on the page automatically. Its CSS is at the end of `style.css`
under *Memory Lane*.

## Crest artwork

`assets/images/bmck-crest.webp` and `bmck-crest-square.webp` are the crest you
provided, cropped and compressed for the web. The favicon files
(`favicon-32.png`, `favicon-64.png`, `favicon-192.png`, `favicon-512.png`) were
generated from the same artwork.

## Running it locally

No build tools needed &mdash; any static file server works:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying

Upload the whole folder as-is to any static host:

- **GitHub Pages** &mdash; push to a repo, enable Pages on the `main` branch.
- **Netlify / Vercel** &mdash; drag-and-drop the folder, or connect the repo.
- **Any shared host / cPanel** &mdash; upload via FTP into `public_html`.

No environment variables, no database, no server-side code required.
