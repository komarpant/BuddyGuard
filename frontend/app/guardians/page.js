"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";

export default function GuardiansPage() {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuardian, setNewGuardian] = useState({
    name: "",
    relationship: "Parent",
    whatsapp_number: "",
    phone_number: "",
    notes: ""
  });

  const fetchGuardians = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/guardians/${user.id}`);
      setGuardians(response.guardians || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, [user]);

  const handleAddGuardian = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await api.post("/api/guardians", {
        user_id: user.id,
        ...newGuardian
      });
      setShowAddModal(false);
      setNewGuardian({ name: "", relationship: "Parent", whatsapp_number: "", phone_number: "", notes: "" });
      fetchGuardians();
    } catch (err) {
      console.error(err);
      alert("Failed to add guardian");
    }
  };

  const handleUpdateNotes = async (guardianId, newNotes) => {
    try {
      await api.put(`/api/guardians/${guardianId}`, { notes: newNotes });
      setGuardians(prev => prev.map(g => g.id === guardianId ? { ...g, notes: newNotes } : g));
    } catch (err) {
      console.error(err);
      alert("Failed to save notes");
    }
  };

  const handleDelete = async (guardianId) => {
    if (!confirm("Are you sure you want to remove this guardian?")) return;
    try {
      await api.delete(`/api/guardians/${guardianId}`);
      fetchGuardians();
    } catch (err) {
      console.error(err);
      alert("Failed to delete guardian");
    }
  };

  const getRelationshipColor = (rel) => {
    const colors = {
      "Parent": "#5B8DEF",
      "Therapist": "#008170",
      "Official": "#D4A24C",
      "Teacher": "#9B7FE6",
      "Friend": "#4DBAB2"
    };
    return colors[rel] || "#7B8FA3";
  };

  return (
    <div className="guardians-page">
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="section-title" style={{ fontSize: "28px" }}>👥 My Network</h1>
          <p className="section-subtitle">Manage your trusted guardians, therapists, and emergency contacts.</p>
        </div>
        <button className="add-btn shadow-glow" onClick={() => setShowAddModal(true)}>
          + Add Contact
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading your network...</div>
      ) : guardians.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div className="empty-icon">🛡️</div>
          <h3>No guardians added yet</h3>
          <p>Add a parent, therapist, or official to your network to keep their contact info handy.</p>
          <button className="add-btn" onClick={() => setShowAddModal(true)} style={{ marginTop: "16px" }}>Add your first Guardian</button>
        </div>
      ) : (
        <div className="guardians-grid">
          {guardians.map((g, i) => (
            <div key={g.id} className={`guardian-card glass animate-fade-in stagger-${Math.min(i + 1, 5)}`}>
              <div className="card-header">
                <div className="avatar" style={{ background: getRelationshipColor(g.relationship) }}>
                  {g.name.charAt(0).toUpperCase()}
                </div>
                <div className="info">
                  <div className="name-row">
                    <h3 className="name">{g.name}</h3>
                    <span className="badge" style={{ backgroundColor: getRelationshipColor(g.relationship) + "22", color: getRelationshipColor(g.relationship), border: `1px solid ${getRelationshipColor(g.relationship)}44` }}>
                      {g.relationship}
                    </span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(g.id)} title="Remove Guardian">×</button>
              </div>

              <div className="card-actions">
                <a href={`https://wa.me/${g.whatsapp_number.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="action-btn whatsapp-btn">
                  💬 WhatsApp
                </a>
                <a href={`tel:${g.phone_number.replace(/\D/g,'')}`} className="action-btn call-btn">
                  📞 Call
                </a>
              </div>

              <div className="notes-section">
                <label>Conversation Notes</label>
                <textarea 
                  className="notes-input" 
                  placeholder="Save notes from your conversations..."
                  defaultValue={g.notes}
                  onBlur={(e) => handleUpdateNotes(g.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-fade-in">
            <h2>Add New Contact</h2>
            <form onSubmit={handleAddGuardian}>
              <div className="form-group">
                <label>Name</label>
                <input required type="text" value={newGuardian.name} onChange={e => setNewGuardian({...newGuardian, name: e.target.value})} placeholder="e.g. Dr. Sarah" />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <select value={newGuardian.relationship} onChange={e => setNewGuardian({...newGuardian, relationship: e.target.value})}>
                  <option>Parent</option>
                  <option>Therapist</option>
                  <option>Teacher</option>
                  <option>Official</option>
                  <option>Friend</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input required type="text" value={newGuardian.whatsapp_number} onChange={e => setNewGuardian({...newGuardian, whatsapp_number: e.target.value})} placeholder="+1 234 567 8900" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required type="text" value={newGuardian.phone_number} onChange={e => setNewGuardian({...newGuardian, phone_number: e.target.value})} placeholder="+1 234 567 8900" />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Save Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .guardians-page { max-width: 1000px; margin: 0 auto; padding-bottom: 40px; }

        .page-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
        }

        .add-btn {
          background: linear-gradient(135deg, #008170 0%, #5CBFA0 100%);
          color: white; border: none; padding: 12px 24px;
          border-radius: 12px; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: all 0.3s ease;
        }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0, 129, 112, 0.25); }

        .empty-state {
          text-align: center; padding: 60px 20px;
          background: rgba(255, 255, 255, 0.5); border-radius: 24px;
          border: 1px dashed var(--border-default);
        }
        .empty-icon { font-size: 48px; margin-bottom: 16px; }

        .guardians-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .guardian-card {
          padding: 24px; border-radius: 20px;
          display: flex; flex-direction: column; gap: 20px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
        }

        .card-header {
          display: flex; gap: 16px; align-items: flex-start;
        }

        .avatar {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 20px; font-weight: 700; flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .info { flex: 1; }
        .name-row { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
        .name { font-size: 18px; font-weight: 700; color: #1A1A2E; margin: 0; }
        .badge { font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 600; }

        .delete-btn {
          background: none; border: none; font-size: 24px; color: #94A3B8;
          cursor: pointer; padding: 0; line-height: 1; margin-top: -4px;
        }
        .delete-btn:hover { color: #EF4444; }

        .card-actions {
          display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
        }

        .action-btn {
          padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600;
          text-align: center; text-decoration: none; display: block;
          transition: 0.2s ease;
        }
        
        .whatsapp-btn {
          background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7;
        }
        .whatsapp-btn:hover { background: #C8E6C9; transform: translateY(-1px); }

        .call-btn {
          background: #E3F2FD; color: #1565C0; border: 1px solid #90CAF9;
        }
        .call-btn:hover { background: #BBDEFB; transform: translateY(-1px); }

        .notes-section {
          display: flex; flex-direction: column; gap: 8px;
        }
        .notes-section label {
          font-size: 12px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .notes-input {
          width: 100%; height: 100px; padding: 12px;
          border-radius: 12px; border: 1px solid rgba(228, 228, 231, 0.8);
          background: rgba(255, 255, 255, 0.5);
          font-family: inherit; font-size: 14px; color: #1A1A2E;
          resize: vertical; transition: all 0.2s ease;
        }
        .notes-input:focus {
          outline: none; border-color: #5B8DEF; background: white;
          box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.1);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center;
          z-index: 2000; padding: 20px;
        }
        
        .modal-content {
          width: 100%; max-width: 440px; background: white;
          padding: 32px; border-radius: 24px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.2);
        }

        .modal-content h2 { margin-bottom: 24px; font-size: 22px; color: #1A1A2E; }

        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #475569; }
        .form-group input, .form-group select {
          width: 100%; padding: 12px 16px; border-radius: 12px;
          border: 1px solid #E2E8F0; background: #F8FAFC;
          font-family: inherit; font-size: 15px; color: #1A1A2E;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none; border-color: #5B8DEF; background: white;
          box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.1);
        }

        .modal-actions {
          display: flex; gap: 12px; margin-top: 32px;
        }
        .modal-actions button {
          flex: 1; padding: 14px; border-radius: 12px; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: all 0.2s ease;
        }
        
        .cancel-btn {
          background: #F1F5F9; color: #475569; border: none;
        }
        .cancel-btn:hover { background: #E2E8F0; }
        
        .save-btn {
          background: #1A1A2E; color: white; border: none;
        }
        .save-btn:hover { background: #0F172A; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      `}</style>
    </div>
  );
}
