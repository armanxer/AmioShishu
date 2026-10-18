# Make AmioShishu your own

This is a small, dependency-free website. You can edit it with a normal text editor or GitHub's file editor. There is no build command, package installation, database, or paid service required by the code.

## 1. Where everything lives

| File | What it controls | When to edit it |
| --- | --- | --- |
| `index.html` | Navigation, story, purpose, work, contact copy | Change your words or add a section |
| `style.css` | Colors, spacing, type, mobile layout | Change the visual design |
| `content.js` | Email, gallery, saved blog posts | Update content directly or replace with editor export |
| `content-model.js` | Shared validation and migration of older backups | Change the content schema |
| `app.js` | Gallery rendering, journal search, article dialog | Change public-site behavior |
| `editor.html` | Editor form and instructions | Change editor labels or fields |
| `editor.js` | Photo resizing, local saving, importing, exporting | Change the editing workflow |
| `assets/bread.svg` | Original pistachio bread illustration | Replace or edit the illustration |
| `.nojekyll` | Tells Pages to serve the static files directly | Leave it in place |
| `LICENSE` | Existing repository license | Review it separately before changing licensing |

The public page loads `content.js`, then `content-model.js`, then `app.js`. Both use `defer`, so the page's HTML is ready when JavaScript runs. Keep that order.

## 2. Easiest content workflow

1. Open `editor.html` in your browser. You can open it from the extracted folder or the deployed website.
2. Add photos, captions, descriptions, and your email.
3. Create or select a journal post. Enter a title, date, category, summary, and body.
4. Choose Draft or Published. Click **Save post locally** before switching posts or exporting.
5. Click **Export content.js**.
6. Replace the repository's `content.js` with the downloaded file and commit the change.
7. Wait for GitHub Pages to deploy. Refresh the public website.

The public page reads the deployed `content.js`, not your editor's local browser storage. Saving locally alone will not update it. Even the Back to website link shows the last file version, not unsaved editor changes.

Use **Download JSON backup** regularly. Restore backups with the JSON file input. A backup contains saved content; save your open post first. Local browser storage does not sync between devices, different browsers, local files, and the hosted URL. Clearing browser data can remove it.

## 3. Edit text and navigation

In `index.html`, look for comments such as `STORY`, `PURPOSE`, and `WORK`. Replace the words between tags:

```html
<p>Write your new paragraph here.</p>
```

Keep tags and class names intact. For a visible ampersand in HTML, write `&amp;`. Use `<strong>important words</strong>` for emphasis. In the blog editor, write plain text; HTML and Markdown formatting are not interpreted.

Navigation links match section IDs:

```html
<a href="#resources">Resources</a>
<section id="resources" class="section">
  <p class="eyebrow">LEARNING TOGETHER</p>
  <h2>Resources to share</h2>
  <p>Add your description here.</p>
</section>
```

Add the link inside `<nav>` and the section inside `<main>`. IDs must be unique. Avoid renaming IDs referenced in `app.js`, including `gallery`, `posts`, `search`, and `post-dialog`.

To add a work item, copy one entire `<article>...</article>` inside `.work-grid`. Update its number, heading, paragraph, and tag. Keep plans phrased as plans until they have happened.

## 4. Change colors, width, or type

At the top of `style.css`, the `:root` block is your control panel:

```css
:root {
  --cream: #faf9f5;      /* Page background */
  --ink: #32392e;        /* Main text */
  --green: #526747;      /* Emphasis and links */
  --pistachio: #e8edda;  /* Callouts and illustration background */
  --muted: #74796e;      /* Supporting text */
  --line: #e3e5dc;       /* Dividers and borders */
  --page-width: 960px;   /* Maximum document width */
}
```

The design uses your device's system font, like a clean document editor. The small handwritten bread caption uses Georgia. Change `body`'s `font` declaration to change normal text. Change the `h1`, `h2`, and `h3` rules for headings. Adjust `.section` padding for vertical spacing. A smaller `--page-width` gives a narrower notebook feel.

CSS rules at the bottom inside `@media` apply to smaller screens. Test at approximately 375px and 768px widths after changing widths or grids. Keep text comfortably readable against the background.

## 5. Photos

The editor accepts JPEG, PNG, and WebP, up to 15 MB per source image. It resizes to a maximum dimension of 1600px and exports WebP at quality 0.82. The image is embedded in `content.js`, so there is no separate upload step for the image.

For many images, separate assets can keep the content file easier to edit. Upload `assets/my-photo.jpg`, then set the relevant `image` field in `content.js` to `assets/my-photo.jpg`. Use relative paths without a starting slash so the website works under the GitHub project subdirectory.

`caption` is visible below a gallery image. `alt` describes its meaningful content for screen readers. `placeholder` appears when no photo is set. A blog cover has its own `image` and `alt` fields. Empty `image` means no cover.

Gallery images are cropped to 4:3 by `object-fit: cover`. Change `.gallery img` to `object-fit: contain` if preserving the full frame matters more than uniform cropping. To replace the bread illustration, change the hero `<img>` source and alt text in `index.html`.

The gallery has no fixed slot count. Use **+ Add photo slot**, select multiple files with **Add multiple photos**, or delete and reorder slots. The same controls support photos inside custom entries and extra photos in journal posts.

## 6. Blog dates and visibility

A complete example post object:

