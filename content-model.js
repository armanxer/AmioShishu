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
  // One-time migration: install real starter sections without reviving deleted ones later.
  const defaultSections=()=>[
    {id:'publications',title:'Publications',description:'Research papers, collaborations, and questions I am exploring.',published:true,entries:[]},
    {id:'seminars',title:'Seminars',description:'Talks, workshops, and conversations that make learning a shared experience.',published:true,entries:[]},
    {id:'art',title:'Art',description:'A space for creative experiments, sketches, and things made with care.',published:true,entries:[]}
  ];
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
    if(!d.schemaVersion){
      for(const section of defaultSections()) {
        if(!d.sections.some(s=>s.id===section.id||s.title.toLowerCase()===section.title.toLowerCase()))d.sections.push(section);
      }
      d.schemaVersion=2;
    }
    if(!Array.isArray(d.sections))throw Error('Invalid sections.');
    if((d.schemaVersion||0)<3){
      for(const s of [
        {id:'projects',title:'Projects',description:'Experiments, tools, and ideas developed through learning and research.',published:true,entries:[]},
        {id:'sourdough-recipes',title:'My Sourdough Recipes',description:'Recipes, kitchen notes, and experiments with flour, patience, and pistachios.',published:true,entries:[]}
      ])if(!d.sections.some(existing=>existing.id===s.id))d.sections.push(s);
      d.schemaVersion=3;
    }
    // Bring the newly published education page into older local editor backups once.
    // Preserve any existing edits to that collection; do not revive deletions after v4.
    if((d.schemaVersion||0)<4){
      const education=root.AMIO_CONTENT?.sections?.find(s=>s.id==='inclusive-education');
      if(education&&!d.sections.some(s=>s.id===education.id))d.sections.push(JSON.parse(JSON.stringify(education)));
      d.schemaVersion=4;
    }
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
