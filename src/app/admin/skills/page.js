'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Code2, Plus, Pencil, Search, Trash2, X, Save } from 'lucide-react';
import {
  normalizeSkillIconKey,
  resolveSkillIcon,
  resolveSkillIconFromSkill,
  skillIconLibrary,
} from '@/lib/skill-icons';

export default function AdminSkills() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', level: 100, icon: '' });
  const [iconQuery, setIconQuery] = useState('');

  const load = async () => { const { data } = await supabase.from('skills').select('*').order('category'); setItems(data || []); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing?.id) { await supabase.from('skills').update(form).eq('id', editing.id); }
    else { await supabase.from('skills').insert([form]); }
    setEditing(null); setIconQuery(''); setForm({ name: '', category: '', level: 100, icon: '' }); load();
  };

  const remove = async (id) => { if (confirm('Delete?')) { await supabase.from('skills').delete().eq('id', id); load(); } };

  const openEdit = (item) => {
    const resolvedIcon = resolveSkillIcon(item.icon) || resolveSkillIcon(item.name);
    setEditing(item);
    setIconQuery('');
    setForm({
      name: item.name,
      category: item.category,
      level: item.level ?? 100,
      icon: resolvedIcon?.value || item.icon || '',
    });
  };
  const openNew = () => { setEditing({}); setIconQuery(''); setForm({ name: '', category: '', level: 100, icon: '' }); };

  const filteredIcons = skillIconLibrary.filter((icon) => {
    const query = iconQuery.trim().toLowerCase();
    if (!query) return true;

    return [icon.label, icon.value, ...(icon.aliases || [])]
      .some((value) => value.toLowerCase().includes(query));
  });

  const selectedIconMeta = resolveSkillIcon(form.icon);

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
            <div className="fg">
              <label>Selected Logo</label>
              <div className="icon-selected">
                <div className="icon-preview" style={{ color: selectedIconMeta?.color || '#ffd700' }}>
                  {selectedIconMeta ? <selectedIconMeta.icon /> : <Code2 size={22} />}
                </div>
                <div>
                  <strong>{selectedIconMeta?.label || 'No logo selected'}</strong>
                  <span>{selectedIconMeta?.value || 'Choose one from library below'}</span>
                </div>
              </div>
            </div>
            <div className="fg">
              <label>Logo Library</label>
              <div className="icon-search">
                <Search size={16} />
                <input value={iconQuery} onChange={e=>setIconQuery(e.target.value)} placeholder="Search: firebase, mysql, laravel, nextjs..." />
              </div>
              <div className="icon-grid">
                {filteredIcons.map((icon) => {
                  const Icon = icon.icon;
                  const active = normalizeSkillIconKey(form.icon) === normalizeSkillIconKey(icon.value);

                  return (
                    <button
                      key={icon.value}
                      type="button"
                      className={`icon-option ${active ? 'icon-option-active' : ''}`}
                      onClick={() => setForm({
                        ...form,
                        icon: icon.value,
                        name: form.name || icon.label,
                        category: form.category || icon.category,
                      })}
                      title={icon.label}
                    >
                      <Icon size={26} color={icon.color} />
                      <span>{icon.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button onClick={save} className="btn btn-primary"><Save size={18}/>Save</button>
          </div>
        </div>
      )}
      <div className="table-wrap glass-card">
        <table>
          <thead><tr><th>Logo</th><th>Name</th><th>Category</th><th>Key</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  {(() => {
                    const iconMeta = resolveSkillIconFromSkill(item);
                    const Icon = iconMeta?.icon || Code2;

                    return (
                      <div className="table-icon" style={{ color: iconMeta?.color || '#ffd700' }} title={item.name}>
                        <Icon size={20} />
                      </div>
                    );
                  })()}
                </td>
                <td>{item.name}</td>
                <td><span className="badge badge-yellow">{item.category}</span></td>
                <td><code className="icon-key">{resolveSkillIconFromSkill(item)?.value || item.icon || '-'}</code></td>
                <td><button onClick={()=>openEdit(item)} className="act-btn"><Pencil size={16}/></button><button onClick={()=>remove(item.id)} className="act-btn act-del"><Trash2 size={16}/></button></td>
              </tr>
            ))}
            {items.length===0 && <tr><td colSpan={5} style={{textAlign:'center',color:'#666',padding:40}}>No skills yet</td></tr>}
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
        .icon-selected{display:flex;align-items:center;gap:14px;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:12px}
        .icon-selected strong{display:block;font-size:.92rem;color:#f5f5f5}
        .icon-selected span{display:block;font-size:.78rem;color:#777;margin-top:2px}
        .icon-preview{width:48px;height:48px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(255,255,255,.03);font-size:1.4rem;flex-shrink:0}
        .icon-search{display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;background:rgba(255,255,255,.03);margin-bottom:12px}
        .icon-search :global(svg){color:#666}
        .icon-search input{border:none;background:none;padding:12px 0}
        .icon-grid{max-height:320px;overflow-y:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .icon-option{padding:12px 10px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.02);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#bbb;transition:all .2s;text-align:center}
        .icon-option span{font-size:.72rem;line-height:1.3}
        .icon-option:hover{border-color:rgba(255,215,0,.3);background:rgba(255,215,0,.04);color:#fff}
        .icon-option-active{border-color:#ffd700;background:rgba(255,215,0,.08);color:#fff}
        .table-wrap{overflow-x:auto;padding:0}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;padding:14px 16px;font-size:.8rem;color:#888;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid rgba(255,255,255,.05)}
        td{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.03);font-size:.9rem}
        .table-icon{width:38px;height:38px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:10px;font-size:1.2rem}
        .icon-key{font-family:'JetBrains Mono',monospace;font-size:.78rem;color:#888}
        .act-btn{background:none;border:none;color:#888;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s}
        .act-btn:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .act-del:hover{color:#ff4444;background:rgba(255,60,60,.05)}
        @media(max-width:768px){
          .modal{max-width:640px}
          .icon-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        }
      `}</style>
    </div>
  );
}
