/* LOCAL CONTENT EDITOR
 * Edits are held in data, then saved to localStorage or exported.
 * This file never writes to GitHub. Repository permissions control publishing.
 * Form IDs must match editor.html. See CUSTOMIZE.md for the full workflow.
 */
'use strict';

// Keep this key stable to retain saved work across visits in the same browser.
const key='amioshishu-content-v1';
let data=structuredClone(window.AMIO_CONTENT),editing=null,cover='';
const $=id=>document.getElementById(id);
const status=t=>$('status').textContent=t;

// Validate imported JSON before replacing current content.
function validate(d){if(!d||typeof d.email!=='string'||!Array.isArray(d.gallery)||d.gallery.length!==3||!Array.isArray(d.posts))throw Error('Invalid backup format.');
for(const g of d.gallery)for(const k of ['image','caption','alt','placeholder'])if(typeof g[k]!=='string')throw Error('Invalid gallery.');
const ids=new Set();
for(const p of d.posts){for(const k of ['id','title','date','category','excerpt','body','image','alt'])if(typeof p[k]!=='string')throw Error('Invalid post.');
if(ids.has(p.id)||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||typeof p.published!=='boolean')throw Error('Invalid post date, ID or visibility.');
ids.add(p.id)}return d}
try{const saved=localStorage.getItem(key);
if(saved){data=validate(JSON.parse(saved));
status('Restored your locally saved work.')}}catch(e){status('Local storage could not be restored. Using the website content.')}
// Storage may fail (private browsing / quota). Export still works from memory.
function persist(){try{localStorage.setItem(key,JSON.stringify(data));
status('Saved in this browser. Export content.js to update your website.')}catch(e){status('Browser storage is full or unavailable. Your changes remain in this tab: export now to keep them.')}}
// Resize photos to limit download size. Increase 1600 or .82 only if needed.
async function imageData(file){if(!file)return '';
if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>15*1024*1024)throw Error('Choose a PNG, JPEG or WebP image under 15 MB.');
const url=URL.createObjectURL(file);
try{const im=new Image();
im.src=url;
await im.decode();
const scale=Math.min(1,1600/Math.max(im.width,im.height));
const c=document.createElement('canvas');
c.width=Math.round(im.width*scale);
c.height=Math.round(im.height*scale);
c.getContext('2d').drawImage(im,0,0,c.width,c.height);
return c.toDataURL('image/webp',.82)}finally{URL.revokeObjectURL(url)}}
// Build gallery form fields from data.gallery.
function drawPhotos(){$('contact').value=data.email;
$('photo-fields').replaceChildren();
data.gallery.forEach((g,n)=>{const box=document.createElement('div');
const head=document.createElement('h3');
head.textContent='Photo '+(n+1);
head.style.marginTop='25px';
box.append(head);
for(const [field,label] of [['caption','Caption'],['alt','Image description'],['placeholder','Placeholder title']]){const l=document.createElement('label');
l.textContent=label;
const i=document.createElement('input');
i.value=g[field];
i.id=field+n;
l.htmlFor=i.id;
i.oninput=()=>g[field]=i.value;
box.append(l,i)}const l=document.createElement('label');
l.textContent='Upload photo';
const f=document.createElement('input');
f.type='file';
f.accept='image/png,image/jpeg,image/webp';
const img=document.createElement('img');
img.className='editor-preview';
img.hidden=!g.image;
if(g.image)img.src=g.image;
img.alt='Photo preview';
f.onchange=async()=>{try{if(!f.files[0])return;
g.image=await imageData(f.files[0]);
img.src=g.image;
img.hidden=false;
persist()}catch(e){status(e.message)}};
l.append(f);
const remove=document.createElement('button');
remove.textContent='Remove photo';
remove.onclick=()=>{g.image='';
img.removeAttribute('src');
img.hidden=true;
f.value='';
persist()};
box.append(l,img,remove);
$('photo-fields').append(box)})}
// Buttons select saved posts. Save an open post before switching.
function listPosts(){$('editor-posts').replaceChildren();
data.posts.forEach(p=>{const b=document.createElement('button');
b.textContent=(p.published?'Published: ':'Draft: ')+p.title;
b.onclick=()=>loadPost(p);
$('editor-posts').append(b)})}
// Populate the form. A null post creates a fresh, unsaved draft.
function loadPost(p){editing=p?.id||null;
for(const k of ['title','date','category','excerpt','body'])$(k).value=p?.[k]||(k==='date'?[new Date().getFullYear(),String(new Date().getMonth()+1).padStart(2,'0'),String(new Date().getDate()).padStart(2,'0')].join('-'):k==='category'?'Personal notes':'');
$('published').value=String(p?.published||false);
cover=p?.image||'';
$('cover-alt').value=p?.alt||'';
$('cover').value='';
showCover();
$('delete-post').hidden=!editing;
$('form-title').textContent=editing?'Edit your post':'Write a post'}
function showCover(){$('cover-preview').hidden=!cover;
if(cover)$('cover-preview').src=cover;
else $('cover-preview').removeAttribute('src')}
$('cover').onchange=async()=>{try{if(!$('cover').files[0])return;
cover=await imageData($('cover').files[0]);
showCover()}catch(e){status(e.message)}};
$('remove-cover').onclick=()=>{cover='';
$('cover').value='';
showCover()};
$('new-post').onclick=()=>{loadPost(null);
$('post-form').scrollIntoView()};

// Commit the open form to the content object. Export only includes saved posts.
$('post-form').onsubmit=e=>{e.preventDefault();
const p={id:editing||'post-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),image:cover,alt:$('cover-alt').value,published:$('published').value==='true'};
for(const k of ['title','date','category','excerpt','body'])p[k]=$(k).value.trim();
const i=data.posts.findIndex(x=>x.id===editing);
if(i<0)data.posts.push(p);
else data.posts[i]=p;
editing=p.id;
persist();
listPosts();
$('delete-post').hidden=false};

$('delete-post').onclick=()=>{if(editing&&confirm('Delete this post from your local content?')){data.posts=data.posts.filter(p=>p.id!==editing);
persist();
listPosts();
loadPost(null)}};

function saveContact(){if(!$('contact').checkValidity()){$('contact').reportValidity();
return false}data.email=$('contact').value.trim();
return true}
$('save-gallery').onclick=()=>{if(saveContact())persist()};

// Create a browser download, then release its temporary object URL.
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));
const a=document.createElement('a');
a.href=url;
a.download=name;
a.click();
setTimeout(()=>URL.revokeObjectURL(url),1000)}
// Export a script, not raw JSON: index.html expects window.AMIO_CONTENT.
$('export').onclick=()=>{if(!saveContact())return;
persist();
download('content.js','window.AMIO_CONTENT = '+JSON.stringify(data,null,2)+';\n','text/javascript');
status('Exported saved content. Replace content.js in GitHub to publish it. Save the current post first if you have unsaved edits.')};
$('backup').onclick=()=>{if(!saveContact())return;
download('amioshishu-backup.json',JSON.stringify(data,null,2),'application/json')};

// Import the JSON backup format, not the generated content.js script.
$('import').onchange=async()=>{try{const f=$('import').files[0];
if(!f)return;
const next=validate(JSON.parse(await f.text()));
if(!confirm('Replace your locally saved content with this backup?'))return;
data=next;
persist();
drawPhotos();
listPosts();
loadPost(null)}catch(e){status('Could not import: '+e.message)}};

drawPhotos();
listPosts();
loadPost(null);

