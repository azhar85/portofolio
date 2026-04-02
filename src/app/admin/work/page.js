'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, X, CheckCircle, Clock } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import TechStackPicker from '@/components/TechStackPicker';
import { resolveTechIconFromValue } from '@/lib/skill-icons';

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
    tech_stack: [],
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
        tech_stack: (work.tech_stack || []).map((tech) => resolveTechIconFromValue(tech)?.value || tech),
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
        tech_stack: [],
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

  function getRemainingAmount(price, paid) {
    return Math.max(0, Number(price || 0) - Number(paid || 0));
  }

  function isPaymentSettled(price, paid) {
    return getRemainingAmount(price, paid) <= 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const workData = {
        ...formData,
        tech_stack: (formData.tech_stack || []).map((tech) => resolveTechIconFromValue(tech)?.value || tech),
        deadline: formData.deadline ? formData.deadline : null
      };

      // Only migrate if the project is finished and fully paid.
      if (workData.status === 'Finished' && isPaymentSettled(workData.price, workData.installments_paid)) {
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
      let updatedHistory = [...(paymentData.payment_history || [])];
      let newTotalPaid = paymentData.installments_paid;

      if (paymentData.new_payment_amount > 0) {
        updatedHistory.push({
          amount: paymentData.new_payment_amount,
          date: new Date().toISOString()
        });
        newTotalPaid += paymentData.new_payment_amount;
      }

      if (paymentData.status === 'Finished' && isPaymentSettled(paymentData.price, newTotalPaid)) {
        // If they change status to Finished in Payment Modal, fetch full work data for migration
        const { data: fullWork } = await supabase.from('work').select('*').eq('id', paymentData.id).single();
        if (fullWork) {
          setIsPaymentModalOpen(false);
          const updatedWorkData = {
            ...fullWork,
            ...paymentData,
            installments_paid: newTotalPaid,
            payment_history: updatedHistory
          };
          triggerFinishMigration(updatedWorkData, true);
        }
        return;
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
          <Plus size={18} /> Add
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading work data...</div>
      ) : (
        <div className="work-list">
          {workList.map((work) => (
            <div
              key={work.id}
              className={`work-list-item glass-card ${work.status === 'Finished' && !isPaymentSettled(work.price, work.installments_paid) ? 'work-list-item-finished' : ''}`}
              onClick={() => handleOpenPaymentModal(work)}
              style={{ cursor: 'pointer' }}
            >

              {/* Left Side: Info */}
              <div className="work-item-info">
                <div className="work-item-header" style={{ justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 className="work-title">{work.project_name}</h3>
                    {work.status === 'Finished' && (
                      <span className="status-badge status-finished">
                        <CheckCircle size={12} />
                        {isPaymentSettled(work.price, work.installments_paid) ? 'Finished' : 'Finished - Belum Lunas'}
                      </span>
                    )}
                  </div>
                  <span className="meta-deadline" style={{ fontSize: '0.85rem', color: '#888' }}>
                    {work.deadline || '-'}
                  </span>
                </div>
                <div className="work-item-meta" style={{ marginTop: 4 }}>
                  <span className="meta-price">{formatCurrency(work.price)}</span>
                </div>
                <p className="work-client" style={{ marginTop: 4 }}>{work.client_name ? `Client: ${work.client_name}` : 'No Client Name'}</p>

                <div className={`compact-progress ${work.status === 'Finished' && !isPaymentSettled(work.price, work.installments_paid) ? 'compact-progress-finished' : ''}`} style={{ marginTop: 8 }}>
                  <div className="compact-progress-header">
                    <span>Terbayar: <strong className="text-success">{formatCurrency(work.installments_paid)}</strong></span>
                    <span>Sisa: <strong className="text-danger">{formatCurrency(getRemainingAmount(work.price, work.installments_paid))}</strong></span>
                  </div>
                  <div className="progress-bar thin">
                    <div
                      className={`progress-fill ${work.status === 'Finished' && !isPaymentSettled(work.price, work.installments_paid) ? 'progress-fill-finished' : ''}`}
                      style={{ width: `${Math.min(100, Math.max(0, (work.installments_paid / Math.max(1, work.price)) * 100))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions (Stop propagation to prevent card click) */}
              <div className="work-item-actions">
                <div className="action-group">
                  <button
                    className="icon-btn edit-btn"
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(work); }}
                    title="Edit Details"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(work.id); }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
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
              <button className="icon-btn close-btn" onClick={handleCloseModal} title="Close Modal"><X size={24} /></button>
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
                  <TechStackPicker
                    value={formData.tech_stack || []}
                    onChange={(tech_stack) => setFormData({ ...formData, tech_stack })}
                    placeholder="Select tech for this ongoing project"
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
            <div className="modal-header" style={{ marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: 4 }}>Manage Payment</h2>
                <span style={{ color: '#ffd700', fontSize: '0.9rem', fontWeight: 500 }}>{paymentData.project_name}</span>
              </div>
              <button className="icon-btn close-btn" onClick={handleClosePaymentModal} title="Close Modal"><X size={24} /></button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="modal-form" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Project Status</label>
                <select
                  value={paymentData.status}
                  onChange={e => setPaymentData({ ...paymentData, status: e.target.value })}
                  style={{
                    border: paymentData.status === 'Finished' ? '1px solid #00c864' : '1px solid rgba(255,215,0,0.3)',
                    color: paymentData.status === 'Finished' ? '#00c864' : '#fff'
                  }}
                >
                  <option value="On Going">On Going</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={paymentData.deadline}
                    onChange={e => setPaymentData({ ...paymentData, deadline: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Total Price (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={paymentData.price}
                    onChange={e => setPaymentData({ ...paymentData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="E.g. 5000000"
                    className="price-input"
                  />
                </div>
              </div>

              <div className="installments-section" style={{ padding: '4px 0 0 0' }}>

                <div className="form-group" style={{ width: '100%', marginBottom: 16 }}>
                  <label style={{ color: '#00c864' }}>+ Input Pembayaran Baru (Rp)</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={paymentData.new_payment_amount || ''}
                      onChange={e => setPaymentData({ ...paymentData, new_payment_amount: parseFloat(e.target.value) || 0 })}
                      className="price-input"
                      placeholder="Contoh: 1000000"
                      style={{ flex: 1, borderColor: paymentData.new_payment_amount > 0 ? '#00c864' : 'rgba(255,255,255,0.1)' }}
                    />
                  </div>
                </div>

                {paymentData.payment_history && paymentData.payment_history.length > 0 && (
                  <div className="history-section">
                    <h4>Histori Pembayaran</h4>
                    <div className="history-list">
                      {paymentData.payment_history.map((hist, idx) => (
                        <div
                          key={idx}
                          className="history-item"
                          style={{ borderBottom: idx < paymentData.payment_history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                        >
                          <span className="history-date">{formatDate(hist.date)}</span>
                          <span className="history-amount">+ {formatCurrency(hist.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="summary-box">
                <div className="summary-row">
                  <span>Total Harga Project:</span>
                  <span className="summary-total">{formatCurrency(paymentData.price)}</span>
                </div>
                <div className="summary-row">
                  <span>Total Terbayar:</span>
                  <span className="summary-paid">{formatCurrency(paymentData.installments_paid)}</span>
                </div>
                {paymentData.new_payment_amount > 0 && (
                  <div className="summary-row" style={{ color: '#00c864', fontSize: '0.85rem', marginTop: '-8px' }}>
                    <span>+ Pembayaran Baru:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(paymentData.new_payment_amount)}</span>
                  </div>
                )}
                <div className="summary-row summary-sisa">
                  <span>Sisa Pembayaran:</span>
                  <span className="summary-deficit">
                    {formatCurrency(Math.max(0, paymentData.price - (paymentData.installments_paid + (paymentData.new_payment_amount || 0))))}
                  </span>
                </div>
              </div>

              <div className="modal-actions" style={{ paddingTop: 16, marginTop: 4 }}>
                <button type="button" className="btn btn-outline" onClick={handleClosePaymentModal}>Cancel</button>
                <button type="submit" className="btn btn-primary premium-btn">Save Content</button>
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
        
        .work-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .work-list-item {
          padding: 16px 20px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .work-list-item:hover {
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,215,0,0.15);
        }
        .work-list-item-finished {
          border-color: rgba(0, 200, 100, 0.28);
          background: linear-gradient(135deg, rgba(0, 200, 100, 0.08), rgba(255,255,255,0.02));
          box-shadow: inset 0 0 0 1px rgba(0, 200, 100, 0.08);
        }
        .work-list-item-finished:hover {
          background: linear-gradient(135deg, rgba(0, 200, 100, 0.14), rgba(255,255,255,0.03));
          border-color: rgba(0, 200, 100, 0.45);
        }
        
        .work-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .work-item-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .work-title { font-size: 1.1rem; font-weight: 600; color: #f5f5f5; margin: 0; }
        .work-client { font-size: 0.8rem; color: #888; margin: 0; }
        
        .work-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #aaa;
          margin-top: 2px;
        }
        .meta-price { color: #ffd700; font-weight: 500; }
        .meta-divider { color: rgba(255,255,255,0.2); }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .status-ongoing { background: rgba(255, 215, 0, 0.1); color: #ffd700; border: 1px solid rgba(255, 215, 0, 0.2); }
        .status-finished { background: rgba(0, 200, 100, 0.1); color: #00c864; border: 1px solid rgba(0, 200, 100, 0.2); }
        
        .text-success { color: #00c864 !important; }
        .text-danger { color: #ff4444 !important; }

        .compact-progress {
          margin-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(0,0,0,0.2);
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.02);
        }
        .compact-progress-finished {
          background: rgba(0, 200, 100, 0.08);
          border-color: rgba(0, 200, 100, 0.12);
        }
        .compact-progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #888;
        }
        
        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar.thin { height: 4px; }
        .progress-fill {
          height: 100%;
          background: #ffd700;
          border-radius: 4px;
        }
        .progress-fill-finished {
          background: linear-gradient(90deg, #00c864, #39d98a);
        }
        
        .work-item-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .action-group {
          display: flex;
          gap: 8px;
        }

        .payment-btn.compact-btn {
          padding: 6px 12px;
          font-size: 0.8rem;
        }
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 50px;
          border: 1px solid rgba(0, 200, 100, 0.4);
          color: #00c864;
          background: rgba(0, 200, 100, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .payment-btn:hover {
          background: rgba(0, 200, 100, 0.2);
          border-color: rgba(0, 200, 100, 0.8);
          transform: translateY(-2px);
        }
        .payment-icon { font-size: 1rem; }
        
        .icon-btn {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.05);
          color: #aaa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .edit-btn:hover { color: #fff; background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }
        .delete-btn:hover { color: #ff4444; background: rgba(255,60,60,0.15); border-color: rgba(255,60,60,0.4); }
        .close-btn {
          padding: 10px;
          border-radius: 12px;
          background: rgba(255, 60, 60, 0.08); /* distinct reddish box */
          color: #ff6b6b;
          border: 1px solid rgba(255, 60, 60, 0.15);
        }
        .close-btn:hover {
          background: rgba(255, 60, 60, 0.2);
          color: #fff;
          border-color: rgba(255, 60, 60, 0.4);
        }
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #888;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          border: 1px dashed rgba(255,255,255,0.1);
        }

        @media (max-width: 768px) {
          .work-list-item {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          .work-item-actions {
            justify-content: space-between;
            border-top: 1px solid rgba(255,255,255,0.05);
            padding-top: 16px;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;
        }
        .modal-content {
          width: 100%; max-width: 600px; padding: 32px; border-radius: 24px;
          max-height: 90vh; overflow-y: auto;
          background: rgba(15, 15, 15, 0.95);
          box-shadow: 0 24px 48px rgba(0,0,0,0.5);
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
          padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #fff; font-size: 1rem; transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          outline: none; border-color: rgba(255,215,0,0.5); box-shadow: 0 0 0 2px rgba(255,215,0,0.1);
          background: rgba(0,0,0,0.6);
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
          .form-row { flex-direction: column; gap: 16px; }
          .modal-content { padding: 24px 20px; }
          .work-actions { flex-direction: column; align-items: stretch; gap: 12px; }
          .payment-btn { justify-content: center; }
          .action-group { justify-content: space-between; }
          
          /* Only stretch the edit/delete icon buttons in the list, not the modal close button */
          .work-item-actions .icon-btn { flex: 1; }
          
          .close-btn { 
            flex: none; 
            width: 44px; /* Fixed touch target size on mobile */
            height: 44px;
            padding: 10px;
          }
        }

        .payment-modal {
          max-width: 500px;
          border-top: 4px solid #ffd700;
        }
        .price-input {
          font-size: 1.05rem !important;
          color: #ffd700 !important;
          font-weight: 500;
        }
        
        .history-section {
          background: rgba(0,0,0,0.2);
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .history-section h4 {
          font-size: 0.95rem;
          color: #aaa;
          margin-bottom: 12px;
        }
        .history-list {
          max-height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .history-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 8px;
          transition: background 0.2s;
          border-radius: 6px;
        }
        .history-item:hover { background: rgba(255,255,255,0.02); }
        .history-date { color: #888; font-size: 0.85rem; }
        .history-amount { color: #00c864; font-weight: 600; }

        .summary-box {
          background: rgba(20,20,20,0.8);
          padding: 16px;
          border-radius: 12px;
          border: 1px dashed rgba(255,215,0,0.2);
          margin-top: 8px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: #aaa;
          align-items: center;
        }
        .summary-total { color: #fff; font-weight: 600; font-size: 0.95rem; }
        .summary-paid { color: #00c864; font-weight: 500; }
        .summary-sisa {
          border-top: 1px dashed rgba(255,255,255,0.1);
          padding-top: 12px;
          margin-bottom: 0;
          color: #fff;
        }
        .summary-deficit { color: #ff4444; font-weight: 600; font-size: 1rem; }

        .premium-btn {
          background: linear-gradient(135deg, #111, #222);
          border: 1px solid rgba(255,215,0,0.5);
          color: #ffd700;
          transition: all 0.3s ease;
        }
        .premium-btn:hover {
          background: linear-gradient(135deg, #222, #333);
          border-color: #ffd700;
          box-shadow: 0 4px 12px rgba(255,215,0,0.15);
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
          background: rgba(20, 20, 20, 0.98);
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
