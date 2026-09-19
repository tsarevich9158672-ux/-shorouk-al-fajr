const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aso123';
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'site-data.json');
fs.mkdirSync(DATA_DIR, { recursive: true });

const defaults = { products: [], texts: {}, settings: {}, reps: [], logo: '' };
function load(){
  try { return { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE,'utf8')) }; }
  catch { return { ...defaults }; }
}
let db = load();
function save(){ fs.writeFileSync(DATA_FILE, JSON.stringify(db,null,2)); }
const sessions = new Set();
function auth(req,res,next){
  const token = (req.headers.authorization||'').replace(/^Bearer\s+/,'');
  if(!token || !sessions.has(token)) return res.status(401).json({error:'Unauthorized'});
  next();
}
app.use(express.json({limit:'15mb'}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/api/site', (req,res)=>res.json(db));
app.post('/api/login',(req,res)=>{
  if(req.body?.password !== ADMIN_PASSWORD) return res.status(401).json({error:'Wrong password'});
  const token=crypto.randomBytes(32).toString('hex'); sessions.add(token);
  res.json({token});
});
app.post('/api/admin/products',auth,(req,res)=>{
  const p=req.body; if(!p?.id) return res.status(400).json({error:'Invalid product'});
  const i=db.products.findIndex(x=>x.id===p.id); if(i>=0) db.products[i]=p; else db.products.push(p); save(); res.json(p);
});
app.delete('/api/admin/products/:id',auth,(req,res)=>{ db.products=db.products.filter(p=>p.id!==req.params.id); save(); res.json({ok:true}); });
app.post('/api/admin/reps',auth,(req,res)=>{
  const r=req.body; if(!r?.id) return res.status(400).json({error:'Invalid rep'});
  const i=db.reps.findIndex(x=>x.id===r.id); if(i>=0) db.reps[i]=r; else db.reps.push(r); save(); res.json(r);
});
app.delete('/api/admin/reps/:id',auth,(req,res)=>{ db.reps=db.reps.filter(r=>r.id!==req.params.id); save(); res.json({ok:true}); });
app.put('/api/admin/texts',auth,(req,res)=>{ db.texts=req.body||{}; save(); res.json(db.texts); });
app.put('/api/admin/settings',auth,(req,res)=>{ db.settings={...(db.settings||{}),...(req.body||{})}; save(); res.json(db.settings); });
app.put('/api/admin/logo',auth,(req,res)=>{ db.logo=req.body?.logo||''; save(); res.json({logo:db.logo}); });
app.post('/api/admin/import',auth,(req,res)=>{
  const x=req.body||{};
  if(Array.isArray(x.products)) db.products=x.products;
  if(x.texts) db.texts=x.texts;
  if(x.settings) db.settings={...(db.settings||{}),...x.settings};
  if(Array.isArray(x.reps)) db.reps=x.reps;
  if(typeof x.logo==='string') db.logo=x.logo;
  save(); res.json(db);
});
app.use((req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`Shorouk Al Fajr running on port ${PORT}`));
