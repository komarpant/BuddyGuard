"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-effect">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to your BuddyGuard account</p>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Log In</button>
        </form>
        
        <p className="auth-link-text">
          Don't have an account? <Link href="/signup" className="auth-link">Sign up</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100vw;
          background: #F8F9FB;
          position: fixed;
          top: 0; left: 0; z-index: 10000;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(228, 228, 231, 0.8);
          text-align: center;
        }
        .auth-title {
          font-size: 28px;
          font-weight: 800;
          color: #1A1A2E;
          margin-bottom: 8px;
        }
        .auth-subtitle {
          color: #74818C;
          margin-bottom: 32px;
        }
        .auth-error {
          background: #FFF1F0;
          color: #DC2626;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .auth-input {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #E4E4E7;
          font-size: 16px;
          outline: none;
          transition: all 0.2s ease;
        }
        .auth-input:focus {
          border-color: #008170;
          box-shadow: 0 0 0 3px rgba(0, 129, 112, 0.1);
        }
        .auth-button {
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #008170 0%, #5CBFA0 100%);
          color: white;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin-top: 8px;
        }
        .auth-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 129, 112, 0.2);
        }
        .auth-link-text {
          margin-top: 24px;
          color: #74818C;
          font-size: 14px;
        }
        .auth-link {
          color: #008170;
          font-weight: 600;
          text-decoration: none;
        }
        .auth-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
