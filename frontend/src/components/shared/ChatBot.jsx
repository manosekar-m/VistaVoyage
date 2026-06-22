import React, { useState } from 'react';
import '../../styles/ChatBot.css';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chatbot">
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>VistaVoyage Assistant</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-body">
            <p>Welcome! How can I help you today?</p>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
