'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminProfile() {
  const [profile, setProfile] = useState({ name: '', title: '', bio: '', avatar_url: '', resume_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('profile').select('*').limit(1).single().then(({ data }) => {
      if (data) setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    const { error } = profile.id
      ? await supabase.from('profile').update({ name: profile.name, title: profile.title, bio: profile.bio, avatar_url: profile.avatar_url, resume_url: profile.resume_url }).eq('id', profile.id)
      : await supabase.from('profile').insert([profile]);
    setMsg(error ? 'Error saving' : 'Saved!');
    setSaving(false);
  };

  if (loading) return <div style={{color:'#888',padding:40}}>Loading...</div>;

  return (
    <div>
      <h1 style={{fontSize:'1.5rem',marginBottom:24}}>Edit Profile</h1>
      <div className="glass-card" style={{padding:32,maxWidth:600}}>
        <ImageUpload label="Avatar" value={profile.avatar_url} onChange={(url) => setProfile({...profile, avatar_url: url})} bucket="images" folder="avatars" />
        {['name','title','resume_url'].map(f => (
          <div key={f} className="fg">
            <label>{f.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}</label>
            <input value={profile[f]||''} onChange={e=>setProfile({...profile,[f]:e.target.value})} />
          </div>
        ))}
        <div className="fg"><label>Bio</label><textarea rows={5} value={profile.bio||''} onChange={e=>setProfile({...profile,bio:e.target.value})} /></div>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving}>{saving?<Loader size={18}/>:<Save size={18}/>}{saving?'Saving...':'Save Profile'}</button>
        {msg && <p style={{marginTop:12,color:msg.includes('Error')?'#ff4444':'#00c864',fontSize:'.9rem'}}>{msg}</p>}
      </div>
      <style jsx>{`
        .fg{margin-bottom:20px}
        .fg label{display:block;font-size:.85rem;color:#888;margin-bottom:8px;font-weight:500;text-transform:capitalize}
        .fg input,.fg textarea{width:100%;padding:12px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#f5f5f5;font-size:.9rem;outline:none;font-family:'Inter',sans-serif}
        .fg input:focus,.fg textarea:focus{border-color:rgba(255,215,0,.4)}
        .fg textarea{resize:vertical;min-height:100px}
      `}</style>
    </div>
  );
}
