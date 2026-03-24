import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Search, Plus, X } from 'lucide-react';

const DashboardHome = () => {
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [stats, setStats] = useState({ totalNetWorth: 0, activePortfolios: 0 });

  const fetchStats = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) return;
      
      const response = await axios.get(`http://localhost:8000/api/stocks/portfolios/?user_id=${userData.id}`);
      const portfolios = response.data;
      
      let totalWorth = 0;
      portfolios.forEach(portfolio => {
        portfolio.items.forEach(item => {
          totalWorth += parseFloat(item.stock.current_price || 0) * item.quantity;
        });
      });
      
      setStats({
        totalNetWorth: totalWorth,
        activePortfolios: portfolios.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!portfolioName.trim()) {
      alert('Please enter a portfolio name.');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const payload = {
        name: portfolioName,
        description: portfolioDescription,
        user_id: userData.id
      };
      
      await axios.post('http://localhost:8000/api/stocks/portfolios/', payload);
      alert(`Portfolio "${portfolioName}" created successfully!`);
      
      // Reset form
      setPortfolioName('');
      setPortfolioDescription('');
      fetchStats(); // Update dashboard stats immediately
    } catch (error) {
      console.error('Error creating portfolio:', error);
      alert('Failed to create portfolio. Please try again.');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      <header className="mb-10 border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
        
        <div className="flex flex-wrap gap-4">
          <div className="glass-panel px-6 py-4 flex flex-col min-w-[160px]">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Net worth</span>
            <span className="text-2xl font-black text-white mt-1">
              ₹{stats.totalNetWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="glass-panel px-6 py-4 flex flex-col min-w-[160px]">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Active Portfolios</span>
            <span className="text-2xl font-black text-white mt-1">{stats.activePortfolios}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Briefcase className="text-light-accent mr-2" size={24} />
              Create Portfolio
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Portfolio Name</label>
                <input 
                  type="text" 
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="e.g. Retirement Fund" 
                  className="glass-input w-full px-4 py-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Portfolio Description</label>
                <textarea 
                  value={portfolioDescription}
                  onChange={(e) => setPortfolioDescription(e.target.value)}
                  placeholder="e.g. Long-term growth stocks and high-dividend yields." 
                  className="glass-input w-full px-4 py-3 min-h-[120px] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full glass-button py-4 font-extrabold uppercase tracking-wider hover:glass-button-active active:scale-95 mt-4"
              >
                Create Portfolio
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-panel p-10 min-h-[400px] flex flex-col items-center justify-center text-center">
            <div className="bg-secondary-dark/50 p-6 rounded-full mb-4 border border-white/5">
              <Briefcase size={48} className="text-light-accent/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to your Dashboard</h3>
            <p className="text-gray-400 max-w-md">
              Here you can see an overview of all your financial activities. Start by creating a portfolio on the left!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
