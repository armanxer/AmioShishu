/* PUBLIC WEBSITE
 * Loads window.AMIO_CONTENT from content.js (script order matters).
 * No server or dependencies: works locally and on GitHub Pages.
 * Use textContent for user-authored text; do not replace it with innerHTML.
 * HTML IDs referenced below must stay in sync with index.html.
 */
'use strict';

const content=AmioModel.validate(window.AMIO_CONTENT);

const make=(tag,cls,text)=>{const e=document.createElement(tag);
if(cls)e.className=cls;
if(text!==undefined)e.textContent=text;
return e};

// Allow embedded photos, relative assets, and HTTPS image URLs.
const safeImage=s=>typeof s==='string'&&(/^(data:image\/(png|jpeg|webp);base64,)/.test(s)||(/^assets\/[\w./-]+$/.test(s)&&!s.includes('..'))||/^https:\/\//.test(s));

// Noon prevents a date-only value from shifting to the previous day in local time.
const dateLabel=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)?new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Undated';

// Build all gallery slots; missing images become labeled placeholders.
content.gallery.forEach(g=>{const f=make('figure');
if(safeImage(g.image)){const i=make('img');
i.src=g.image;
i.alt=g.alt||g.caption;
i.loading='lazy';
f.append(i)}else{const d=make('div','photo-slot');
d.append(make('b','',g.placeholder||'A moment to share'),make('small','','PHOTO TO COME'));
f.append(d)}f.append(make('figcaption','',g.caption));
document.querySelector('#gallery').append(f)});

const dialog=document.querySelector('#post-dialog');

// Article modal: body text keeps line breaks via CSS white-space: pre-wrap.
function openPost(p){document.querySelector('#article-title').textContent=p.title;
document.querySelector('#article-meta').textContent=dateLabel(p.date)+' / '+p.category;
document.querySelector('#article-body').textContent=p.body;
const im=document.querySelector('#article-image');
im.hidden=!safeImage(p.image);
if(!im.hidden){im.src=p.image;
im.alt=p.alt||p.title}else im.removeAttribute('src');
document.querySelector('#article-photos')?.remove();
const extra=photoGrid(p.photos);extra.id='article-photos';dialog.append(extra);
dialog.showModal()}
// Published entries only. Search title, summary, category, and body; newest date first.
// Dates are display labels, not automatic publication schedules.
function renderPosts(){const q=document.querySelector('#search').value.toLowerCase();
const list=content.posts.filter(p=>p.published&&[p.title,p.excerpt,p.category,p.body].join(' ').toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date));
const root=document.querySelector('#posts');
root.replaceChildren();
if(!list.length){root.append(make('p','',q?'No notes match your search.':'The journal is still rising. Notes on learning, research, and making things will appear here.'));
return}list.forEach(p=>{const b=make('button','post');
const m=make('span','post-meta',dateLabel(p.date)+' · '+p.category);
const c=make('div');
c.append(make('h3','',p.title),make('p','',p.excerpt));
b.append(m,c,make('span','arrow','↗'));
b.addEventListener('click',()=>openPost(p));
root.append(b)})}
document.querySelector('#close-post').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();
if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
document.querySelector('#search').addEventListener('input',renderPosts);
if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email))document.querySelector('#email').href='mailto:'+content.email;
document.querySelector('#year').textContent=new Date().getFullYear();
renderPosts();


// Render arbitrary photo arrays. Shared by custom entries and additional blog photos.
function photoGrid(items) {
  const grid=make('div','gallery');
  (items||[]).forEach(p=>{
    const figure=make('figure');
    if(safeImage(p.image)){
      const img=make('img');img.src=p.image;img.alt=p.alt||p.caption;img.loading='lazy';figure.append(img);
    }else{
      const slot=make('div','photo-slot');slot.append(make('b','',p.placeholder||'A moment to share'));figure.append(slot);
    }
    figure.append(make('figcaption','',p.caption));grid.append(figure);
  });
  return grid;
}
// Prefix section anchors to prevent collisions with fixed HTML IDs.
const sidebar=document.querySelector('#section-nav');
function sidebarLink(title,target){const a=make('a','',title);a.href='#'+target;sidebar.append(a);}
[['My story','story'],['The purpose','purpose'],['My work','work'],['Photos','gallery'],['Journal','journal']].forEach(([t,id])=>sidebarLink(t,id));
(content.sections||[]).filter(s=>s.published).forEach(s=>{
  const section=make('section','section custom-section');section.id='custom-'+s.id;
  sidebarLink(s.title,section.id);
  const title=make('div','section-title');
  const heading=make('div');heading.append(make('p','eyebrow','THE NOTEBOOK'),make('h2','',s.title));
  title.append(heading,make('span','section-count',s.entries.length+' '+(s.entries.length===1?'entry':'entries')));
  section.append(title,make('p','section-description',s.description));
  if(!s.entries.length){
    const empty=make('div','section-empty');
    empty.append(make('h3','',s.title==='Art'?'A space for making.':s.title==='Seminars'?'Conversations worth sharing.':'Questions worth exploring.'),make('p','','This collection is being put together. New additions will appear here.'));
    section.append(empty);
  }
  s.entries.forEach(entry=>{
    const article=make('article','custom-entry');article.append(make('h3','',entry.title));
    if(entry.date)article.append(make('p','post-meta',dateLabel(entry.date)));
    article.append(make('p','entry-body',entry.body));
    if(AmioModel.safeLink(entry.url)){const a=make('a','text-link',entry.linkLabel||'Read more');a.href=entry.url;a.target='_blank';a.rel='noopener noreferrer';article.append(a);}
    if(entry.photos.length)article.append(photoGrid(entry.photos));section.append(article);
  });
  document.querySelector('#custom-sections').append(section);
});
sidebarLink('Say hello','connect');

// Highlight the section currently in view without changing focus or scroll position.
if('IntersectionObserver' in window){
  const links=Array.from(sidebar.querySelectorAll('a'));
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){if(!entry.isIntersecting)continue;
      links.forEach(link=>{
        const active=link.getAttribute('href')==='#'+entry.target.id;
        link.classList.toggle('is-active',active);
        if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
      });
    }
  },{rootMargin:'-10% 0px -65% 0px',threshold:0});
  links.forEach(link=>{const target=document.getElementById(link.hash.slice(1));if(target)observer.observe(target);});
}
