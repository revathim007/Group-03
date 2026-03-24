import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, ShieldCheck, Zap, BrainCircuit, User, Target, CheckCircle2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Recommend = () => {
  const navigate = useNavigate();
  const [aiProfile, setAiProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAIProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) return;
      
      const response = await axios.get(`http://localhost:8000/api/stocks/recommendation-analysis/${userData.id}/`);
      setAiProfile(response.data);
    } catch (error) {
      console.error('Error fetching AI profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIProfile();
  }, []);

  const recommendations = [
    { 
      symbol: 'AAPL', 
      name: 'Apple Inc.', 
      reason: 'Strong quarterly earnings and new product announcements.', 
      confidence: 'High', 
      type: 'Growth' 
    },
    { 
      symbol: 'MSFT', 
      name: 'Microsoft Corporation', 
      reason: 'Expansion in AI and cloud infrastructure.', 
      confidence: 'Very High', 
      type: 'Stability' 
    },
    { 
      symbol: 'TSLA', 
      name: 'Tesla, Inc.', 
      reason: 'Increased production capacity and market expansion.', 
      confidence: 'Medium', 
      type: 'High Risk' 
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      <header className="mb-10 border-b border-white/5 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">Personalized Strategy</h1>
        <p className="text-gray-400 mt-2 font-medium">
          {aiProfile ? aiProfile.personality_statement : "Analyzing your profile to provide custom investment suggestions..."}
        </p>
      </header>

      {/* AI Investor Profile Section */}
      {!loading && aiProfile && (
        <div className="glass-panel p-10 mb-12 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles size={120} className="text-cyan-400" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-cyan-500 p-3 rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                  <User size={28} className="text-primary-dark" />
                </div>
                <div>
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em]">Investor Persona</span>
                  <h2 className="text-3xl font-black text-white mt-1">{aiProfile.investor_type}</h2>
                </div>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed font-medium mb-8 italic">
                "{aiProfile.personality_statement}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiProfile.actionable_advice.map((advice, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                    <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-gray-300 font-bold leading-tight">{advice}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary-dark/50 p-8 rounded-[32px] border border-white/5 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full border-4 border-cyan-500/20 flex items-center justify-center relative mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin duration-[3s]"></div>
                <div className="text-4xl font-black text-white">{aiProfile.sentiment_score}%</div>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Portfolio Alignment</h4>
              <p className="text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                Based on sector weightage and risk appetite analysis
              </p>
              <button 
                onClick={() => fetchAIProfile()}
                className="mt-8 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] flex items-center hover:text-white transition-colors"
              >
                <RefreshCw size={12} className="mr-2" />
                Re-Sync Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-8">
        <Target size={24} className="text-cyan-400" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Market Opportunities</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((stock) => (
          <div key={stock.symbol} className="glass-panel p-8 group hover:bg-white/10 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-black rounded-lg uppercase tracking-widest block w-fit mb-2">
                  {stock.type}
                </span>
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-400 transition-colors">
                  {stock.symbol}
                </h3>
                <p className="text-gray-400 font-bold text-sm mt-1">{stock.name}</p>
              </div>
              <div className="bg-cyan-500/10 p-3 rounded-2xl text-cyan-400 border border-cyan-500/20">
                <Sparkles size={24} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-6">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-2">Analysis Rationale</span>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                {stock.reason}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck size={14} className="text-cyan-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase">Confidence</span>
              </div>
              <span className="text-xs font-black text-white px-2 py-0.5 bg-white/10 rounded-md">
                {stock.confidence}
              </span>
            </div>

            <button 
              onClick={() => navigate('/customer-welcome/forecast', { state: { symbol: stock.symbol } })}
              className="mt-8 w-full glass-button bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center justify-center group-hover:scale-[1.02] transition-all"
            >
              <Zap size={14} className="mr-2" />
              Analyze Deeply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;
