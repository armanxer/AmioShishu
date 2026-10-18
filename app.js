/* Multipage renderer: the build embeds the current page and navigation metadata.
 * Shared relative paths resolve from the site root, including GitHub project hosting.
 * All author-entered text is assigned via textContent, never interpreted as HTML.
 */
'use strict';
const content = AmioModel.validate(window.AMIO_CONTENT);
const page = window.AMIO_PAGE;
const make = (tag, cls, text) => {
  const element = document.createElement(tag);
  if (cls) element.className = cls;
  if (text !== undefined) element.textContent = text;
  return element;
};
const url = route => page.root + (route ? route + '/' : '');
const imageURL = image => image.startsWith('assets/') ? page.root + image : image;
const dateLabel = date => new Date(date + 'T12:00:00').toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'});
function photoGrid(photos) {
  const grid = make('div', 'gallery');
  for (const photo of photos || []) {
    const figure = make('figure');
    if (AmioModel.safeImage(photo.image)) {
      const image = make('img'); image.src = imageURL(photo.image);
      image.alt = photo.alt || photo.caption; image.loading = 'lazy'; figure.append(image);
    } else {
      const placeholder = make('div', 'photo-slot');
      placeholder.append(make('b', '', photo.placeholder || 'A moment to share'));
      figure.append(placeholder);
    }
    figure.append(make('figcaption', '', photo.caption)); grid.append(figure);
  }
  return grid;
}
// Real document navigation: supports bookmarks, new tabs, refresh, and browser history.
const sidebar = document.querySelector('#section-nav');
for (const item of page.nav) {
  const link = make('a', '', item.title); link.href = url(item.route);
  if (item.route === page.route || (page.kind === 'post' && item.route === 'journal')) {
    link.className = 'is-active'; link.setAttribute('aria-current', 'page');
  }
  sidebar.append(link);
}
function entryArticle(entry) {
  const article = make('article', 'custom-entry');
  article.append(make('h2', '', entry.title));
  if (entry.date) article.append(make('p', 'post-meta', dateLabel(entry.date)));
  article.append(make('p', 'entry-body', entry.body));
  if (AmioModel.safeLink(entry.url)) {
    const link = make('a', 'text-link', entry.linkLabel || 'Read more');
    link.href = entry.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; article.append(link);
  }
  if (entry.photos.length) article.append(photoGrid(entry.photos));
  return article;
}
if (page.kind === 'section') {
  const section = content.sections.find(s => s.id === page.id && s.published);
  const root = document.querySelector('#page-content');
  if (section) {
    root.append(make('p', 'eyebrow', 'AMIOSHISHU / THE NOTEBOOK'), make('h1', '', section.title), make('p', 'page-intro', section.description));
    if (!section.entries.length) {
      const empty = make('div', 'section-empty');
      empty.append(make('h2', '', section.id === 'sourdough-recipes' ? 'Still in the kitchen.' : 'A collection in progress.'),make('p', '', 'New additions will appear here.'));
      root.append(empty);
    }
    section.entries.forEach(entry => root.append(entryArticle(entry)));
  }
}
const gallery = document.querySelector('#gallery');
if (gallery) { gallery.classList.remove('gallery'); gallery.append(photoGrid(content.gallery)); }
const postsRoot = document.querySelector('#posts');
if (postsRoot) {
  const search = document.querySelector('#search');
  const render = () => {
    const query = search.value.toLowerCase();
    const posts = content.posts.filter(p => p.published && [p.title,p.category,p.excerpt,p.body].join(' ').toLowerCase().includes(query)).sort((a,b)=>b.date.localeCompare(a.date));
    postsRoot.replaceChildren();
    if (!posts.length) postsRoot.append(make('p', '', query ? 'No notes match your search.' : 'The journal is still rising. New notes will appear here.'));
    for (const post of posts) {
      const link = make('a', 'post'); link.href = url(page.postRoutes[post.id]);
      const text = make('div'); text.append(make('h3','',post.title),make('p','',post.excerpt));
      link.append(make('span','post-meta',dateLabel(post.date)+' · '+post.category),text,make('span','arrow','↗'));
      postsRoot.append(link);
    }
  };
  search.addEventListener('input', render); render();
}
if (page.kind === 'post') {
  const post = content.posts.find(p => p.id === page.id && p.published);
  const root = document.querySelector('#page-content');
  if (post) {
    const back = make('a', 'text-link', '← All journal entries'); back.href = url('journal');
    root.append(back, make('p','post-meta',dateLabel(post.date)+' · '+post.category),make('h1','',post.title));
    if (AmioModel.safeImage(post.image)) { const image=make('img','post-cover');image.src=imageURL(post.image);image.alt=post.alt||post.title;root.append(image); }
    root.append(make('div','entry-body',post.body),photoGrid(post.photos));
  }
}
const email = document.querySelector('#email');
if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) email.href = 'mailto:' + content.email;
document.querySelector('#year').textContent = new Date().getFullYear();
