'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/admin');
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <div className="login-header">
          <span className="login-logo"><span style={{color:'#ffd700'}}>&lt;</span>AZ<span style={{color:'#ffd700'}}>/&gt;</span></span>
          <h1>Admin Login</h1>
          <p>Sign in to manage your portfolio</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group"><label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="admin@example.com" required /></div>
          <div className="form-group"><label>Password</label>
            <div className="pw-wrap">
              <input type={showPw?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
              <button type="button" className="pw-toggle" onClick={()=>setShowPw(!showPw)}>{showPw?<EyeOff size={18}/>:<Eye size={18}/>}</button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>{loading?'Signing in...':'Sign In'}<LogIn size={18}/></button>
        </form>
        <a href="/" className="back-link">← Back to Portfolio</a>
      </div>
      <style jsx>{`
        .login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#0a0a0a}
        .login-card{padding:48px;max-width:420px;width:100%}
        .login-header{text-align:center;margin-bottom:32px}
        .login-logo{font-family:'Space Grotesk',sans-serif;font-size:2rem;font-weight:700;display:block;margin-bottom:16px}
        .login-header h1{font-size:1.5rem;margin-bottom:8px}
        .login-header p{color:#888;font-size:.9rem}
        .form-group{margin-bottom:20px}
        .form-group label{display:block;font-size:.85rem;color:#888;margin-bottom:8px;font-weight:500}
        .form-group input{width:100%;padding:14px 16px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#f5f5f5;font-size:.95rem;outline:none;transition:all .3s;font-family:'Inter',sans-serif}
        .form-group input:focus{border-color:rgba(255,215,0,.4);box-shadow:0 0 0 3px rgba(255,215,0,.05)}
        .pw-wrap{position:relative}
        .pw-wrap input{padding-right:44px}
        .pw-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:#888;cursor:pointer;padding:4px}
        .login-error{background:rgba(255,60,60,.1);color:#ff4444;padding:12px;border-radius:8px;font-size:.85rem;margin-bottom:16px;border:1px solid rgba(255,60,60,.2)}
        .login-btn{width:100%;justify-content:center}
        .back-link{display:block;text-align:center;margin-top:24px;color:#888;font-size:.85rem;text-decoration:none}
        .back-link:hover{color:#ffd700}
      `}</style>
    </div>
  );
}
