/* LOCAL CONTENT EDITOR
 * Edits are held in data, then saved to localStorage or exported.
 * This file never writes to GitHub. Repository permissions control publishing.
 * Form IDs must match editor.html. See CUSTOMIZE.md for the full workflow.
 */
'use strict';

// Keep this key stable to retain saved work across visits in the same browser.
const key='amioshishu-content-v1';
let data=structuredClone(window.AMIO_CONTENT),editing=null,cover='',postPhotos=[];
const $=id=>document.getElementById(id);
const status=t=>$('status').textContent=t;

// Validate imported JSON before replacing current content.
const validate = AmioModel.validate;
data = validate(data);
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
function drawPhotos() {
  drawPhotoList($('photo-fields'), data.gallery);
}
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
postPhotos=structuredClone(p?.photos||[]);
drawPhotoList($('post-photo-fields'),postPhotos);
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
const p={photos:structuredClone(postPhotos),id:editing||'post-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),image:cover,alt:$('cover-alt').value,published:$('published').value==='true'};
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
$('contact').value=data.email;
drawPhotos();
drawSections();
listPosts();
loadPost(null)}catch(e){status('Could not import: '+e.message)}};

$('contact').value=data.email;
drawPhotos();
drawSections();
listPosts();
loadPost(null);


// Shared image-list editor: no fixed item count. The supplied array is edited in place.
function field(parent, label, value, change, multiline=false) {
  const wrap=document.createElement('label');
  wrap.textContent=label;
  const input=document.createElement(multiline?'textarea':'input');
  input.value=value||'';
  input.oninput=()=>{change(input.value); persist();};
  wrap.append(input); parent.append(wrap);
  return input;
}
function action(parent, label, run) {
  const b=document.createElement('button'); b.type='button'; b.textContent=label;
  b.onclick=run; parent.append(b); return b;
}
function move(list,index,offset,redraw) {
  const target=index+offset;
  if(target<0||target>=list.length)return;
  [list[index],list[target]]=[list[target],list[index]];
  persist();redraw();
}
function drawPhotoList(root,list) {
  root.replaceChildren();
  list.forEach((photo,index)=>{
    const box=document.createElement('details');box.className='item-editor';
    const label=document.createElement('summary'); label.textContent='Photo '+(index+1)+(photo.caption?' · '+photo.caption:'');box.append(label);
    field(box,'Caption',photo.caption,v=>photo.caption=v);
    field(box,'Image description',photo.alt,v=>photo.alt=v);
    field(box,'Placeholder title',photo.placeholder,v=>photo.placeholder=v);
    field(box,'Image URL or assets/ path (optional)',photo.image,v=>photo.image=v);
    const uploadLabel=document.createElement('label'); uploadLabel.textContent='Upload image';
    const upload=document.createElement('input'); upload.type='file';upload.accept='image/png,image/jpeg,image/webp';
    upload.onchange=async()=>{try{if(!upload.files[0])return;photo.image=await imageData(upload.files[0]);persist();drawPhotoList(root,list);}catch(e){status(e.message)}};
    uploadLabel.append(upload);box.append(uploadLabel);
    if(AmioModel.safeImage(photo.image)){const img=document.createElement('img');img.src=photo.image;img.alt=photo.alt||'Photo preview';img.className='editor-preview';box.append(img);}
    const buttons=document.createElement('div');buttons.className='actions';
    action(buttons,'Move up',()=>move(list,index,-1,()=>drawPhotoList(root,list))).disabled=index===0;
    action(buttons,'Move down',()=>move(list,index,1,()=>drawPhotoList(root,list))).disabled=index===list.length-1;
    action(buttons,'Delete photo slot',()=>{if(confirm('Remove this photo slot?')){list.splice(index,1);persist();drawPhotoList(root,list);}});
    box.append(buttons);root.append(box);
  });
}
$('add-photo').onclick=()=>{data.gallery.push(AmioModel.photo());persist();drawPhotos();};
$('bulk-photos').onchange=async()=>{
  const input=$('bulk-photos');input.disabled=true;let added=0;
  try{for(const file of input.files){const photo=AmioModel.photo();photo.image=await imageData(file);data.gallery.push(photo);added++;persist();}status('Added '+added+' photos. Export to publish.');}
  catch(e){status('Added '+added+' photos before stopping: '+e.message);}
  finally{input.disabled=false;input.value='';drawPhotos();}
};
$('add-post-photo').onclick=()=>{postPhotos.push(AmioModel.photo());drawPhotoList($('post-photo-fields'),postPhotos);};

// Sections contain any number of entries. Their stable IDs become sidebar anchors.
function addSection(title='New section') {
  data.sections.push({id:AmioModel.id(),title,description:'',published:true,entries:[]});
  persist();drawSections();
}
$('add-section').onclick=()=>addSection();
document.querySelectorAll('[data-preset]').forEach(b=>b.onclick=()=>addSection(b.dataset.preset));
function drawSections() {
  const root=$('section-fields');root.replaceChildren();
  data.sections.forEach((section,index)=>{
    const box=document.createElement('details');box.className='item-editor';
    const heading=document.createElement('summary');heading.textContent=section.title;box.append(heading);
    field(box,'Sidebar label / section title',section.title,v=>{section.title=v;heading.textContent=v;});
    field(box,'Introduction',section.description,v=>section.description=v,true);
    const visible=document.createElement('label');const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.checked=section.published;checkbox.style.width='auto';
    checkbox.onchange=()=>{section.published=checkbox.checked;persist();};visible.append(checkbox,document.createTextNode(' Show section and sidebar link'));box.append(visible);
    const controls=document.createElement('div');controls.className='actions';
    action(controls,'Move up',()=>move(data.sections,index,-1,drawSections)).disabled=index===0;
    action(controls,'Move down',()=>move(data.sections,index,1,drawSections)).disabled=index===data.sections.length-1;
    action(controls,'Delete section',()=>{if(confirm('Delete this section and all its entries?')){data.sections.splice(index,1);persist();drawSections();}});
    box.append(controls);
    section.entries.forEach((entry,n)=>{
      const item=document.createElement('details');item.className='item-editor';const summary=document.createElement('summary');summary.textContent=entry.title||'Untitled entry';item.append(summary);
      field(item,'Title',entry.title,v=>{entry.title=v;summary.textContent=v;});
      const date=field(item,'Date (optional)',entry.date,v=>entry.date=v);date.type='date';
      field(item,'Description / citation / notes',entry.body,v=>entry.body=v,true);
      field(item,'External link (https://...)',entry.url,v=>entry.url=v);
      field(item,'Link label',entry.linkLabel,v=>entry.linkLabel=v);
      const photos=document.createElement('div');item.append(photos);drawPhotoList(photos,entry.photos);
      action(item,'+ Add entry photo',()=>{entry.photos.push(AmioModel.photo());persist();drawPhotoList(photos,entry.photos);});
      const buttons=document.createElement('div');buttons.className='actions';
      action(buttons,'Move up',()=>move(section.entries,n,-1,drawSections)).disabled=n===0;
      action(buttons,'Move down',()=>move(section.entries,n,1,drawSections)).disabled=n===section.entries.length-1;
      action(buttons,'Delete entry',()=>{if(confirm('Delete this entry?')){section.entries.splice(n,1);persist();drawSections();}});item.append(buttons);box.append(item);
    });
    action(box,'+ Add entry',()=>{section.entries.push({title:'New entry',date:'',body:'',url:'',linkLabel:'Read more',photos:[]});persist();drawSections();});
    root.append(box);
  });
}
