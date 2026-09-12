"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";

export default function GuardiansPage() {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editGuardian, setEditGuardian] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [notesByGuardian, setNotesByGuardian] = useState({});
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const [form, setForm] = useState({
    name: "", relationship: "Parent", whatsapp_number: "", phone_number: ""
  });

  const fetchGuardians = async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/guardians/${user.id}`);
      setGuardians(response.guardians || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchNotes = async (guardianId) => {
    try {
      const response = await api.get(`/api/guardian-notes/${guardianId}`);
      setNotesByGuardian(prev => ({ ...prev, [guardianId]: response.notes || [] }));
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGuardians(); }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/guardians", { user_id: user.id, ...form });
      setShowAddModal(false);
      setForm({ name: "", relationship: "Parent", whatsapp_number: "", phone_number: "" });
      fetchGuardians();
    } catch (err) { alert("Failed to add"); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/guardians/${editGuardian.id}`, {
        name: form.name, relationship: form.relationship,
        whatsapp_number: form.whatsapp_number, phone_number: form.phone_number
      });
      setEditGuardian(null);
      fetchGuardians();
    } catch (err) { alert("Failed to update"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this guardian?")) return;
    try {
      await api.delete(`/api/guardians/${id}`);
      fetchGuardians();
    } catch (err) { alert("Failed to delete"); }
  };

  const openEdit = (g) => {
    setForm({ name: g.name, relationship: g.relationship, whatsapp_number: g.whatsapp_number, phone_number: g.phone_number });
    setEditGuardian(g);
  };

  const toggleExpand = (id) => {
    if (expandedCard === id) { setExpandedCard(null); return; }
    setExpandedCard(id);
    if (!notesByGuardian[id]) fetchNotes(id);
  };

  const handleAddNote = async (guardianId) => {
    if (!newNote.title.trim()) return;
    try {
      await api.post("/api/guardian-notes", { guardian_id: guardianId, title: newNote.title, content: newNote.content });
      setNewNote({ title: "", content: "" });
      fetchNotes(guardianId);
    } catch (err) { alert("Failed to save note"); }
  };

  const handleDeleteNote = async (noteId, guardianId) => {
    try {
      await api.delete(`/api/guardian-notes/${noteId}`);
      fetchNotes(guardianId);
    } catch (err) { alert("Failed to delete note"); }
  };

  const getColor = (rel) => {
    const c = { Parent: "#5B8DEF", Therapist: "#008170", Official: "#D4A24C", Teacher: "#9B7FE6", Friend: "#4DBAB2" };
    return c[rel] || "#7B8FA3";
  };

  return (
    <div className="guardians-page">
      <div className="page-header animate-fade-in">
        <div>
          <h1 className="section-title" style={{ fontSize: "28px" }}>👥 My Network</h1>
          <p className="section-subtitle">Your trusted guardians, therapists, and contacts.</p>
        </div>
        <button className="add-btn" onClick={() => { setForm({ name: "", relationship: "Parent", whatsapp_number: "", phone_number: "" }); setShowAddModal(true); }}>+ Add Contact</button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>Loading...</div>
      ) : guardians.length === 0 ? (
        <div className="empty-state animate-fade-in">
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
          <h3>No guardians yet</h3>
          <p>Add a parent, therapist, or friend to your network.</p>
          <button className="add-btn" onClick={() => setShowAddModal(true)} style={{ marginTop: 16 }}>Add your first Guardian</button>
        </div>
      ) : (
        <div className="guardians-list">
          {guardians.map((g, i) => (
            <div key={g.id} className={`guardian-card glass animate-fade-in stagger-${Math.min(i+1,5)}`}>
              {/* Header */}
              <div className="card-header">
                <div className="avatar" style={{ background: getColor(g.relationship) }}>{g.name.charAt(0).toUpperCase()}</div>
                <div className="info">
                  <h3 className="name">{g.name}</h3>
                  <span className="badge" style={{ backgroundColor: getColor(g.relationship)+"22", color: getColor(g.relationship), border: `1px solid ${getColor(g.relationship)}44` }}>{g.relationship}</span>
                </div>
                <div className="card-btns">
                  <button className="icon-btn edit" onClick={() => openEdit(g)} title="Edit">✏️</button>
                  <button className="icon-btn delete" onClick={() => handleDelete(g.id)} title="Delete">🗑️</button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-actions">
                <a href={`https://wa.me/${g.whatsapp_number?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="action-btn wa">💬 WhatsApp</a>
                <a href={`tel:${g.phone_number?.replace(/\D/g,'')}`} className="action-btn call">📞 Call</a>
              </div>

              {/* Expand for Notes */}
              <button className="notes-toggle" onClick={() => toggleExpand(g.id)}>
                📝 Conversation Notes {expandedCard === g.id ? "▲" : "▼"}
              </button>

              {expandedCard === g.id && (
                <div className="notes-section">
                  {/* Add Note Form */}
                  <div className="note-form">
                    <input placeholder="Title (e.g. Session about anxiety)" value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})} />
                    <textarea placeholder="What did you discuss? How did they help?" value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})} />
                    <button className="save-note-btn" onClick={() => handleAddNote(g.id)}>+ Save Note</button>
                  </div>

                  {/* Notes List */}
                  <div className="notes-list">
                    {(notesByGuardian[g.id] || []).length === 0 ? (
                      <p className="no-notes">No conversation notes yet. Add one above!</p>
                    ) : (notesByGuardian[g.id] || []).map(note => (
                      <div key={note.id} className="note-item">
                        <div className="note-header">
                          <strong>{note.title}</strong>
                          <div className="note-meta">
                            <span>{note.date}</span>
                            <button className="note-delete" onClick={() => handleDeleteNote(note.id, g.id)}>×</button>
                          </div>
                        </div>
                        {note.content && <p className="note-content">{note.content}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(showAddModal || editGuardian) && (
        <div className="modal-overlay">
          <div className="modal-content glass animate-fade-in">
            <h2>{editGuardian ? "Edit Contact" : "Add New Contact"}</h2>
            <form onSubmit={editGuardian ? handleEdit : handleAdd}>
              <div className="form-group">
                <label>Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Dr. Sarah" />
              </div>
              <div className="form-group">
                <label>Relationship</label>
                <select value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})}>
                  <option>Parent</option><option>Therapist</option><option>Teacher</option>
                  <option>Official</option><option>Friend</option><option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input required value={form.whatsapp_number} onChange={e => setForm({...form, whatsapp_number: e.target.value})} placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input required value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} placeholder="+91 98765 43210" />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => { setShowAddModal(false); setEditGuardian(null); }}>Cancel</button>
                <button type="submit" className="save-btn">{editGuardian ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .guardians-page { max-width: 800px; margin: 0 auto; padding-bottom: 40px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
        .add-btn { background: linear-gradient(135deg, #008170, #5CBFA0); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.3s ease; }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,129,112,0.25); }
        .empty-state { text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.5); border-radius: 24px; border: 1px dashed var(--border-default); }
        .guardians-list { display: flex; flex-direction: column; gap: 20px; }

        .guardian-card { padding: 24px; border-radius: 20px; display: flex; flex-direction: column; gap: 16px; border: 1px solid rgba(255,255,255,0.8); box-shadow: 0 8px 32px rgba(0,0,0,0.05); }
        .card-header { display: flex; gap: 16px; align-items: center; }
        .avatar { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; font-weight: 700; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .name { font-size: 18px; font-weight: 700; color: #1A1A2E; margin: 0; }
        .badge { font-size: 11px; padding: 2px 8px; border-radius: 6px; font-weight: 600; width: fit-content; }
        .card-btns { display: flex; gap: 8px; }
        .icon-btn { background: none; border: none; font-size: 16px; cursor: pointer; padding: 6px; border-radius: 8px; transition: 0.2s; }
        .icon-btn:hover { background: #F1F5F9; }
        .icon-btn.delete:hover { background: #FEE2E2; }

        .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .action-btn { padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; text-align: center; text-decoration: none; display: block; transition: 0.2s; }
        .wa { background: #E8F5E9; color: #2E7D32; border: 1px solid #A5D6A7; }
        .wa:hover { background: #C8E6C9; transform: translateY(-1px); }
        .call { background: #E3F2FD; color: #1565C0; border: 1px solid #90CAF9; }
        .call:hover { background: #BBDEFB; transform: translateY(-1px); }

        .notes-toggle { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: 0.2s; width: 100%; text-align: left; }
        .notes-toggle:hover { background: #F1F5F9; }

        .notes-section { display: flex; flex-direction: column; gap: 16px; padding-top: 4px; }
        .note-form { display: flex; flex-direction: column; gap: 8px; }
        .note-form input, .note-form textarea { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid #E2E8F0; background: #F8FAFC; font-family: inherit; font-size: 14px; color: #1A1A2E; }
        .note-form input:focus, .note-form textarea:focus { outline: none; border-color: #5B8DEF; background: white; box-shadow: 0 0 0 3px rgba(91,141,239,0.1); }
        .note-form textarea { height: 70px; resize: vertical; }
        .save-note-btn { background: #1A1A2E; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; align-self: flex-start; transition: 0.2s; }
        .save-note-btn:hover { background: #0F172A; transform: translateY(-1px); }

        .notes-list { display: flex; flex-direction: column; gap: 10px; }
        .no-notes { font-size: 13px; color: #94A3B8; text-align: center; padding: 12px; }
        .note-item { padding: 14px 16px; border-radius: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; }
        .note-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .note-header strong { font-size: 14px; color: #1A1A2E; }
        .note-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .note-meta span { font-size: 11px; color: #94A3B8; }
        .note-delete { background: none; border: none; font-size: 18px; color: #94A3B8; cursor: pointer; padding: 0; line-height: 1; }
        .note-delete:hover { color: #EF4444; }
        .note-content { font-size: 13px; color: #475569; line-height: 1.5; margin-top: 8px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal-content { width: 100%; max-width: 440px; background: white; padding: 32px; border-radius: 24px; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
        .modal-content h2 { margin-bottom: 24px; font-size: 22px; color: #1A1A2E; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #475569; }
        .form-group input, .form-group select { width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid #E2E8F0; background: #F8FAFC; font-family: inherit; font-size: 15px; color: #1A1A2E; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #5B8DEF; background: white; box-shadow: 0 0 0 3px rgba(91,141,239,0.1); }
        .modal-actions { display: flex; gap: 12px; margin-top: 32px; }
        .modal-actions button { flex: 1; padding: 14px; border-radius: 12px; font-weight: 600; font-size: 15px; cursor: pointer; transition: 0.2s; }
        .cancel-btn { background: #F1F5F9; color: #475569; border: none; }
        .cancel-btn:hover { background: #E2E8F0; }
        .save-btn { background: #1A1A2E; color: white; border: none; }
        .save-btn:hover { background: #0F172A; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      `}</style>
    </div>
  );
}