```js
{
  id: "a-new-beginning",        // Unique and stable; do not reuse another post's ID.
  title: "A new beginning",
  date: "2026-10-18",           // YYYY-MM-DD, not a localized date string.
  category: "Learning",
  excerpt: "A short introduction.",
  body: "First paragraph.\n\nSecond paragraph.",
  image: "",                   // Optional image path or exported image data.
  alt: "",
  published: false             // Change to true when ready to display.
}
```

Dates are customizable display labels. They are not scheduled jobs: a Published post with a future date appears as soon as its content file is deployed. Published posts sort newest date first. Dates are formatted in English in `dateLabel()` in `app.js`; change its `en-GB` locale if desired.

Drafts are hidden from the journal but are present in public source files after upload. Keep confidential writing outside the repository. The included first post is a draft, so an empty journal initially is expected.

## 7. How the JavaScript works

`app.js` reads `window.AMIO_CONTENT`, builds the gallery, and renders published posts. Search filters the title, summary, category, and full body. Selecting a post opens a native HTML dialog. Escape or the close button dismisses it. Text uses `textContent` so writing is displayed as text rather than executed as HTML.

`editor.js` keeps an editable copy called `data`. `persist()` saves it to localStorage. `imageData()` resizes photos. `loadPost()` fills the form; submitting the form saves it back to `data`. `download()` exports a file. `validate()` checks backup structure before import.

This is a local content tool, not a login-protected CMS. Public visitors can open the editor, but their edits remain in their own browser. They cannot modify your repository or live site through it. Never add GitHub tokens, passwords, or API secrets to these files.

## 8. GitHub Pages and troubleshooting

In repository Settings → Pages, use **Deploy from a branch**, select **main** and **/(root)**, then save. The repository root must contain `index.html`. GitHub's Pages settings will display the live URL after deployment.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

- **Changes do not appear:** check that you committed the exported file, that Pages finished deploying, and then refresh or hard-refresh the page.
- **Journal is empty:** mark a post Published, save it, export, and replace `content.js`.
- **Saved text disappeared:** ensure you saved the post before selecting another. Import your most recent JSON backup if needed.
- **Browser storage full:** export before closing the tab. Reduce image count or size; use separate asset files for a large collection.
- **Broken images:** check filename capitalization and relative paths. GitHub filenames are case-sensitive.
- **Blank dynamic sections:** inspect the browser console for a JavaScript syntax error, often a missing comma or quote in manually edited `content.js`.
- **Local preview differs from editor:** the preview reads the local `content.js` file. Replace it with your export and refresh.
- **404 after deployment:** confirm the publishing branch/folder and that index.html is at its root.

## 9. Before publishing a change

Open the site on desktop and phone. Follow navigation links, open and close an article, test search, and check photo captions. For editor changes, try one photo and one draft, export, and replace the local content file before updating GitHub. Keep a backup of working files. Avoid changing several unrelated behaviors at once; small commits are easier to undo.


## 10. Expand your notebook: photos, posts, and sidebar sections

There is no fixed application limit on the number of photos, journal posts, sections, or entries. Browser storage, available memory, and total page download size still matter. For a large collection, store images in `assets/` and use image paths instead of embedding all photos in content.js.

### Photos
- **+ Add photo slot** creates one editable slot; open its disclosure panel to fill it in.
- **Add multiple photos** imports multiple selected files in sequence.
- **Move up / Move down** reorder photos; **Delete photo slot** removes the whole slot.
- An image URL/path field supports separate assets. Caption, alt text, and placeholder remain editable.
- Posts have a cover plus **Additional post photos**. Save the post before switching or exporting.

### Custom sidebar sections
1. In the editor's **Sidebar sections**, click **+ Publications**, **+ Seminars**, **+ Art**, or **+ Custom section**. Presets only name an empty section; they do not create fictional content.
2. Expand the section to rename its title/sidebar label, write an introduction, or toggle visibility.
3. Click **+ Add entry**, then expand that entry. Add a title, optional date, description/citation, external URL and link label.
4. Add as many entry photos as you need. A publication might have a citation and paper link; a seminar might have event details and photos; an art entry might contain a collection of images.
5. Reorder sections, entries, and photos with Move up/down. Deleting a section deletes its entries after confirmation.
6. Export content.js and replace it in GitHub as before.

Custom sections appear after the journal and before contact. Desktop navigation is a left sidebar; on smaller screens it becomes a wrapped navigation block above the page. Built-in sections stay fixed. Each custom section's title automatically becomes its sidebar link. IDs remain stable when titles change.

Section/gallery text changes save locally as you type. A journal post still requires **Save post locally**, including changes to its extra photos. Unsaved post form changes are not included in backups or exports.

Older content files and JSON backups still load. The shared validator initializes missing `sections` and post `photos` arrays. Existing saved work is retained under the same browser-storage key.

New section data shape:

```js
sections: [{
  id: "section-my-publications", // Unique stable ID; letters, digits, hyphens, underscores.
  title: "Publications",
  description: "Research and writing.",
  published: true,
  entries: [{
    title: "Paper title",
    date: "2026-10-18",         // Or empty string.
    body: "Citation and notes.",
    url: "https://example.com/paper",
    linkLabel: "Read paper",
    photos: []                 // Same objects as gallery: image, caption, alt, placeholder.
  }]
}]
```

A hidden section is excluded from both public content and sidebar, but remains in the exported public source. Entry dates do not schedule publication. Links only render for HTTP/HTTPS URLs. Keep HTML IDs and script order intact if modifying the code.
