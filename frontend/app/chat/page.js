"use client";

import { useState, useRef, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

export default function ChatPage() {
  const { user } = useAuth();
  
  // Start with a blank slate!
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch previous conversations on load
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const response = await api.get(`/api/chat/conversations/${user.id}`);
      setConversations(response.conversations || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversation = async (conversationId) => {
    setActiveConversationId(conversationId);
    try {
      const response = await api.get(`/api/chat/messages/${conversationId}`);
      const msgs = response.messages || [];
      setMessages(msgs.map(m => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      })));
    } catch (e) {
      console.error(e);
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMsgRaw = {
      id: Date.now(),
      sender: "child",
      text: input.trim(),
      created_at: Date.now()
    };
    
    const userMsg = {
      ...userMsgRaw,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const response = await api.post("/api/chat", {
        user_id: user.id,
        message: currentInput,
        anonymous: false,
        conversation_id: activeConversationId
      });
      
      if (!activeConversationId) {
        setActiveConversationId(response.conversation_id);
        fetchConversations();
      }

      const buddyMsgRaw = response.buddy_message;
      const buddyMsg = {
        ...buddyMsgRaw,
        time: new Date(buddyMsgRaw.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, buddyMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        sender: "buddy",
        text: "Sorry, I'm having trouble connecting to my server right now. 😔",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveToHistory = async () => {
    if (!activeConversationId || messages.length === 0) return;
    
    const previewMsg = messages.filter(m => m.sender === "child")[0]?.text || "Chat with Buddy";
    
    try {
      await api.post("/api/history", {
        user_id: user.id,
        type: "conversation",
        title: "Saved Chat with Buddy",
        preview: previewMsg.substring(0, 100) + (previewMsg.length > 100 ? "..." : ""),
        status: "safe",
        messages: messages.length,
        caseId: activeConversationId
      });
      alert("Conversation securely saved to your server History page.");
    } catch (e) {
      console.error(e);
      alert("Error saving to history.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-layout">
      {/* Main Chat Area */}
      <div className="chat-page">
        {/* Chat Header */}
        <div className="chat-header glass">
          <div className="chat-header-avatar">🛡️</div>
          <div>
            <div className="chat-header-name">Buddy</div>
            <div className="chat-header-status">
              <span className="online-dot" />
              Always here for you
            </div>
          </div>
          <div className="chat-header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a 
              href="https://www.google.com/maps/search/nearby+therapists" 
              target="_blank" 
              rel="noopener noreferrer"
              className="therapist-btn"
            >
              🗺️ Find Therapist
            </a>
            {messages.length > 0 && activeConversationId && (
              <button 
                onClick={saveToHistory}
                className="save-history-btn"
              >
                Save to History
              </button>
            )}
            <span className="badge badge-safe" style={{ fontSize: "11px" }}>
              🔒 Private Mode
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && (
             <div className="blank-slate">
                <div className="blank-icon">👋</div>
                <h2>Hi {user?.email?.split('@')[0]}!</h2>
                <p>Your chat is completely blank. Say hi to start a new conversation!</p>
             </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === "child" ? "message-user" : "message-buddy"} animate-fade-in`}
              style={{ animationDelay: `${Math.min(i * 0.03, 0.3)}s` }}
            >
              {msg.sender === "buddy" && (
                <div className="message-avatar">🛡️</div>
              )}
              <div className={`message-bubble ${msg.sender === "child" ? "bubble-user" : "bubble-buddy"}`}>
                <p className="message-text">{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message message-buddy animate-fade-in">
              <div className="message-avatar">🛡️</div>
              <div className="bubble-buddy typing-bubble">
                <span className="typing-dot" style={{ animationDelay: "0s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.15s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-bar glass">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Sidebar: Chat History */}
      <div className="history-sidebar glass">
        <div className="history-header">
          <h3>Previous Chats</h3>
          <button className="new-chat-btn" onClick={startNewChat}>+ New</button>
        </div>
        <div className="history-list">
          {conversations.length === 0 ? (
            <p className="no-history">No previous chats yet.</p>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.id} 
                className={`history-item ${activeConversationId === conv.id ? 'active' : ''}`}
                onClick={() => loadConversation(conv.id)}
              >
                <div className="history-icon">💬</div>
                <div className="history-info">
                  <div className="history-date">
                    {new Date(conv.created_at).toLocaleDateString()}
                  </div>
                  <div className="history-status">{conv.status}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .chat-layout {
          display: flex;
          height: calc(100vh - 64px);
          margin: -32px;
        }

        .chat-page {
          display: flex;
          flex-direction: column;
          flex: 1;
          position: relative;
        }

        /* ===== Right Sidebar History ===== */
        .history-sidebar {
          width: 300px;
          border-left: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(24px);
        }

        .history-header {
          padding: 20px;
          border-bottom: 1px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .history-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1A1A2E;
        }

        .therapist-btn {
          background: white;
          color: #1A1A2E;
          border: 1px solid var(--border-default);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: 0.2s ease;
        }
        .therapist-btn:hover {
          background: #F8FAFC;
          border-color: #94A3B8;
          transform: translateY(-1px);
        }

        .save-history-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .save-history-btn:hover {
          background: #006659;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 129, 112, 0.2);
        }

        .new-chat-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }
        .new-chat-btn:hover {
          background: #006659;
        }

        .history-list {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .no-history {
          font-size: 13px;
          color: var(--text-muted);
          text-align: center;
          margin-top: 40px;
        }

        .history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .history-item:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .history-item.active {
          background: white;
          border-color: var(--accent);
          box-shadow: 0 4px 16px rgba(0, 129, 112, 0.15);
        }

        .history-icon {
          font-size: 18px;
        }

        .history-info {
          display: flex;
          flex-direction: column;
        }

        .history-date {
          font-size: 14px;
          font-weight: 600;
          color: #1A1A2E;
        }

        .history-status {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: capitalize;
        }

        /* ===== Main Chat Area ===== */
        .blank-slate {
          margin: auto;
          text-align: center;
          color: var(--text-muted);
          animation: fade-in 0.5s ease;
        }
        .blank-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .blank-slate h2 {
          color: #1A1A2E;
          margin-bottom: 8px;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-default);
          flex-shrink: 0;
        }

        .chat-header-avatar {
          font-size: 28px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-card);
          border-radius: var(--radius-full);
        }

        .chat-header-name {
          font-size: 16px;
          font-weight: 600;
        }

        .chat-header-status {
          font-size: 12px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .online-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--status-safe);
        }

        .chat-header-actions {
          margin-left: auto;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 75%;
        }

        .message-user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .message-buddy {
          align-self: flex-start;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: var(--radius-lg);
          position: relative;
        }

        .bubble-user {
          background: var(--accent);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bubble-buddy {
          background: var(--bg-card);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }

        .message-text {
          font-size: 15px;
          line-height: 1.45;
          margin: 0;
        }

        .message-time {
          display: block;
          font-size: 11px;
          opacity: 0.6;
          margin-top: 6px;
          text-align: right;
        }

        .typing-bubble {
          display: flex;
          gap: 5px;
          padding: 14px 20px;
        }

        .typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: typing 1.2s ease-in-out infinite;
        }

        .chat-input-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--border-default);
          flex-shrink: 0;
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-full);
          color: var(--text-primary);
          font-size: 15px;
          font-family: inherit;
          outline: none;
          transition: border-color var(--transition-fast);
        }

        .chat-input:focus {
          border-color: var(--accent);
        }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: var(--accent);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .send-btn:hover { background: var(--accent-dark); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .send-btn:active { transform: scale(0.95); }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .chat-layout { flex-direction: column; margin: -16px; height: calc(100vh - 56px - 32px); }
          .history-sidebar { width: 100%; border-left: none; border-top: 1px solid var(--border-default); height: 200px; flex-shrink: 0; }
          .message { max-width: 88%; }
          .chat-messages { padding: 16px; }
          .chat-input-bar { padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
}
