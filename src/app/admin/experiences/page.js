'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export default function AdminExperiences() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ company:'', role:'', start_date:'', end_date:'', description:'' });

  const load = async () => { const { data } = await supabase.from('experiences').select('*').order('start_date',{ascending:false}); setItems(data||[]); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing?.id) { await supabase.from('experiences').update(form).eq('id', editing.id); }
    else { await supabase.from('experiences').insert([form]); }
    setEditing(null); load();
  };

  const remove = async (id) => { if(confirm('Delete?')) { await supabase.from('experiences').delete().eq('id',id); load(); } };
  const openEdit = (item) => { setEditing(item); setForm({company:item.company,role:item.role,start_date:item.start_date||'',end_date:item.end_date||'',description:item.description||''}); };
  const openNew = () => { setEditing({}); setForm({ company:'', role:'', start_date:'', end_date:'', description:'' }); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h1 style={{fontSize:'1.5rem'}}>Experiences</h1>
        <button onClick={openNew} className="btn btn-primary"><Plus size={18}/>Add Experience</button>
      </div>
      {editing && (
        <div className="mo" onClick={()=>setEditing(null)}>
          <div className="md glass-card" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}><h3>{editing.id?'Edit':'Add'} Experience</h3><button onClick={()=>setEditing(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer'}}><X size={20}/></button></div>
            {['company','role','start_date','end_date'].map(f=>(
              <div key={f} className="fg"><label>{f.replace(/_/g,' ')}</label><input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f.includes('date')?'e.g. 2023':''} /></div>
            ))}
            <div className="fg"><label>Description</label><textarea rows={4} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <button onClick={save} className="btn btn-primary"><Save size={18}/>Save</button>
          </div>
        </div>
      )}
      <div className="list">
        {items.map(item => (
          <div key={item.id} className="exp-card glass-card">
            <div className="exp-header">
              <div><h3 style={{fontSize:'1.05rem'}}>{item.role}</h3><p style={{color:'#ffd700',fontSize:'.9rem'}}>{item.company}</p></div>
              <span style={{color:'#888',fontSize:'.8rem',fontFamily:"'JetBrains Mono',monospace"}}>{item.start_date} — {item.end_date||'Present'}</span>
            </div>
            {item.description && <p style={{color:'#888',fontSize:'.85rem',marginTop:8}}>{item.description}</p>}
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button onClick={()=>openEdit(item)} className="ab"><Pencil size={16}/></button>
              <button onClick={()=>remove(item.id)} className="ab ad"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
        {items.length===0 && <p style={{color:'#666',textAlign:'center',padding:40}}>No experiences yet</p>}
      </div>
      <style jsx>{`
        .mo{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px}
        .md{padding:32px;max-width:480px;width:100%;max-height:90vh;overflow-y:auto}
        .fg{margin-bottom:16px}
        .fg label{display:block;font-size:.85rem;color:#888;margin-bottom:6px;font-weight:500;text-transform:capitalize}
        .fg input,.fg textarea{width:100%;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#f5f5f5;font-size:.9rem;outline:none;font-family:'Inter',sans-serif}
        .fg textarea{resize:vertical;min-height:80px}
        .fg input:focus,.fg textarea:focus{border-color:rgba(255,215,0,.4)}
        .list{display:flex;flex-direction:column;gap:12px}
        .exp-card{padding:24px}
        .exp-header{display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:8px}
        .ab{background:none;border:none;color:#888;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s}
        .ab:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .ad:hover{color:#ff4444;background:rgba(255,60,60,.05)}
      `}</style>
    </div>
  );
}
