# AmioShishu

A pistachio-and-sourdough portfolio with a quiet notebook design and separate, shareable pages.

## Site structure
Home → Purpose & Inclusion → Projects → Publications → Seminars → My Story → My Sourdough Recipes → Art → Contact.

The sidebar navigates between real pages, not sections of one long document. Projects replaces the former My Work section. Collections and posts remain editable through the browser editor.

## Update content
Open the hosted `editor.html`, make changes, save your open post, then export `content.js`. Replace that file in GitHub and commit. The existing GitHub Actions workflow runs `node build-site.cjs` and publishes `dist/`. New visible collections and published journal posts automatically get their own pages.

Photos and collections have no fixed item-count limit; browser storage and page size still apply. Local editor saves alone do not update the public site. Keep JSON backups.

## Change the code
Read [CUSTOMIZE.md](CUSTOMIZE.md) for the full file map, editing instructions, recipes and projects, social/CV settings, URL rules, and troubleshooting.

- `_pages/template.html`: shared shell and header.
- `_pages/*.html`: home, story, purpose, photos, journal, and contact copy.
- `content.js`: collections and posts.
- `style.css`: design.
- `header-links.js`: social links and CV path.
- `build-site.cjs`: page generation and sidebar order.

## Local preview

```sh
node build-site.cjs
python3 -m http.server 8000 --directory dist
```

Visit http://localhost:8000/. Node is the only build requirement; no packages need installing. Do not edit generated dist files. The old root index.html has been replaced by source fragments and generated pages.

## Verification
The page build, internal navigation targets, local asset references, JavaScript syntax, active sidebar state, custom collection generation, and published-post rendering were checked. Live visual browser review was not available in the development environment.
