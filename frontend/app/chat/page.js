"use client";

import { useState, useRef, useEffect } from "react";

const BUDDY_RESPONSES = [
  "Hey! I'm here for you. What's on your mind today? 😊",
  "That sounds tough. Want to tell me more about what happened?",
  "I hear you. It's okay to feel that way. You're not alone in this. 💙",
  "Thank you for trusting me with that. Would you like me to suggest some ways to handle this?",
  "Remember — what you're feeling is valid. If things get too much, we can always reach out to someone you trust.",
  "I'm always here if you need to talk. No judgement, just a friend. 🛡️",
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "buddy",
      text: "Hey there! 👋 I'm Buddy, your friend and companion. You can talk to me about anything — school, friends, feelings, or if something's bothering you. Everything stays between us. How are you doing today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (replace with actual API call when backend is ready)
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        sender: "buddy",
        text: BUDDY_RESPONSES[Math.floor(Math.random() * BUDDY_RESPONSES.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
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
        <div className="chat-header-actions">
          <span className="badge badge-safe" style={{ fontSize: "11px" }}>
            🔒 Private Mode
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === "user" ? "message-user" : "message-buddy"} animate-fade-in`}
            style={{ animationDelay: `${i * 0.03}s` }}
          >
            {msg.sender === "buddy" && (
              <div className="message-avatar">🛡️</div>
            )}
            <div className={`message-bubble ${msg.sender === "user" ? "bubble-user" : "bubble-buddy"}`}>
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

      <style jsx>{`
        .chat-page {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 64px);
          margin: -32px;
          position: relative;
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

        .chat-input::placeholder {
          color: var(--text-muted);
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

        @media (max-width: 768px) {
          .chat-page { margin: -16px; height: calc(100vh - 56px - 32px); }
          .message { max-width: 88%; }
          .chat-messages { padding: 16px; }
          .chat-input-bar { padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
}
