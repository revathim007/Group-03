import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sync user from localStorage whenever the route changes (common after login/logout)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    
    // Only update if the user state has actually changed to avoid unnecessary re-renders
    if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
      setUser(parsedUser);
      const isUserAdmin = parsedUser?.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      // Refresh the chat history when user changes
      if (parsedUser) {
        const greeting = isUserAdmin 
          ? `Hello Admin ${parsedUser.full_name || parsedUser.username}! System status is optimal. How can I assist with your management tasks today?`
          : `Hello ${parsedUser.full_name || parsedUser.username}! What should we do today?`;
        
        setMessages([
          { text: greeting, sender: 'bot' }
        ]);
      } else {
        setMessages([
          { text: "Hello! I'm STOXIE. Please log in to ask me about stock prices or analyze your portfolio!", sender: 'bot' }
        ]);
      }
    }
  }, [location, user]); // Depend on location to re-check on navigation

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    const newMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputValue('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/stocks/chatbot/', {
        message: userMessage,
        user_id: user?.id || null
      });

      setMessages(prev => [...prev, { 
        text: response.data.response, 
        sender: 'bot',
        showRegister: response.data.show_register,
        showPortfolioLink: response.data.show_portfolio_link,
        showCreatePortfolio: response.data.show_create_portfolio,
        showCollectionsLink: response.data.show_collections_link,
        showStocksLink: response.data.show_stocks_link,
        showPurchasesLink: response.data.show_purchases_link,
        isAdmin: response.data.is_admin
      }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my brain right now. Please try again later!", 
        sender: 'bot' 
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className={`glass-panel w-80 mb-4 overflow-hidden border border-white/10 shadow-2xl ${isAdmin ? 'bg-[#1A2F31]/95' : 'bg-secondary-dark/95'} backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4`}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${isAdmin ? 'from-[#2D5A5E] to-[#1A2F31]' : 'from-medium-tone to-secondary-dark'} text-white p-4 flex justify-between items-center border-b border-white/5`}>
            <div className="flex items-center">
              <Bot size={24} className={`mr-2 ${isAdmin ? 'text-[#D9E08B]' : 'text-light-accent'}`} />
              <span className="font-black tracking-wider text-sm">STOXIE {isAdmin && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-1">ADMIN</span>}</span>
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
                className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed flex flex-col whitespace-pre-line ${
                  msg.sender === 'user' 
                    ? `${isAdmin ? 'bg-[#D9E08B]/20 border border-[#D9E08B]/30' : 'bg-light-accent/20 border border-light-accent/30'} text-white self-end rounded-br-none shadow-sm` 
                    : `bg-white/5 border border-white/5 text-gray-200 self-start rounded-bl-none shadow-sm`
                }`}
              >
                {msg.text}
                {msg.showRegister && (
                  <button
                    onClick={() => navigate('/register')}
                    className="mt-3 bg-light-accent hover:bg-white hover:text-secondary-dark text-white font-black py-2 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-light-accent/20"
                  >
                    Register Now
                  </button>
                 )}
                 {msg.showPortfolioLink && (
                   <button
                     onClick={() => navigate('/customer-welcome/portfolio')}
                     className="mt-3 bg-medium-tone hover:bg-white hover:text-secondary-dark text-white font-black py-2 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-medium-tone/20"
                   >
                     Go to Portfolio
                   </button>
                 )}
                 {msg.showCreatePortfolio && (
                    <button
                      onClick={() => navigate('/customer-welcome', { state: { highlightCreatePortfolio: true } })}
                      className="mt-3 bg-cyan-500 hover:bg-white hover:text-secondary-dark text-white font-black py-2 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-cyan-500/20"
                    >
                      Create Portfolio
                    </button>
                  )}
                  {msg.showCollectionsLink && (
                    <button
                      onClick={() => navigate('/customer-welcome/collections')}
                      className="mt-3 bg-indigo-500 hover:bg-white hover:text-secondary-dark text-white font-black py-2 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-500/20"
                    >
                      My Collections
                    </button>
                  )}
                  {msg.showStocksLink && (
                    <button
                      onClick={() => navigate('/customer-welcome/stock')}
                      className="mt-3 bg-emerald-500 hover:bg-white hover:text-secondary-dark text-white font-black py-2 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
                    >
                      Explore Stocks
                    </button>
                  )}
                  {msg.showPurchasesLink && (
                    <button
                      onClick={() => navigate('/customer-welcome/purchases')}
                      className="mt-3 bg-fuchsia-500 hover:bg-white hover:text-secondary-dark text-white font-black py-2 px-4 rounded-xl transition-all duration-300 uppercase tracking-widest text-[10px] shadow-lg shadow-fuchsia-500/20"
                    >
                      My Purchases
                    </button>
                  )}
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
