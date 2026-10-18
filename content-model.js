/* Shared data rules. Arrays have no fixed item limit; device/storage limits still apply.
 * Old backups without sections or extra post photos are migrated automatically. */
(function (root) {
  'use strict';
  const photo=()=>({image:'',caption:'',alt:'',placeholder:'A moment to share'});
  const id=()=> 'section-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
  const safeImage=s=>typeof s==='string' && (/^data:image\/(png|jpeg|webp);base64,/.test(s)||(/^assets\/[\w./-]+$/.test(s)&&!s.includes('..'))||/^https:\/\//.test(s));
  const safeLink=s=>{try{return ['https:','http:'].includes(new URL(s).protocol);}catch{return false;}};
  function strings(o,keys){if(!o||keys.some(k=>typeof o[k]!=='string'))throw Error('Invalid text field in backup.');}
  function photos(list){if(!Array.isArray(list))throw Error('Invalid photos.');list.forEach(p=>strings(p,['image','caption','alt','placeholder']));}
  function validate(d){
    strings(d,['email']);photos(d.gallery);
    if(!Array.isArray(d.posts))throw Error('Invalid posts.');
    const ids=new Set();
    d.posts.forEach(p=>{
      strings(p,['id','title','date','category','excerpt','body','image','alt']);
      if(ids.has(p.id)||!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||typeof p.published!=='boolean')throw Error('Invalid post date, ID or visibility.');
      ids.add(p.id);p.photos??=[];photos(p.photos);
    });
    d.sections??=[];
    if(!Array.isArray(d.sections))throw Error('Invalid sections.');
    const sectionIds=new Set();
    d.sections.forEach(s=>{
      strings(s,['id','title','description']);
      if(!/^[a-zA-Z0-9_-]+$/.test(s.id)||sectionIds.has(s.id)||typeof s.published!=='boolean'||!Array.isArray(s.entries))throw Error('Invalid section.');
      sectionIds.add(s.id);
      s.entries.forEach(e=>{
        strings(e,['title','date','body','url','linkLabel']);
        if(e.date&&!/^\d{4}-\d{2}-\d{2}$/.test(e.date))throw Error('Invalid entry date.');
        photos(e.photos);
      });
    });
    return d;
  }
  root.AmioModel={photo,id,safeImage,safeLink,validate};
})(typeof window==='undefined'?globalThis:window);
