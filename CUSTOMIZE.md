# Customizing AmioShishu

The website now uses separate pages. GitHub Actions runs `node build-site.cjs` and publishes only the generated `dist/` folder. You do not need to run a build manually when editing on GitHub: committing your changes triggers it.

## Page order and URLs

| Sidebar label | Path after your GitHub Pages project URL |
| --- | --- |
| Home | `/` |
| Purpose & Service | `/purpose/` |
| Projects | `/projects/` |
| Publications | `/publications/` |
| Seminars | `/seminars/` |
| My Story | `/my-story/` |
| My Sourdough Recipes | `/sourdough-recipes/` |
| Art | `/art/` |
| Journal | `/journal/` |
| Photos | `/photos/` |
| Contact | `/contact/` |

The order puts your purpose, projects, research, and engagement near the top, followed by personal interests and writing. This is a presentation choice, not a universal admissions rule. Change the `pages` array in `build-site.cjs` to reorder it.

These are actual `folder/index.html` documents. Links open different pages, and direct links, refresh, browser history, and opening in a new tab work without a special server. On a GitHub project site, the project prefix remains in the address: `/AmioShishu/projects/`, for example.

## File map

| File | Purpose |
| --- | --- |
| `_pages/template.html` | Shared header, sidebar container, footer, scripts, and document structure |
| `_pages/home.html` | Home introduction, bread image, and compact identity caption |
| `_pages/purpose.html` | Purpose and service text |
| `_pages/my-story.html` | Essay adaptation |
| `_pages/photos.html` | Photo-page heading and gallery container |
| `_pages/journal.html` | Journal heading and search interface |
| `_pages/contact.html` | Contact-page text |
| `content.js` | Email, photos, posts, projects, recipes, and other collections |
| `header-links.js` | Your social links and CV path |
| `style.css` | Pistachio theme, layout, typography, responsive rules |
| `content-model.js` | Shared data validation and older-backup migration |
| `app.js` | Render the current page's content and navigation |
| `editor.html`, `editor.js` | Browser-based content editor |
| `build-site.cjs` | Generates pages, readable routes, and sidebar metadata |
| `assets/` | Illustration, uploaded photos, and CV PDF |
| `.github/workflows/static.yml` | Builds and deploys the website |

`dist/` is generated output. Do not edit its files as your source; rebuilding replaces them. The former long root index.html is no longer the source. Edit the corresponding `_pages/` fragment instead.

## Edit content without touching layout code

1. Open `editor.html` at the root of your hosted website.
2. Add photos, posts, or entries in Projects, Publications, Seminars, My Sourdough Recipes, and Art.
3. Save an open journal post before switching to another post or exporting. Collection fields save locally as you type.
4. Export `content.js`.
5. Replace the repository's `content.js` and commit it.
6. GitHub Actions generates the separate pages and deploys them.

Local editor storage is not the live site. Use JSON backups to keep copies of saved work and move between devices. The editor cannot write directly to GitHub. Large embedded photo collections may exceed browser storage; export before closing the tab if storage is full.

## Projects and recipes

Both are ordinary editable collections. Expand the collection in the editor and click **Add entry**. Every entry supports a title, optional date, multiline text, an external link, and as many photos as you need.

For a project, use the text for its question, your role, method, result, and what you learned. Add a repository or paper link if available. For a recipe, use headings in plain text and line breaks, for example:

```text
Ingredients
List your actual quantities here.

Method
1. Your first step.
2. Your next step.

Notes
What you changed and what you would try next.
```

No recipes or project results have been invented for you. Empty collections show a simple placeholder until you add entries. The old My Work section and its broad category cards have been removed.

## Add more pages

Use **Custom section** in the editor. After exporting and committing, the build creates a page for every visible collection and adds it to the sidebar. There is no fixed count limit.

Built-in page paths stay fixed. Custom page paths are derived from their titles: “Community Teaching” becomes `/community-teaching/`. Duplicate paths receive `-2`, `-3`, and so on. To pin a custom path while changing its title, add an optional `slug` string to that section in content.js, such as `"slug": "community-teaching"`. Stick to letters, digits, and hyphens.

Renaming a custom collection without a pinned slug changes its URL. Hidden collections have no public page or sidebar link after rebuilding. Their data still exists in the public content file; hiding content is not privacy protection. Deleted or hidden pages may return 404, so update any links you shared.

## Journal and publication dates

A Published post gets its own readable address under `/journal/`, based on its title. For example, “A little flour” becomes `/journal/a-little-flour/`. Search filters the journal listing; selecting a result navigates to that post's page. You can pin the URL with an optional `slug` on the post in content.js.

Dates use `YYYY-MM-DD`. They are editable display dates, not scheduling rules. A Published post with a future date appears after deployment. Draft posts have no generated page, but remain readable in the public source file. Keep private writing outside this repository.

## Photos and assets

Add one slot or upload several photos together. Reorder and delete slots as needed. Journal posts have a cover plus additional photos; collection entries have photo lists. Use captions for visible descriptions and alt text for screen readers.

Uploads accept PNG, JPEG, or WebP up to 15 MB each. They are resized to a maximum dimension of 1600px and embedded as WebP in exported content.js. For larger collections, upload images into `assets/` and enter paths such as `assets/seminar-01.jpg` instead. Asset filenames are case-sensitive. Avoid spaces in filenames.

Always enter paths relative to the site root, like `assets/photo.jpg`. The page code adds the correct prefix on nested pages. Do not add `/AmioShishu/` or `../` manually to content image fields.

## Social links and CV

Edit `HEADER_LINKS` in header-links.js. Blank values remain disabled placeholders. Social profiles use full HTTPS URLs. Upload a PDF such as `assets/Arman-CV.pdf`, then set the CV value to that relative path. The script resolves it correctly from every subpage. Externally hosted PDFs open in a new tab; use a local asset for the direct download behavior.

To add or remove a social label, edit `.header-links` in `_pages/template.html` and match the `data-header-link` key to HEADER_LINKS. Content editor exports do not change these settings.

## Colors, fonts, and alignment

The `:root` variables in style.css control cream, ink, green, pistachio, muted text, and divider colors. The `.notebook-layout` rules control the shared sidebar/content grid. Page-specific fragments inherit that grid. The `.page-heading` and `.page-collection` rules control subpage headings.

The header stays consistent across pages; the sidebar marks the active page. On smaller screens it wraps into a compact navigation block. The system font keeps the notebook style. Test mobile widths after editing layout or typography.

## Local preview and troubleshooting

With Node installed, run:

```sh
node build-site.cjs
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/` in your browser. A local server is recommended because clean directory URLs are designed for HTTP hosting.

- **Changes are missing:** check that the GitHub Actions deployment finished successfully, then refresh.
- **Build fails:** check Actions logs and the JSON syntax in content.js; keep the `window.AMIO_CONTENT = {...};` assignment.
- **A photo breaks only on subpages:** use `assets/name.jpg` in content.js and check capitalization.
- **A page is missing:** ensure the collection is marked visible, then export, commit, and wait for the build.
- **Journal looks empty:** mark a saved post Published before exporting.
- **Old backups:** the content model migrates older data and adds the new Projects and Recipes collections once.
- **Need to change static copy:** edit its `_pages/` fragment, not generated output.

Code and generated links are checked during development. A visual browser review is still useful after your own changes, especially at phone widths.
