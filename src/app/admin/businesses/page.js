'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, Save, Building2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminBusinesses() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', logo_url:'', website_url:'', category:'', founded_year:'', status:'Active', order:0 });

  const load = async () => { const { data } = await supabase.from('businesses').select('*').order('order'); setItems(data||[]); };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editing?.id) { await supabase.from('businesses').update(form).eq('id', editing.id); }
    else { await supabase.from('businesses').insert([form]); }
    setEditing(null); load();
  };

  const remove = async (id) => { if(confirm('Delete?')) { await supabase.from('businesses').delete().eq('id',id); load(); } };
  const openEdit = (item) => { setEditing(item); setForm({name:item.name,description:item.description,logo_url:item.logo_url||'',website_url:item.website_url||'',category:item.category||'',founded_year:item.founded_year||'',status:item.status||'Active',order:item.order||0}); };
  const openNew = () => { setEditing({}); setForm({ name:'', description:'', logo_url:'', website_url:'', category:'', founded_year:'', status:'Active', order:0 }); };

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h1 style={{fontSize:'1.5rem'}}>Businesses</h1>
        <button onClick={openNew} className="btn btn-primary"><Plus size={18}/>Add Business</button>
      </div>
      {editing && (
        <div className="mo" onClick={()=>setEditing(null)}>
          <div className="md glass-card" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}><h3>{editing.id?'Edit':'Add'} Business</h3><button onClick={()=>setEditing(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer'}}><X size={20}/></button></div>
            <div className="fg"><label>Name</label><input value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})} /></div>
            <ImageUpload label="Logo" value={form.logo_url} onChange={(url) => setForm({...form, logo_url: url})} bucket="images" folder="businesses" />
            {['website_url','category','founded_year'].map(f=>(
              <div key={f} className="fg"><label>{f.replace(/_/g,' ')}</label><input value={form[f]||''} onChange={e=>setForm({...form,[f]:e.target.value})} /></div>
            ))}
            <div className="fg"><label>Description</label><textarea rows={3} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})} /></div>
            <div className="fg"><label>Status</label>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option value="Active">Active</option><option value="Growing">Growing</option><option value="Planning">Planning</option><option value="Closed">Closed</option>
              </select>
            </div>
            <div className="fg"><label>Order</label><input type="number" value={form.order||0} onChange={e=>setForm({...form,order:parseInt(e.target.value)||0})} /></div>
            <button onClick={save} className="btn btn-primary"><Save size={18}/>Save</button>
          </div>
        </div>
      )}
      <div className="grid">
        {items.map(item => (
          <div key={item.id} className="card glass-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                {item.logo_url ? <img src={item.logo_url} alt={item.name} style={{width:40,height:40,borderRadius:10,objectFit:'cover'}} /> : <div className="biz-icon"><Building2 size={20}/></div>}
                <div><h3 style={{fontSize:'1.1rem'}}>{item.name}</h3><span style={{fontSize:'.75rem',color:'#888'}}>{item.category}</span></div>
              </div>
              <span className={`badge ${item.status==='Active'?'badge-green':item.status==='Growing'?'badge-yellow':'badge-gray'}`}>{item.status}</span>
            </div>
            <p style={{color:'#888',fontSize:'.85rem',marginBottom:12}}>{item.description?.substring(0,80)}</p>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontSize:'.75rem',color:'#555'}}>Est. {item.founded_year}</span>
              <div style={{display:'flex',gap:8}}><button onClick={()=>openEdit(item)} className="ab"><Pencil size={16}/></button><button onClick={()=>remove(item.id)} className="ab ad"><Trash2 size={16}/></button></div>
            </div>
          </div>
        ))}
        {items.length===0 && <p style={{color:'#666',gridColumn:'1/-1',textAlign:'center',padding:40}}>No businesses yet</p>}
      </div>
      <style jsx>{`
        .mo{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px}
        .md{padding:32px;max-width:520px;width:100%;max-height:90vh;overflow-y:auto}
        .fg{margin-bottom:16px}
        .fg label{display:block;font-size:.85rem;color:#888;margin-bottom:6px;font-weight:500;text-transform:capitalize}
        .fg input,.fg textarea,.fg select{width:100%;padding:10px 14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#f5f5f5;font-size:.9rem;outline:none;font-family:'Inter',sans-serif}
        .fg textarea{resize:vertical;min-height:80px}
        .fg input:focus,.fg textarea:focus,.fg select:focus{border-color:rgba(255,215,0,.4)}
        .fg select option{background:#111;color:#f5f5f5}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
        .card{padding:24px}
        .biz-icon{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(255,215,0,.08);border-radius:10px;color:#ffd700}
        .ab{background:none;border:none;color:#888;cursor:pointer;padding:6px;border-radius:6px;transition:all .2s}
        .ab:hover{color:#ffd700;background:rgba(255,215,0,.05)}
        .ad:hover{color:#ff4444;background:rgba(255,60,60,.05)}
      `}</style>
    </div>
  );
}
