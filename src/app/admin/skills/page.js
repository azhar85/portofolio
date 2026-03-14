'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

export default function AdminSkills() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', level: 75, icon: '' });

  const load = async () => { const { data } = await supabase.from('skills').select('*').order('category'); setItems(data || []); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing?.id) { await supabase.from('skills').update(form).eq('id', editing.id); }
    else { await supabase.from('skills').insert([form]); }
    setEditing(null); setForm({ name: '', category: '', level: 75, icon: '' }); load();
  };

  const remove = async (id) => { if (confirm('Delete?')) { await supabase.from('skills').delete().eq('id', id); load(); } };

  const openEdit = (item) => { setEditing(item); setForm({ name: item.name, category: item.category, level: item.level, icon: item.icon || '' }); };
  const openNew = () => { setEditing({}); setForm({ name: '', category: '', level: 75, icon: '' }); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h1 style={{fontSize:'1.5rem'}}>Skills</h1>
        <button onClick={openNew} className="btn btn-primary"><Plus size={18}/>Add Skill</button>
      </div>
      {editing && (
        <div className="modal-overlay" onClick={()=>setEditing(null)}>
          <div className="modal glass-card" onClick={e=>e.stopPropagation()}>
            <div className="modal-header"><h3>{editing.id?'Edit':'Add'} Skill</h3><button onClick={()=>setEditing(null)} className="modal-close"><X size={20}/></button></div>
            <div className="fg"><label>Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <div className="fg"><label>Category</label><input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="e.g. Frontend, Backend" /></div>
            <div className="fg"><label>Level ({form.level}%)</label><input type="range" min="0" max="100" value={form.level} onChange={e=>setForm({...form,level:parseInt(e.target.value)})} /></div>
            <button onClick={save} className="btn btn-primary"><Save size={18}/>Save</button>
          </div>
        </div>
      )}
      <div className="table-wrap glass-card">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Level</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td><td><span className="badge badge-yellow">{item.category}</span></td>
                <td><div className="mini-bar"><div style={{width:`${item.level}%`}}/></div> {item.level}%</td>
                <td><button onClick={()=>openEdit(item)} className="act-btn"><Pencil size={16}/></button><button onClick={()=>remove(item.id)} className="act-btn act-del"><Trash2 size={16}/></button></td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={4} style={{textAlign:'center',color:'#666',padding:40}}>No skills yet</td></tr>}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px}
        .modal{padding:32px;max-width:480px;width:100%}
        .modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}
        .modal-close{background:none;border:none;color:#888;cursor:pointer}
        .fg{margin-bottom:16px}
        .fg label{display:block;font-size:.85rem;color:#888;margin-bottom:6px;font-weight:500}
        .fg input{width:100%;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#f5f5f5;font-size:.9rem;outline:none;font-family:'Inter',sans-serif}
        .fg input:focus{border-color:rgba(255,215,0,.4)}
        .fg input[type=range]{padding:0;background:none;border:none}
        .table-wrap{overflow-x:auto;padding:0}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;padding:14px 16px;font-size:.8rem;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,.05)}
        td{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.03);font-size:.9rem}
        .mini-bar{width:60px;height:4px;background:rgba(255,255,255,.05);border-radius:2px;display:inline-block;margin-right:8px;vertical-align:middle}
        .mini-bar div{height:100%;background:#ffd700;border-radius:2px}
        .act-btn{background:none;border:none;color:#888;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s}
        .act-btn:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .act-del:hover{color:#ff4444;background:rgba(255,60,60,.05)}
      `}</style>
    </div>
  );
}
