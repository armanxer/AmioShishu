/* PUBLIC WEBSITE
 * Loads window.AMIO_CONTENT from content.js (script order matters).
 * No server or dependencies: works locally and on GitHub Pages.
 * Use textContent for user-authored text; do not replace it with innerHTML.
 * HTML IDs referenced below must stay in sync with index.html.
 */
'use strict';

const content=window.AMIO_CONTENT;

const make=(tag,cls,text)=>{const e=document.createElement(tag);
if(cls)e.className=cls;
if(text!==undefined)e.textContent=text;
return e};

// Allow embedded photos, relative assets, and HTTPS image URLs.
const safeImage=s=>typeof s==='string'&&(/^(data:image\/(png|jpeg|webp);base64,)/.test(s)||(/^assets\/[\w./-]+$/.test(s)&&!s.includes('..'))||/^https:\/\//.test(s));

// Noon prevents a date-only value from shifting to the previous day in local time.
const dateLabel=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)?new Date(s+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'Undated';

// Build the three gallery slots; missing images become labeled placeholders.
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

