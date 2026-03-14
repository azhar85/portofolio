'use client';
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ImageUpload({ value, onChange, bucket = 'images', folder = '', label = 'Image' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      onChange(urlData.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const removeImage = () => onChange('');

  return (
    <div className="img-upload">
      <label className="img-label">{label}</label>

      {value ? (
        <div className="img-preview-wrap">
          <img src={value} alt="Preview" className="img-preview" />
          <button type="button" onClick={removeImage} className="img-remove"><X size={16} /></button>
        </div>
      ) : (
        <div
          className={`img-dropzone ${dragOver ? 'img-dropzone-active' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="img-uploading"><Loader size={24} className="img-spin" /><span>Uploading...</span></div>
          ) : (
            <>
              <ImageIcon size={32} strokeWidth={1.5} />
              <span className="img-drop-text">Click or drag image here</span>
              <span className="img-drop-hint">PNG, JPG, WebP (max 5MB)</span>
            </>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

      <style jsx>{`
        .img-upload{margin-bottom:20px}
        .img-label{display:block;font-size:.85rem;color:#888;margin-bottom:8px;font-weight:500}
        .img-dropzone{border:2px dashed rgba(255,215,0,.2);border-radius:12px;padding:32px;text-align:center;cursor:pointer;transition:all .3s;display:flex;flex-direction:column;align-items:center;gap:8px;color:#666;background:rgba(255,255,255,.01)}
        .img-dropzone:hover,.img-dropzone-active{border-color:rgba(255,215,0,.5);background:rgba(255,215,0,.03);color:#ffd700}
        .img-drop-text{font-size:.9rem;font-weight:500}
        .img-drop-hint{font-size:.75rem;color:#555}
        .img-preview-wrap{position:relative;display:inline-block;border-radius:12px;overflow:hidden;border:1px solid rgba(255,215,0,.15)}
        .img-preview{max-width:100%;max-height:200px;display:block;object-fit:cover}
        .img-remove{position:absolute;top:8px;right:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);border:1px solid rgba(255,60,60,.3);border-radius:50%;color:#ff4444;cursor:pointer;transition:all .2s}
        .img-remove:hover{background:rgba(255,60,60,.2);color:#fff}
        .img-uploading{display:flex;flex-direction:column;align-items:center;gap:8px;color:#ffd700}
        .img-uploading :global(.img-spin){animation:spin 1s linear infinite}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>
    </div>
  );
}
