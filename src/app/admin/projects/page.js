'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title:'', description:'', image_url:'', live_url:'', repo_url:'', tech_stack:'', featured:false, order:0 });

  const load = async () => { const { data } = await supabase.from('projects').select('*').order('order'); setItems(data||[]); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const payload = { ...form, tech_stack: typeof form.tech_stack === 'string' ? form.tech_stack.split(',').map(s=>s.trim()).filter(Boolean) : form.tech_stack };
    if (editing?.id) { await supabase.from('projects').update(payload).eq('id', editing.id); }
    else { await supabase.from('projects').insert([payload]); }
    setEditing(null); load();
  };

  const remove = async (id) => { if(confirm('Delete?')) { await supabase.from('projects').delete().eq('id',id); load(); } };
  const openEdit = (item) => { setEditing(item); setForm({...item, tech_stack: (item.tech_stack||[]).join(', ')}); };
  const openNew = () => { setEditing({}); setForm({ title:'', description:'', image_url:'', live_url:'', repo_url:'', tech_stack:'', featured:false, order:0 }); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h1 style={{fontSize:'1.5rem'}}>Projects</h1>
        <button onClick={openNew} className="btn btn-primary"><Plus size={18}/>Add Project</button>
      </div>
      {editing && (
        <div className="modal-overlay" onClick={()=>setEditing(null)}>
          <div className="modal glass-card" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>{editing.id?'Edit':'Add'} Project</h3><button onClick={()=>setEditing(null)} className="modal-close"><X size={20}/></button></div>
            <div className="fg"><label>Title</label><input value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} /></div>
            <ImageUpload label="Project Image" value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} bucket="images" folder="projects" />
            {['live_url','repo_url'].map(f=>(
              <div key={f} className="fg"><label>{f.replace(/_/g,' ')}</label><input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} /></div>
            ))}
            <div className="fg"><label>Description</label><textarea rows={3} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="fg"><label>Tech Stack (comma separated)</label><input value={form.tech_stack||''} onChange={e=>setForm({...form,tech_stack:e.target.value})} placeholder="React, Node.js, Supabase" /></div>
            <div className="fg"><label>Order</label><input type="number" value={form.order||0} onChange={e=>setForm({...form,order:parseInt(e.target.value)||0})} /></div>
            <div className="fg" style={{display:'flex',alignItems:'center',gap:8}}><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})} /><label style={{marginBottom:0}}>Featured Project</label></div>
            <button onClick={save} className="btn btn-primary"><Save size={18}/>Save</button>
          </div>
        </div>
      )}
      <div className="items-grid">
        {items.map(item => (
          <div key={item.id} className="item-card glass-card">
            {item.image_url && <img src={item.image_url} alt={item.title} style={{width:'100%',height:160,objectFit:'cover',borderRadius:'12px 12px 0 0',marginBottom:12}} />}
            <div style={{padding: item.image_url ? '0 16px 16px' : 16}}>
              <div className="item-header">
                <h3 style={{fontSize:'1.1rem'}}>{item.title}</h3>
                {item.featured && <Star size={16} color="#ffd700" fill="#ffd700"/>}
              </div>
              <p style={{color:'#888',fontSize:'.85rem',marginBottom:12,flex:1}}>{item.description?.substring(0,100)}</p>
              <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:12}}>{(item.tech_stack||[]).map((t,i)=><span key={i} className="badge badge-yellow">{t}</span>)}</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>openEdit(item)} className="act-btn"><Pencil size={16}/></button>
                <button onClick={()=>remove(item.id)} className="act-btn act-del"><Trash2 size={16}/></button>
              </div>
            </div>
          </div>
        ))}
        {items.length===0 && <p style={{color:'#666',gridColumn:'1/-1',textAlign:'center',padding:40}}>No projects yet</p>}
      </div>
      <style jsx>{`
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px}
        .modal{padding:32px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .modal-close{background:none;border:none;color:#888;cursor:pointer}
        .fg{margin-bottom:16px}
        .fg label{display:block;font-size:.85rem;color:#888;margin-bottom:6px;font-weight:500;text-transform:capitalize}
        .fg input[type=text],.fg input[type=number],.fg input:not([type=checkbox]),.fg textarea{width:100%;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#f5f5f5;font-size:.9rem;outline:none;font-family:'Inter',sans-serif}
        .fg textarea{resize:vertical;min-height:80px}
        .fg input:focus,.fg textarea:focus{border-color:rgba(255,215,0,.4)}
        .items-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
        .item-card{padding:0;display:flex;flex-direction:column;overflow:hidden}
        .item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
        .act-btn{background:none;border:none;color:#888;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s}
        .act-btn:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .act-del:hover{color:#ff4444;background:rgba(255,60,60,.05)}
      `}</style>
    </div>
  );
}
