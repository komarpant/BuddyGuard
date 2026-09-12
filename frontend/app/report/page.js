"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

export default function ReportPage() {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState("");
  const [caseId, setCaseId] = useState("");
  const { user } = useAuth();

  const categories = [
    { value: "cyberbullying", label: "Cyberbullying", icon: "💻" },
    { value: "harassment", label: "Harassment", icon: "⚠️" },
    { value: "threats", label: "Threats", icon: "😰" },
    { value: "inappropriate", label: "Inappropriate Content", icon: "🚫" },
    { value: "other", label: "Other", icon: "📝" },
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post("/api/reports", {
        user_id: user?.id || "anonymous",
        category,
        description
      });
      setCaseId(response.case_id);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    }
  };

  if (submitted) {
    return (
      <div className="report-page">
        <div className="report-success animate-fade-in">
          <div className="success-icon">✅</div>
          <h2 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "12px" }}>
            Report Submitted
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
            Your report has been received and securely sent to the officials.
          </p>
          <div className="case-created">
            <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>Case ID</span>
            <span style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent-light)" }}>
              {caseId}
            </span>
            <span className="badge badge-info" style={{ marginTop: "8px" }}>Sent to Officials</span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "16px" }}>
            They will review it and take appropriate action.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: "24px" }}
            onClick={() => { setSubmitted(false); setDescription(""); setFiles([]); setCategory(""); setCaseId(""); }}
          >
            Submit Another Report
          </button>
        </div>

        <style jsx>{`
          .report-page { max-width: 600px; margin: 0 auto; padding-top: 40px; }
          .report-success { text-align: center; padding: 40px 20px; }
          .success-icon { font-size: 56px; margin-bottom: 20px; }
          .case-created {
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            padding: 20px; margin-top: 20px;
            background: var(--bg-card); border-radius: var(--radius-lg);
            border: 1px solid var(--border-default);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="report-page">
      <div className="animate-fade-in">
        <h1 className="section-title" style={{ fontSize: "24px" }}>📸 Report an Incident</h1>
        <p className="section-subtitle">
          Upload screenshots of bullying or describe what happened. Your report will create a case for review.
        </p>

        <form onSubmit={handleSubmit} className="report-form">
          {/* Category */}
          <div className="form-group">
            <label className="form-label">What happened?</label>
            <div className="category-grid">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.value}
                  className={`category-btn ${category === cat.value ? "category-active" : ""}`}
                  onClick={() => setCategory(cat.value)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Tell us more (optional)</label>
            <textarea
              className="input"
              placeholder="Describe what happened in your own words..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* File Upload */}
          <div className="form-group">
            <label className="form-label">Upload Screenshots</label>
            <div className="upload-area" onClick={() => document.getElementById("file-input").click()}>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="upload-icon">📎</div>
              <p className="upload-text">Click to upload images</p>
              <p className="upload-hint">PNG, JPG up to 10MB each (max 5 files)</p>
            </div>

            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, i) => (
                  <div key={i} className="file-item">
                    <span className="file-name">📄 {file.name}</span>
                    <button type="button" className="file-remove" onClick={() => removeFile(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "14px", fontSize: "16px" }}
            disabled={!category}
          >
            Submit Report
          </button>
        </form>
      </div>

      <style jsx>{`
        .report-page { max-width: 600px; margin: 0 auto; }
        .report-form { display: flex; flex-direction: column; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 14px; font-weight: 600; color: var(--text-primary); }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 8px;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          font-size: 13px;
          font-family: inherit;
          transition: all var(--transition-fast);
        }

        .category-btn:hover {
          border-color: var(--accent);
          color: var(--text-primary);
        }

        .category-active {
          border-color: var(--accent);
          background: rgba(91, 141, 239, 0.1);
          color: var(--accent-light);
        }

        .category-icon { font-size: 18px; }

        .upload-area {
          padding: 32px;
          border: 2px dashed var(--border-default);
          border-radius: var(--radius-lg);
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .upload-area:hover {
          border-color: var(--accent);
          background: rgba(91, 141, 239, 0.05);
        }

        .upload-icon { font-size: 32px; margin-bottom: 8px; }
        .upload-text { font-size: 14px; color: var(--text-primary); margin: 0 0 4px; }
        .upload-hint { font-size: 12px; color: var(--text-muted); margin: 0; }

        .file-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
        }
        .file-name { font-size: 13px; color: var(--text-primary); }
        .file-remove {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 14px;
          padding: 2px 6px;
        }
        .file-remove:hover { color: var(--status-critical); }
      `}</style>
    </div>
  );
}
