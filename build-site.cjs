/* Dependency-free build for GitHub Pages.
 * Run: node build-site.cjs
 * Output: dist/ (generated; edit _pages/ fragments and content.js instead).
 * Each page is a real folder/index.html. No SPA fallback or hash routing needed.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const raw = read('content.js');
const match = raw.match(/window\.AMIO_CONTENT\s*=\s*([\s\S]*);\s*$/);
if (!match) throw new Error('content.js must assign a JSON object to window.AMIO_CONTENT.');
const content = JSON.parse(match[1]);
const out = path.join(root, 'dist');
fs.rmSync(out, {recursive: true, force: true});
fs.mkdirSync(out, {recursive: true});
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'collection';
const routes = new Set(['', 'purpose', 'my-story', 'photos', 'journal', 'contact', 'assets', 'editor']);
const fixed = (route, title, fragment) => ({route, title, kind: 'static', fragment});
const sections = (content.sections || []).filter(s => s.published && s.id !== 'inclusive-education');
const sectionPages = sections.map(s => {
  // Built-in routes stay stable; custom pages use readable slugs. Optional slug pins a URL.
  let route = ['projects','publications','seminars','sourdough-recipes','art'].includes(s.id) ? s.id : slug(s.slug || s.title);
  let candidate = route, n = 2;
  while (routes.has(candidate)) candidate = route + '-' + n++;
  routes.add(candidate);
  return {route: candidate, title: s.title, kind: 'section', id: s.id};
});
const take = id => sectionPages.find(p => p.id === id);
const priority = ['projects', 'publications', 'seminars'];
const extras = sectionPages.filter(p => ![...priority, 'sourdough-recipes', 'art'].includes(p.id));
const pages = [
  fixed('', 'Home', 'home'),
  fixed('purpose', 'Purpose & Inclusion', 'purpose'),
  ...priority.map(take),
  ...extras,
  fixed('my-story', 'My Story', 'my-story'),
  take('sourdough-recipes'), take('art'),
  fixed('contact', 'Contact', 'contact')
].filter(Boolean);
const nav = pages.map(({route, title}) => ({route, title}));
// Journal and Photos have been retired from the public website.
// Preserve stored content for the owner; do not generate those pages.
const postRoutes = {};
const template = read('_pages/template.html');
for (const page of pages) {
  const depth = page.route ? page.route.split('/').length : 0;
  const prefix = depth ? '../'.repeat(depth) : './';
  const config = {...page, root: prefix, nav, postRoutes};
  let body = page.kind === 'static' ? read('_pages/' + page.fragment + '.html') : '<section class="section page-collection" id="page-content"></section>';
  if (page.kind === 'static' && page.fragment !== 'home') {
    body = '<div class="page-heading"><p class="eyebrow">AMIOSHISHU / ' + escape(page.title.toUpperCase()) + '</p><h1>' + escape(page.title) + '</h1></div>' + body;
  }
  const rendered = template.replace('{{BODY}}', body)
    .replaceAll('{{ROOT}}', prefix)
    .replace('{{TITLE}}', escape(page.title))
    .replace('{{PAGE}}', JSON.stringify(config).replace(/</g, '\\u003c'));
  const directory = path.join(out, page.route);
  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(path.join(directory, 'index.html'), rendered);
}
for (const name of ['style.css','app.js','content.js','content-model.js','header-links.js','editor.html','editor.js']) fs.copyFileSync(path.join(root,name),path.join(out,name));
if (fs.existsSync(path.join(root,'assets'))) fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
// Preserve configured domain and static serving marker.
if (fs.existsSync(path.join(root,'CNAME'))) fs.copyFileSync(path.join(root,'CNAME'),path.join(out,'CNAME'));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log('Built '+pages.length+' pages in dist/: '+pages.map(p=>p.route||'/').join(', '));
