import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, TrendingUp, Calendar, Layers, DollarSign, IndianRupee } from 'lucide-react';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:8000/api/stocks/purchases/?user_id=${userData.id}`);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const groupPurchases = () => {
    const groups = {};
    purchases.forEach(purchase => {
      // Group by portfolio_name and date (to keep bulk purchases together)
      const dateKey = new Date(purchase.purchased_at).toDateString();
      const groupKey = purchase.portfolio_name ? `portfolio-${purchase.portfolio_name}-${dateKey}` : 'individual';
      
      if (!groups[groupKey]) {
        groups[groupKey] = {
          name: purchase.portfolio_name || 'Individual Purchases',
          date: dateKey,
          items: [],
          total: 0,
          isPortfolio: !!purchase.portfolio_name
        };
      }
      groups[groupKey].items.push(purchase);
      groups[groupKey].total += parseFloat(purchase.total_amount);
    });
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin text-blue-600">
          <Layers size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto text-white">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold">My Purchases</h1>
          <p className="text-gray-400 mt-2 font-medium">Track your investment history and stock acquisitions.</p>
        </div>
        <div className="glass-panel px-8 py-4 border border-white/5 flex items-center space-x-4 bg-white/5">
          <div className="bg-secondary-dark p-3 rounded-2xl text-light-accent border border-white/10">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Total Orders</span>
            <div className="text-2xl font-black text-white">{purchases.length}</div>
          </div>
        </div>
      </header>

      {purchases.length > 0 ? (
        <div className="space-y-12">
          {groupPurchases().map((group, groupIdx) => (
            <div key={groupIdx} className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-8 rounded-full ${group.isPortfolio ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {group.isPortfolio ? `Portfolio: ${group.name}` : 'Direct Purchases'}
                    <span className="ml-3 text-sm font-bold text-gray-400 bg-white/5 border border-white/5 px-3 py-1 rounded-full lowercase">
                      {group.items.length} {group.items.length === 1 ? 'asset' : 'assets'}
                    </span>
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="text-right">
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Total Group Value</span>
                     <span className="text-lg font-black text-white">
                       {group.items[0]?.stock.currency === 'USD' ? '$' : '₹'}{group.total.toLocaleString()}
                     </span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.items.map((purchase) => (
                  <div key={purchase.id} className="glass-panel border border-white/5 overflow-hidden group hover:bg-white/10 transition-all duration-300 bg-white/3">
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col">
                          <span className="px-3 py-1 bg-white/10 border border-white/5 text-light-accent text-[10px] font-black rounded-lg uppercase tracking-widest w-fit mb-2">
                            {purchase.stock.symbol}
                          </span>
                          <h3 className="text-xl font-black text-white group-hover:text-light-accent transition-colors truncate max-w-[200px]">
                            {purchase.stock.name}
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1">Quantity</span>
                          <span className="text-base font-black text-white">{purchase.quantity} Shares</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Paid</span>
                          <span className="text-base font-black text-white">
                            {purchase.stock.currency === 'USD' ? '$' : '₹'}{parseFloat(purchase.total_amount).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          <span>{new Date(purchase.purchased_at).toLocaleDateString()}</span>
                        </div>
                        <span className="text-light-accent">Price: {purchase.stock.currency === 'USD' ? '$' : '₹'}{parseFloat(purchase.purchase_price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-20 border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-white/5 p-8 rounded-full border border-white/5 text-gray-500 animate-pulse">
            <ShoppingBag size={64} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">No Purchases Yet</h3>
            <p className="text-gray-400 max-w-xs mt-2 font-medium">Head to your Collections to start investing in stocks.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
