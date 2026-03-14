'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Save, ExternalLink } from 'lucide-react';

export default function AdminSocial() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ platform:'', url:'', icon:'' });

  const load = async () => { const { data } = await supabase.from('social_links').select('*'); setItems(data||[]); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing?.id) { await supabase.from('social_links').update(form).eq('id', editing.id); }
    else { await supabase.from('social_links').insert([form]); }
    setEditing(null); load();
  };

  const remove = async (id) => { if(confirm('Delete?')) { await supabase.from('social_links').delete().eq('id',id); load(); } };
  const openEdit = (item) => { setEditing(item); setForm({platform:item.platform,url:item.url,icon:item.icon||''}); };
  const openNew = () => { setEditing({}); setForm({ platform:'', url:'', icon:'' }); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h1 style={{fontSize:'1.5rem'}}>Social Links</h1>
        <button onClick={openNew} className="btn btn-primary"><Plus size={18}/>Add Link</button>
      </div>
      {editing && (
        <div className="mo" onClick={()=>setEditing(null)}>
          <div className="md glass-card" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}><h3>{editing.id?'Edit':'Add'} Social Link</h3><button onClick={()=>setEditing(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer'}}><X size={20}/></button></div>
            <div className="fg"><label>Platform</label><input value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})} placeholder="e.g. GitHub, LinkedIn" /></div>
            <div className="fg"><label>URL</label><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://..." /></div>
            <div className="fg"><label>Icon</label><input value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} placeholder="github, linkedin, twitter" /><small style={{color:'#555',fontSize:'.75rem'}}>Use lowercase: github, linkedin, twitter, instagram, etc.</small></div>
            <button onClick={save} className="btn btn-primary"><Save size={18}/>Save</button>
          </div>
        </div>
      )}
      <div className="list glass-card">
        {items.map(item => (
          <div key={item.id} className="link-item">
            <div style={{display:'flex',alignItems:'center',gap:12,flex:1}}>
              <div className="link-icon">{item.icon?.substring(0,2).toUpperCase()}</div>
              <div><p style={{fontWeight:600}}>{item.platform}</p><a href={item.url} target="_blank" rel="noopener noreferrer" style={{fontSize:'.8rem',color:'#888',display:'flex',alignItems:'center',gap:4}}>{item.url?.substring(0,40)}<ExternalLink size={12}/></a></div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>openEdit(item)} className="ab"><Pencil size={16}/></button>
              <button onClick={()=>remove(item.id)} className="ab ad"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
        {items.length===0 && <p style={{color:'#666',textAlign:'center',padding:40}}>No social links yet</p>}
      </div>
      <style jsx>{`
        .mo{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px}
        .md{padding:32px;max-width:480px;width:100%}
        .fg{margin-bottom:16px}
        .fg label{display:block;font-size:.85rem;color:#888;margin-bottom:6px;font-weight:500}
        .fg input{width:100%;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#f5f5f5;font-size:.9rem;outline:none;font-family:'Inter',sans-serif}
        .fg input:focus{border-color:rgba(255,215,0,.4)}
        .list{padding:0}
        .link-item{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.03)}
        .link-item:last-child{border-bottom:none}
        .link-icon{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(255,215,0,.08);border-radius:8px;color:#ffd700;font-size:.8rem;font-weight:700}
        .ab{background:none;border:none;color:#888;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s}
        .ab:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .ad:hover{color:#ff4444;background:rgba(255,60,60,.05)}
      `}</style>
    </div>
  );
}
