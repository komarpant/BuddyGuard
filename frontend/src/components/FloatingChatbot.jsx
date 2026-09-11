import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

export default function FloatingChatbot({ onTriggerAlert }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Buddy Guard. How are you feeling today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const newMsg = { id: Date.now(), text, sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Connect to the actual Python FastAPI Backend
      const res = await axios.post('http://127.0.0.1:8000/api/chat', {
        message: text,
        is_anonymous: true
      });

      const result = res.data;

      // Simulate a natural typing delay for the UI
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now() + 1, text: result.reply, sender: "bot" }]);

        // If the backend generated an emergency/distress case, trigger the Alert Modal in App.jsx
        if (result.case_data) {
          onTriggerAlert(result.case_data);
        }
      }, 1000);

    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Sorry, I am having trouble connecting to the server.", sender: "bot" }]);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  const handleImageUpload = async () => {
    // Keep your original OCR mockup logic here for the image upload feature
    const newMsg = { id: Date.now(), text: "📸 Uploaded Screenshot", sender: "user" };
    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const mockReply = "I read the screenshot. This looks like a severe threat. I am alerting your guardian immediately.";
      setMessages(prev => [...prev, { id: Date.now() + 1, text: mockReply, sender: "bot" }]);

      // Trigger a mock case for the upload
      onTriggerAlert({
        id: `CASE-OCR-${Math.floor(Math.random() * 1000)}`,
        tier: "Critical Emergency",
        status: "AI Report",
        date: new Date().toISOString().split('T')[0]
      });
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-[350px] h-[500px] mb-4 rounded-3xl shadow-2xl border border-[#EFEAE2] flex flex-col overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold">Buddy Guard</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span> Online & Secure
                </p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700 p-1 rounded-lg transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                    ? 'bg-blue-600 text-white self-end rounded-tr-sm'
                    : 'bg-white text-slate-800 border border-slate-100 self-start rounded-tl-sm shadow-sm'
                  }`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white text-slate-400 border border-slate-100 self-start rounded-2xl rounded-tl-sm shadow-sm p-3 text-sm flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {!isTyping && (
              <div className="px-3 py-2 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide bg-white border-t border-[#EFEAE2]">
                <button onClick={() => handleQuickPrompt("I feel scared")} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-100">
                  I feel scared
                </button>
                <button onClick={() => handleQuickPrompt("Someone is threatening me")} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium hover:bg-red-100">
                  Threatening me
                </button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-[#EFEAE2] flex items-center gap-2">
              <button onClick={handleImageUpload} className="p-2 text-slate-400 hover:text-blue-600 transition" title="Upload Screenshot">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
                placeholder="Message Buddy Guard..."
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleSend(inputText)}
                disabled={!inputText.trim()}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition relative group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></span>
        )}
      </button>
    </div>
  );
}