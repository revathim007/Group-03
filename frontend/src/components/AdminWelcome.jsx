import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, LayoutGrid, BarChart3, Globe, LogOut, ShieldCheck, TrendingUp } from 'lucide-react';

const AdminWelcome = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total_customers: 0,
    total_stocks: 0,
    total_indian_stocks: 0,
    total_categories: 0
  });
  const navigate = useNavigate();

  // Admin Theme Palette
  const colors = {
    primary: '#2D5A5E', // Dark Teal/Green
    secondary: '#76B374', // Muted Green
    accent1: '#D9E08B', // Pale Lime
    accent2: '#F4FBB3', // Very Light Yellow
    bg: '#1A2F31' // Deep Forest/Admin Background
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'admin') {
      navigate('/login');
    } else {
      setUser(savedUser);
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/stocks/admin-stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="relative group overflow-hidden">
      <div className={`glass-panel p-6 border-l-4 ${colorClass} transition-all duration-300 group-hover:translate-y-[-4px] group-hover:shadow-2xl`}>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
            <Icon size={24} className="text-light-accent" />
          </div>
          <div className="flex items-center space-x-1 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
            <TrendingUp size={10} />
            <span>Active</span>
          </div>
        </div>
        <h3 className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
        <p className="text-3xl font-black text-white tabular-nums">{value}</p>
        
        {/* Subtle Decorative Element */}
        <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
          <Icon size={100} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F1C1D] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Admin Specific Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2D5A5E]/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#76B374]/5 rounded-full blur-[120px]"></div>
        
        {/* Admin Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Header / Sidebar Sim */}
      <nav className="z-20 w-full px-8 py-6 flex justify-between items-center border-b border-white/5 bg-[#1A2F31]/40 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <div className="bg-[#D9E08B] p-2 rounded-xl shadow-lg shadow-[#D9E08B]/20">
            <ShieldCheck size={24} className="text-[#1A2F31]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter uppercase leading-none">StockVerse <span className="text-[#D9E08B]">Admin</span></h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Management Portal v2.0</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs font-black text-white">{user?.full_name}</span>
            <span className="text-[10px] font-bold text-[#76B374] uppercase tracking-widest">Super Administrator</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl transition-all duration-300 font-black text-xs uppercase tracking-widest border border-red-500/20"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="z-10 flex-1 w-full max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter mb-2">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9E08B] to-[#76B374]">Overview</span></h1>
          <p className="text-gray-400 font-medium">Real-time statistics and analytics of your financial universe.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Customers" 
            value={stats.total_customers} 
            icon={Users} 
            colorClass="border-l-[#D9E08B]"
          />
          <StatCard 
            title="Portfolio Categories" 
            value={stats.total_categories} 
            icon={LayoutGrid} 
            colorClass="border-l-[#76B374]"
          />
          <StatCard 
            title="Global Stocks" 
            value={stats.total_stocks} 
            icon={BarChart3} 
            colorClass="border-l-[#2D5A5E]"
          />
          <StatCard 
            title="Indian Markets" 
            value={stats.total_indian_stocks} 
            icon={Globe} 
            colorClass="border-l-[#F4FBB3]"
          />
        </div>

        {/* Action Area (Placeholder) */}
        <div className="glass-panel p-8 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-white/5 mb-4">
            <BarChart3 size={32} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-300">Ready for Deep Analysis?</h3>
          <p className="text-sm text-gray-500 max-w-md mt-2 mb-6">Select a module above or use the side navigation to manage users, monitor transactions, or update stock datasets.</p>
          <button className="px-6 py-3 bg-[#2D5A5E] hover:bg-[#76B374] text-white font-black rounded-xl transition-all duration-300 uppercase tracking-widest text-xs">
            Generate Full Report
          </button>
        </div>
      </main>
    </div>
  );
};

export default AdminWelcome;
