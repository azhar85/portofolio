'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, CheckCircle, Clock } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function AdminWork() {
  const [workList, setWorkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // New States for Payment Modal and Custom Confirmations
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { type: 'delete' | 'finish', id?: string, data?: any, message: string }


  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    image_url: '',
    tech_stack: '', // Store as comma-separated string in form, convert to array on submit
    price: 0,
    deadline: '',
    installments_paid: 0,
    payment_history: [],
    installments_total: 1,
    installment_features: false,
    status: 'On Going',
    client_name: '',
    live_url: '',
    repo_url: '',
    featured: false
  });

  useEffect(() => {
    fetchWork();
  }, []);

  async function fetchWork() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('work')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkList(data || []);
    } catch (error) {
      console.error('Error fetching work:', error.message);
      setConfirmDialog({ type: 'error', message: 'Error loading data: ' + error.message });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(work = null) {
    if (work) {
      setEditingId(work.id);
      setFormData({
        project_name: work.project_name || '',
        description: work.description || '',
        image_url: work.image_url || '',
        tech_stack: work.tech_stack ? work.tech_stack.join(', ') : '',
        price: work.price || 0,
        deadline: work.deadline || '',
        installments_paid: work.installments_paid || 0,
        payment_history: work.payment_history || [],
        installments_total: work.installments_total || 1,
        installment_features: work.installment_features || false,
        status: work.status || 'On Going',
        client_name: work.client_name || '',
        live_url: work.live_url || '',
        repo_url: work.repo_url || '',
        featured: work.featured || false
      });
    } else {
      setEditingId(null);
      setFormData({
        project_name: '',
        description: '',
        image_url: '',
        tech_stack: '',
        price: 0,
        deadline: '',
        installments_paid: 0,
        payment_history: [],
        installments_total: 1,
        installment_features: false,
        status: 'On Going',
        client_name: '',
        live_url: '',
        repo_url: '',
        featured: false
      });
    }
    setIsModalOpen(true);
  }

  function handleOpenPaymentModal(work) {
    setPaymentData({
      id: work.id,
      project_name: work.project_name,
      price: work.price || 0,
      deadline: work.deadline || '',
      installments_paid: work.installments_paid || 0,
      payment_history: work.payment_history || [],
      new_payment_amount: 0, // Temporary state for the new input
      installments_total: work.installments_total || 1,
      installment_features: work.installment_features || false,
      status: work.status || 'On Going'
    });
    setIsPaymentModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingId(null);
  }

  function handleClosePaymentModal() {
    setIsPaymentModalOpen(false);
    setPaymentData(null);
  }

  function triggerFinishMigration(workData, isFromPayment = false) {
    setConfirmDialog({
      type: 'finish',
      data: workData,
      isFromPayment,
      message: 'Marking this as Finished will move it to the main Projects tab and permanently remove it from the Work tracker. Proceed?'
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Process tech_stack string into an array
      const techStackArray = formData.tech_stack
        ? formData.tech_stack.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      const workData = {
        ...formData,
        tech_stack: techStackArray,
        deadline: formData.deadline ? formData.deadline : null
      };

      // Check if status is Finished to trigger confirmation instead of direct save
      if (workData.status === 'Finished') {
        // Close modal first, then show confirmation
        setIsModalOpen(false);
        triggerFinishMigration(workData, false);
        return;
      }

      // Normal Save (On Going)
      if (editingId) {
        const { error } = await supabase
          .from('work')
          .update({
            ...workData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('work')
          .insert([workData]);
        if (error) throw error;
      }

      handleCloseModal();
      fetchWork();
    } catch (error) {
      console.error('Error saving work:', error.message);
      setConfirmDialog({ type: 'error', message: 'Error saving data: ' + error.message });
    }
  }

  async function handlePaymentSubmit(e) {
    e.preventDefault();
    try {
      if (paymentData.status === 'Finished') {
        // If they change status to Finished in Payment Modal, fetch full work data for migration
        const { data: fullWork } = await supabase.from('work').select('*').eq('id', paymentData.id).single();
        if (fullWork) {
          setIsPaymentModalOpen(false);
          const updatedWorkData = { ...fullWork, ...paymentData };
          triggerFinishMigration(updatedWorkData, true);
        }
        return;
      }

      // Calculate total paid from history if we are adding a new payment
      let updatedHistory = [...(paymentData.payment_history || [])];
      let newTotalPaid = paymentData.installments_paid;

      if (paymentData.new_payment_amount > 0) {
        updatedHistory.push({
          amount: paymentData.new_payment_amount,
          date: new Date().toISOString()
        });
        newTotalPaid += paymentData.new_payment_amount;
      }

      const { error } = await supabase
        .from('work')
        .update({
          price: paymentData.price,
          deadline: paymentData.deadline ? paymentData.deadline : null,
          installments_paid: newTotalPaid,
          payment_history: updatedHistory,
          installments_total: paymentData.installments_total,
          installment_features: paymentData.installment_features,
          status: paymentData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.id);

      if (error) throw error;

      handleClosePaymentModal();
      fetchWork();
    } catch (error) {
      console.error('Error updating payment:', error.message);
      setConfirmDialog({ type: 'error', message: 'Error saving payment data: ' + error.message });
    }
  }

  async function executeFinishMigration(workData, isFromPayment) {
    try {
      // 1. Insert into Projects
      const { error: insertError } = await supabase.from('projects').insert([{
        title: workData.project_name,
        description: workData.description,
        image_url: workData.image_url,
        live_url: workData.live_url,
        repo_url: workData.repo_url,
        tech_stack: workData.tech_stack,
        featured: workData.featured,
        order: 0
      }]);

      if (insertError) throw insertError;

      // 2. Delete from Work
      const targetId = workData.id || editingId;
      if (targetId) {
        const { error: deleteError } = await supabase.from('work').delete().eq('id', targetId);
        if (deleteError) throw deleteError;
      }

      setConfirmDialog(null);
      if (isFromPayment) handleClosePaymentModal();
      else handleCloseModal();

      fetchWork();
    } catch (error) {
      console.error('Error migrating work:', error.message);
      setConfirmDialog({ type: 'error', message: 'Error finishing project: ' + error.message });
    }
  }

  function handleDeleteClick(id) {
    setConfirmDialog({
      type: 'delete',
      id,
      message: 'Are you sure you want to permanently delete this work tracing entry? This cannot be undone.'
    });
  }

  async function executeDelete(id) {
    try {
      const { error } = await supabase.from('work').delete().eq('id', id);
      if (error) throw error;
      setConfirmDialog(null);
      fetchWork();
    } catch (error) {
      console.error('Error deleting work:', error.message);
      setConfirmDialog({ type: 'error', message: 'Error deleting data: ' + error.message });
    }
  }



  // Format currency Helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  };

  // Format Date Helper
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const d = new Date(isoString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1 className="page-title">Work Tracker</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add New Work
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading work data...</div>
      ) : (
        <div className="work-grid">
          {workList.map((work) => (
            <div key={work.id} className="work-card glass-card">
              <div className="work-card-header">
                <div>
                  <h3 className="work-title">{work.project_name}</h3>
                  <p className="work-client">{work.client_name ? `Client: ${work.client_name}` : 'No Client Name'}</p>
                </div>
                <span className={`status-badge ${work.status === 'Finished' ? 'status-finished' : 'status-ongoing'}`}>
                  {work.status === 'Finished' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  {work.status}
                </span>
              </div>

              <div className="work-details">
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value highlight">{formatCurrency(work.price)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Deadline:</span>
                  <span className="detail-value">{work.deadline || 'No deadline'}</span>
                </div>

                {work.installment_features && (
                  <div className="detail-item full-width" style={{ marginTop: 8, padding: 12, background: 'rgba(255,215,0,0.05)', borderRadius: 8, border: '1px solid rgba(255,215,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 4 }}>
                      <span className="detail-label">Terbayar:</span>
                      <span className="detail-value" style={{ color: '#00c864' }}>{formatCurrency(work.installments_paid)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                      <span className="detail-label">Sisa Tagihan:</span>
                      <span className="detail-value" style={{ color: '#ff4444' }}>{formatCurrency(Math.max(0, work.price - work.installments_paid))}</span>
                    </div>

                    <div className="installment-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(100, Math.max(0, (work.installments_paid / Math.max(1, work.price)) * 100))}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{Math.floor(Math.min(100, Math.max(0, (work.installments_paid / Math.max(1, work.price)) * 100)))}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="work-actions">
                <button className="btn btn-outline payment-btn" onClick={() => handleOpenPaymentModal(work)}>
                  <span className="payment-icon">💰</span> Manage Payment
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="icon-btn edit-btn" onClick={() => handleOpenModal(work)} title="Edit Details">
                    <Edit2 size={18} />
                  </button>
                  <button className="icon-btn delete-btn" onClick={() => handleDeleteClick(work.id)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {workList.length === 0 && (
            <div className="empty-state">No ongoing or finished work tracked yet.</div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Work' : 'Add New Work'}</h2>
              <button className="icon-btn" onClick={handleCloseModal}><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <ImageUpload
                  label="Project Cover Image"
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  bucket="images"
                  folder="projects"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.project_name}
                    onChange={e => setFormData({ ...formData, project_name: e.target.value })}
                    placeholder="E.g., E-Commerce App"
                  />
                </div>
                <div className="form-group">
                  <label>Tech Stack</label>
                  <input
                    type="text"
                    value={formData.tech_stack}
                    onChange={e => setFormData({ ...formData, tech_stack: e.target.value })}
                    placeholder="E.g., Next.js, React, Supabase"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description (Frontend)</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description matching project style..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Live URL</label>
                  <input
                    type="text"
                    value={formData.live_url}
                    onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Repo URL</label>
                  <input
                    type="text"
                    value={formData.repo_url}
                    onChange={e => setFormData({ ...formData, repo_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Mark as Featured
                </label>
                <small style={{ color: '#888', marginTop: 4, display: 'block', fontSize: '0.8rem' }}>
                  This sets the featured badge on the project grid during and after completion.
                </small>
              </div>

              <div className="admin-divider">
                <span>Private Tracking Info Below</span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Client Name</label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="Client or Company Name"
                  />
                </div>
                <div className="form-group">
                  <label>Price (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="Total Project Price"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="On Going">On Going</option>
                    <option value="Finished">Finished</option>
                  </select>
                </div>
                {/* Removed duplicate payment/deadline fields from main Edit modal as they are now in Payment Modal */}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Details' : 'Add Work'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment & Status Manager Modal */}
      {isPaymentModalOpen && paymentData && (
        <div className="modal-overlay">
          <div className="modal-content glass-card payment-modal">
            <div className="modal-header">
              <h2>Billing & Status: <span style={{ color: '#ffd700' }}>{paymentData.project_name}</span></h2>
              <button className="icon-btn" onClick={handleClosePaymentModal}><X size={24} /></button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Project Status</label>
                  <select
                    value={paymentData.status}
                    onChange={e => setPaymentData({ ...paymentData, status: e.target.value })}
                    style={{ border: paymentData.status === 'Finished' ? '1px solid #00c864' : '1px solid #ffd700' }}
                  >
                    <option value="On Going">On Going</option>
                    <option value="Finished">Finished (Migrate to Projects)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={paymentData.deadline}
                    onChange={e => setPaymentData({ ...paymentData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Total Price (Rp)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={paymentData.price}
                  onChange={e => setPaymentData({ ...paymentData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="Total Project Price"
                  className="price-input"
                />
              </div>

              <div className="form-group checkbox-group" style={{ marginTop: 8 }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={paymentData.installment_features}
                    onChange={e => setPaymentData({ ...paymentData, installment_features: e.target.checked })}
                  />
                  Enable Installment Tracking (Cicilan)
                </label>
              </div>

              {paymentData.installment_features && (
                <div className="installments-section" style={{ marginTop: 16, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

                  <div className="form-row installments-row" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <div className="form-group" style={{ width: '100%' }}>
                      <label>Nominal Cicilan (Rp)</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={paymentData.new_payment_amount || ''}
                        onChange={e => setPaymentData({ ...paymentData, new_payment_amount: parseFloat(e.target.value) || 0 })}
                        className="price-input"
                        placeholder="Masukkan nominal bayar..."
                        style={{ color: '#00c864' }}
                      />

                    </div>
                  </div>

                  {paymentData.payment_history && paymentData.payment_history.length > 0 && (
                    <div className="history-section" style={{ marginTop: 16 }}>
                      <h4 style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: 8 }}>Histori Pembayaran</h4>
                      <div className="history-list" style={{ maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                        {paymentData.payment_history.map((hist, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderBottom: idx < paymentData.payment_history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                            <span style={{ color: '#888', fontSize: '0.85rem' }}>{formatDate(hist.date)}</span>
                            <span style={{ color: '#00c864', fontWeight: 500, fontSize: '0.9rem' }}>+ {formatCurrency(hist.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, marginTop: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>Total Harga:</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{formatCurrency(paymentData.price)}</span>
                </div>
                {paymentData.installment_features && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ color: '#888' }}>Sudah Dibayar:</span>
                      <span style={{ color: '#00c864', fontWeight: 600 }}>{formatCurrency(paymentData.installments_paid)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 8 }}>
                      <span style={{ color: '#888' }}>Sisa Pembayaran:</span>
                      <span style={{ color: '#ff4444', fontWeight: 600 }}>{formatCurrency(Math.max(0, paymentData.price - paymentData.installments_paid))}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleClosePaymentModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #111, #222)', border: '1px solid #ffd700', color: '#ffd700' }}>
                  Save Payment Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      {confirmDialog && (
        <div className="modal-overlay" style={{ zIndex: 2000 }}>
          <div className="confirm-dialog glass-card">
            <div className="confirm-icon">
              {confirmDialog.type === 'delete' || confirmDialog.type === 'error' ?
                <Trash2 size={32} color="#ff4444" /> :
                <CheckCircle size={32} color="#00c864" />
              }
            </div>
            <h3 style={{ color: confirmDialog.type === 'error' ? '#ff4444' : '#fff' }}>
              {confirmDialog.type === 'delete' ? 'Confirm Deletion' :
                confirmDialog.type === 'finish' ? 'Project Finished!' :
                  confirmDialog.type === 'error' ? 'Action Failed' : 'Success'}
            </h3>
            <p>{confirmDialog.message}</p>
            <div className="confirm-actions">
              {(confirmDialog.type === 'delete' || confirmDialog.type === 'finish') ? (
                <>
                  <button className="btn btn-outline" onClick={() => {
                    setConfirmDialog(null);
                    if (confirmDialog.type === 'finish' && !confirmDialog.isFromPayment) setIsModalOpen(true);
                    else if (confirmDialog.type === 'finish' && confirmDialog.isFromPayment) setIsPaymentModalOpen(true);
                  }}>
                    Cancel
                  </button>
                  <button
                    className={`btn ${confirmDialog.type === 'delete' ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => {
                      if (confirmDialog.type === 'delete') executeDelete(confirmDialog.id);
                      else if (confirmDialog.type === 'finish') executeFinishMigration(confirmDialog.data, confirmDialog.isFromPayment);
                    }}
                  >
                    {confirmDialog.type === 'delete' ? 'Yes, Delete' : 'Yes, Migrate to Projects'}
                  </button>
                </>
              ) : (
                <button className="btn btn-outline" style={{ width: '100%', borderColor: '#ff4444', color: '#ff4444' }} onClick={() => setConfirmDialog(null)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-page { max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .page-title { font-size: 1.8rem; font-family: 'Space Grotesk', sans-serif; }
        
        .work-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }
        
        .work-card {
          padding: 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .work-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 16px;
        }
        
        .work-title { font-size: 1.2rem; font-weight: 600; margin-bottom: 4px; color: #f5f5f5; }
        .work-client { font-size: 0.85rem; color: #888; }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-ongoing { background: rgba(255, 215, 0, 0.1); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.2); }
        .status-finished { background: rgba(0, 200, 100, 0.1); color: #00c864; border: 1px solid rgba(0, 200, 100, 0.2); }
        
        .work-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }
        .detail-item.full-width {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        
        .detail-label { color: #888; }
        .detail-value { font-weight: 500; color: #ccc; }
        .detail-value.highlight { color: #ffd700; }
        
        .installment-progress {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .progress-bar {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: #ffd700;
          border-radius: 4px;
        }
        .progress-text {
          font-size: 0.8rem;
          color: #888;
          min-width: 60px;
          text-align: right;
        }
        
        .work-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        
        .payment-btn {
          padding: 6px 14px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
          border-color: rgba(0, 200, 100, 0.3);
          color: #00c864;
          background: rgba(0, 200, 100, 0.05);
        }
        .payment-btn:hover {
          background: rgba(0, 200, 100, 0.15);
          border-color: rgba(0, 200, 100, 0.5);
        }
        .payment-icon { font-size: 1rem; }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #888;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px dashed rgba(255,255,255,0.1);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
        }
        .modal-content {
          width: 100%; max-width: 600px; padding: 32px; border-radius: 24px;
          max-height: 90vh; overflow-y: auto;
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
        }
        .modal-header h2 { font-size: 1.5rem; font-family: 'Space Grotesk', sans-serif; }
        .modal-form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: flex; gap: 16px; }
        .form-row .form-group { flex: 1; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; color: #aaa; font-weight: 500; }
        .form-group input, .form-group select, .form-group textarea {
          padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #fff; font-size: 1rem; transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none; border-color: rgba(255,215,0,0.5); box-shadow: 0 0 0 2px rgba(255,215,0,0.1);
        }
        
        .checkbox-group {
          background: rgba(255,215,0,0.05);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,215,0,0.1);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: #ffd700 !important;
        }
        .checkbox-label input { width: 18px; height: 18px; accent-color: #ffd700; }
        
        .admin-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 10px 0;
          color: rgba(255,40,40,0.8);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .admin-divider::before,
        .admin-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid rgba(255,40,40,0.3);
        }
        .admin-divider span {
          padding: 0 10px;
        }
        
        .installments-row {
          background: rgba(0,0,0,0.2);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        
        .modal-actions {
          display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        
        @media (max-width: 600px) {
          .form-row { flex-direction: column; gap: 20px; }
          .modal-content { padding: 24px; }
        }

        .payment-modal {
          max-width: 500px;
          border-top: 4px solid #ffd700;
        }
        .price-input {
          font-size: 1.2rem !important;
          color: #ffd700 !important;
          font-weight: 600;
        }

        .confirm-dialog {
          width: 100%;
          max-width: 400px;
          padding: 32px;
          border-radius: 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .confirm-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
        }
        .confirm-dialog h3 {
          font-size: 1.3rem;
          color: #fff;
        }
        .confirm-dialog p {
          color: #aaa;
          font-size: 0.95rem;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .confirm-actions {
          display: flex;
          gap: 12px;
          width: 100%;
          margin-top: 8px;
        }
        .confirm-actions button {
          flex: 1;
        }
        .btn-danger {
          background: rgba(255, 60, 60, 0.1);
          color: #ff4444;
          border: 1px solid rgba(255, 60, 60, 0.3);
        }
        .btn-danger:hover { background: rgba(255, 60, 60, 0.2); }
        .btn-success {
          background: rgba(0, 200, 100, 0.1);
          color: #00c864;
          border: 1px solid rgba(0, 200, 100, 0.3);
        }
        .btn-success:hover { background: rgba(0, 200, 100, 0.2); }
      `}</style>
    </div>
  );
}
