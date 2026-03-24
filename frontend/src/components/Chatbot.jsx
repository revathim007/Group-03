import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm STOXIE, your personal stock assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { text: inputValue, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "That's a great question! I'm currently in training, but once you log in, I can help you track real-time stock prices and analyze your portfolio.", 
        sender: 'bot' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="glass-panel w-80 mb-4 overflow-hidden border border-white/10 shadow-2xl bg-secondary-dark/95 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-medium-tone to-secondary-dark text-white p-4 flex justify-between items-center border-b border-white/5">
            <div className="flex items-center">
              <Bot size={24} className="mr-2 text-light-accent" />
              <span className="font-black tracking-wider text-sm">STOXIE</span>
            </div>
            <button onClick={toggleChat} className="hover:bg-white/10 p-1.5 rounded-xl transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 flex flex-col space-y-3 bg-transparent custom-scrollbar">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-light-accent/20 border border-light-accent/30 text-white self-end rounded-br-none shadow-sm' 
                    : 'bg-white/5 border border-white/5 text-gray-200 self-start rounded-bl-none shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 flex items-center bg-white/3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 glass-input px-4 py-2 text-xs focus:ring-1 focus:ring-light-accent/50 bg-white/3 border-white/5"
            />
            <button type="submit" className="ml-2 text-light-accent hover:text-white transition-colors">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={toggleChat}
        className={`bg-medium-tone hover:bg-light-accent border border-white/10 text-white p-4 rounded-full shadow-lg shadow-medium-tone/20 transition-all transform ${isOpen ? 'rotate-90' : 'hover:scale-110'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
