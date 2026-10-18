# AmioShishu

A quiet, Notion-inspired pistachio-and-sourdough portfolio for Kazi Anik Arman, centered on helping children access learning.

For detailed customization instructions, read [CUSTOMIZE.md](CUSTOMIZE.md). The HTML, CSS, and JavaScript include maintenance comments.

## Open it
Extract the ZIP. Open index.html in a modern browser. No installation, dependencies, external fonts, or build process is needed. Open editor.html separately to manage your content.

## Publish on GitHub Pages
1. Create a GitHub repository, for example `amioshishu` (public works with GitHub Free).
2. Upload the CONTENTS of this folder to the repository root. `index.html` must be at the root, not inside an extra `amioshishu` folder. Include the assets folder.
3. In the repository's Settings → Pages, select **Deploy from a branch**, then the branch containing your files (usually main) and **/(root)**. Save.
4. GitHub will display the website URL after deployment. Use that returned URL rather than guessing it.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Photos, posts, and publication dates
Open editor.html locally or at your website's /editor.html address. Add photos, captions, image descriptions, and your contact email. Write a blog post, choose its displayed date and visibility, then click **Save post locally**. The included starter article is a draft for your review.

Click **Export content.js** and replace the repository's existing content.js with that downloaded file. Commit the update. GitHub Pages will republish. Refresh the public website after deployment to see it.

The date is an editable label, not a schedule: any post marked Published is visible after upload, even with a future date. Published posts sort newest first. Drafts are not displayed but remain readable in public source files. Do not put private drafts in a public repository.

Photos are resized in your browser and embedded in content.js. There are three gallery slots plus an optional cover per article. Use JSON backup and restore to move your content between devices. Browser saves are local and may be cleared; exports and backups are your durable copies. If storage fills up, export before closing the tab.

The editor is a local authoring tool, not an authenticated online CMS. A visitor cannot change the deployed website through it: only someone with repository write access can publish. Never paste a GitHub token into website code.

Save an open post before exporting or switching posts. Gallery text is included in export; contact can be changed in the editor. For other page text edit index.html; colors and layout are in style.css. The bread illustration is an original SVG in assets/bread.svg. No third-party image licenses are required.

## Included sections
- Bread-inspired introduction and personal essay adaptation
- Purpose and educational inclusion
- Research, Olympiad learning, and AmioShishu intentions
- Three photo spaces
- Searchable journal with full article dialog
- Email contact
- Separate content editor with local saves and exports

## Checks
JavaScript syntax, local asset references, HTML IDs, and content format were checked. A live-browser visual/interaction review was not available in the build environment. Before launch, review the personal copy, email, mobile layout, and one complete editor → export → upload cycle.
