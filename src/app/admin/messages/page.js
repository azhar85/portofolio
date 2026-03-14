'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Mail, MailOpen, Eye } from 'lucide-react';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => { const { data } = await supabase.from('messages').select('*').order('created_at',{ascending:false}); setItems(data||[]); };
  useEffect(() => { load(); }, []);

  const markRead = async (msg) => {
    await supabase.from('messages').update({is_read:true}).eq('id',msg.id);
    setSelected({...msg, is_read:true}); load();
  };

  const remove = async (id) => { if(confirm('Delete?')) { await supabase.from('messages').delete().eq('id',id); setSelected(null); load(); } };

  return (
    <div>
      <h1 style={{fontSize:'1.5rem',marginBottom:24}}>Messages</h1>
      <div className="msg-layout">
        <div className="msg-list glass-card">
          {items.map(msg => (
            <div key={msg.id} className={`msg-item ${!msg.is_read?'msg-unread':''} ${selected?.id===msg.id?'msg-active':''}`} onClick={()=>{setSelected(msg);if(!msg.is_read)markRead(msg);}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <span style={{fontWeight:msg.is_read?400:600,fontSize:'.95rem'}}>{msg.name}</span>
                {!msg.is_read ? <Mail size={14} color="#ffd700"/> : <MailOpen size={14} color="#555"/>}
              </div>
              <p style={{fontSize:'.8rem',color:'#888',marginBottom:2}}>{msg.email}</p>
              <p style={{fontSize:'.8rem',color:'#666'}}>{msg.message?.substring(0,60)}...</p>
              <span style={{fontSize:'.7rem',color:'#444',fontFamily:"'JetBrains Mono',monospace"}}>{new Date(msg.created_at).toLocaleString()}</span>
            </div>
          ))}
          {items.length===0 && <p style={{color:'#666',textAlign:'center',padding:40}}>No messages yet</p>}
        </div>

        <div className="msg-detail glass-card">
          {selected ? (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:24}}>
                <div><h3 style={{fontSize:'1.2rem',marginBottom:4}}>{selected.name}</h3><p style={{color:'#ffd700',fontSize:'.9rem'}}>{selected.email}</p><span style={{fontSize:'.75rem',color:'#555',fontFamily:"'JetBrains Mono',monospace"}}>{new Date(selected.created_at).toLocaleString()}</span></div>
                <button onClick={()=>remove(selected.id)} style={{background:'none',border:'none',color:'#ff4444',cursor:'pointer',padding:8}}><Trash2 size={18}/></button>
              </div>
              <div style={{padding:20,background:'rgba(255,255,255,.02)',borderRadius:8,border:'1px solid rgba(255,255,255,.05)',lineHeight:1.8,color:'#ccc',fontSize:'.95rem'}}>{selected.message}</div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:300,color:'#555'}}>
              <Eye size={40} strokeWidth={1}/><p style={{marginTop:12}}>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .msg-layout{display:grid;grid-template-columns:350px 1fr;gap:16px}
        .msg-list{padding:0;max-height:600px;overflow-y:auto}
        .msg-item{padding:16px;cursor:pointer;border-bottom:1px solid rgba(255,255,255,.03);transition:all .2s}
        .msg-item:hover{background:rgba(255,215,0,.03)}
        .msg-unread{border-left:3px solid #ffd700}
        .msg-active{background:rgba(255,215,0,.05)}
        .msg-detail{padding:32px}
        @media(max-width:768px){.msg-layout{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
