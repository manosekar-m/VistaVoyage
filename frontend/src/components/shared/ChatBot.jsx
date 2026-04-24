import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import './ChatBot.css';

export default function ChatBot() {
  const [open,    setOpen]    = useState(false);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm VistaBot 🌍 Your personal travel assistant. Ask me anything about our destinations, prices, or how to book your next adventure!" }
  ]);
  const endRef = useRef(null);

  const clearChat = () => {
    setMessages([
      { role: 'assistant', text: "Hi! I'm VistaBot 🌍 Your personal travel assistant. Ask me anything about our destinations, prices, or how to book your next adventure!" }
    ]);
  };

  useEffect(() => { 
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.text }));
      const { data } = await api.post('/ai/chat', { message: userMsg, history });
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Oops! I lost connection. Please try again in a moment.' }]);
    } finally { setLoading(false); }
  };

  const suggestions = ['Trips under ₹5000', 'Best 3-day packages', 'Kerala specialized tours', 'Honeymoon destinations'];

  return (
    <div className="chatbot-container">
      {/* Toggle button */}
      <button 
        className={`chatbot-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Chat with AI assistant"
      >
        {open ? <X size={26}/> : <MessageCircle size={26}/>}
        {!open && <span className="chatbot-fab-badge" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-icon">
              <Bot size={24} color="var(--accent)"/>
            </div>
            <div className="chatbot-header-info">
              <h3>VistaBot</h3>
              <div className="chatbot-status">Online AI Assistant</div>
            </div>
            <button 
              onClick={clearChat}
              title="Clear Chat"
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Trash2 size={18}/>
            </button>
            <button 
              onClick={() => setOpen(false)} 
              title="Close"
              style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={20}/>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg-row ${m.role}`}>
                <div className="chatbot-msg-avatar">
                  {m.role === 'assistant' ? <Bot size={16} color="white"/> : <User size={16} color="var(--primary)"/>}
                </div>
                <div className="chatbot-bubble">
                  {m.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="chatbot-msg-row assistant">
                <div className="chatbot-msg-avatar">
                  <Bot size={16} color="white"/>
                </div>
                <div className="chatbot-bubble" style={{ padding: '8px 12px' }}>
                  <div className="typing-dots">
                    <span style={{ animationDelay: '0s' }}/>
                    <span style={{ animationDelay: '0.15s' }}/>
                    <span style={{ animationDelay: '0.3s' }}/>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && !loading && (
            <div className="chatbot-suggestions">
              {suggestions.map(s => (
                <button 
                  key={s} 
                  className="suggestion-chip"
                  onClick={() => { setInput(s); }}
                >
                  <Sparkles size={12} style={{ marginRight: 4 }}/>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="chatbot-input-container">
            <input 
              className="chatbot-input"
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="How can I help you today?"
            />
            <button 
              className="chatbot-send-btn"
              onClick={send} 
              disabled={!input.trim() || loading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
