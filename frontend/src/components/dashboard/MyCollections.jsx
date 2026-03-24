import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, TrendingUp, TrendingDown, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, Layers, ShieldCheck, Zap, Sparkles, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyCollections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  const analyzePortfolio = (items) => {
    if (items.length === 0) return { type: 'Defensive', confidence: 'N/A', rationale: 'No stocks in portfolio.' };
    
    // Heuristic: Higher PE ratios and certain sectors make it Aggressive
    const peValues = items.map(item => parseFloat(item.stock.pe_ratio) || 0).filter(pe => pe > 0);
    const avgPE = peValues.length > 0 ? peValues.reduce((a, b) => a + b, 0) / peValues.length : 0;
    
    const aggressiveSectors = ['Technology', 'Financial Services', 'Communication Services', 'Consumer Cyclical'];
    const portfolioSectors = [...new Set(items.map(item => item.stock.sector))];
    const hasAggressiveSector = items.some(item => aggressiveSectors.includes(item.stock.sector));
    
    const type = (avgPE > 25 || hasAggressiveSector) ? 'Aggressive' : 'Defensive';
    const confidence = avgPE > 0 ? (avgPE > 35 ? 'High' : 'Medium') : 'Medium';
    
    const rationale = `Concentrated in ${portfolioSectors.join(', ')}. ${type === 'Aggressive' ? 'Higher PE or volatile sectors indicate an aggressive growth stance.' : 'Stable sectors or lower valuation suggests a defensive, value-focused strategy.'}`;

    return { type, confidence, rationale };
  };

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:8000/api/stocks/collections/?user_id=${userData.id}`);
      setCollections(response.data);
      // Initialize quantities for each stock
      const initialQuantities = {};
      response.data.forEach(item => {
        initialQuantities[item.stock.id] = 1;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleQuantityChange = (stockId, value) => {
    const val = parseInt(value) || 1;
    setQuantities({
      ...quantities,
      [stockId]: val > 0 ? val : 1
    });
  };

  const handleBuy = async (stockId) => {
    const quantity = quantities[stockId];
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:8000/api/stocks/purchases/', {
        user_id: userData.id,
        stock_id: stockId,
        quantity: quantity
      });
      alert('Purchase successful!');
    } catch (error) {
      console.error('Error buying stock:', error);
      alert('Failed to complete purchase.');
    }
  };

  const handleBuyPortfolio = async (groupName, items) => {
    if (!window.confirm(`Are you sure you want to buy the entire "${groupName}" portfolio?`)) return;
    
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.id) {
        alert('User session not found. Please log in again.');
        return;
      }

      const results = await Promise.allSettled(items.map(item => 
        axios.post('http://localhost:8000/api/stocks/purchases/', {
          user_id: userData.id,
          stock_id: item.stock.id,
          quantity: quantities[item.stock.id] || 1,
          portfolio_name: groupName
        })
      ));
      
      const failed = results.filter(r => r.status === 'rejected');
      
      if (failed.length === 0) {
        alert(`Successfully purchased all stocks in "${groupName}"!`);
      } else {
        console.error('Some purchases failed:', failed);
        alert(`Bulk purchase partially completed. ${failed.length} stocks failed to purchase. Check console for details.`);
      }
    } catch (error) {
      console.error('Error buying portfolio:', error);
      alert('Failed to initiate bulk purchase. Please check your connection.');
    }
  };

  const handleRemove = async (stockId) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`http://localhost:8000/api/stocks/collections/delete/?user_id=${userData.id}&stock_id=${stockId}`);
      setCollections(collections.filter(item => item.stock.id !== stockId));
    } catch (error) {
      console.error('Error removing from collection:', error);
      alert('Failed to remove stock from collection.');
    }
  };

  const getRowColor = (index) => {
    const colors = [
      'border-l-blue-500',
      'border-l-purple-500',
      'border-l-orange-500',
      'border-l-pink-500',
      'border-l-indigo-500',
      'border-l-green-500',
    ];
    return colors[index % colors.length];
  };

  const groupCollections = () => {
    const groups = {};
    const idToNameMap = {}; // To handle cases where multiple items have same ID but we want a readable name

    collections.forEach(item => {
      let groupKey = item.portfolio_name || 'Single Stocks';
      
      // If we have a portfolio_id, use it for grouping to be precise
      if (item.portfolio_id) {
        groupKey = `portfolio-${item.portfolio_id}`;
        idToNameMap[groupKey] = item.portfolio_name;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    // Convert back to a displayable object
    const displayGroups = {};
    Object.entries(groups).forEach(([key, items]) => {
      const displayName = idToNameMap[key] || key;
      displayGroups[displayName] = items;
    });

    return displayGroups;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin text-green-600">
          <Layers size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto text-white">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold">My Collections</h1>
          <p className="text-gray-400 mt-2 font-medium">Your personally curated watchlist of stocks.</p>
        </div>
        <div className="glass-panel px-8 py-4 border border-white/5 flex items-center space-x-4 bg-white/5">
          <div className="bg-secondary-dark p-3 rounded-2xl text-light-accent border border-white/10">
            <Bookmark size={24} />
          </div>
          <div>
            <span className="text-gray-400 text-xs font-black uppercase tracking-widest">Saved Assets</span>
            <div className="text-2xl font-black text-white">{collections.length}</div>
          </div>
        </div>
      </header>

      {collections.length > 0 ? (
        <div className="space-y-12">
          {/* Portfolios Section - Card View */}
          {Object.entries(groupCollections()).filter(([name]) => name !== 'Single Stocks').length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-2 h-8 rounded-full bg-green-500"></div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Portfolios</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(groupCollections()).filter(([name]) => name !== 'Single Stocks').map(([groupName, items]) => {
                const analysis = analyzePortfolio(items);
                return (
                  <div key={groupName} className="glass-panel p-8 group hover:bg-white/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <span className={`px-3 py-1 border text-[10px] font-black rounded-lg uppercase tracking-widest block w-fit mb-2 ${
                          analysis.type === 'Aggressive' 
                            ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                            : 'bg-green-500/20 border-green-500/30 text-green-400'
                        }`}>
                          {analysis.type}
                        </span>
                        <h3 className="text-2xl font-black text-white group-hover:text-light-accent transition-colors truncate max-w-[200px]">
                          {groupName}
                        </h3>
                        <p className="text-gray-400 font-bold text-xs mt-1 uppercase tracking-tighter">
                          {items.length} {items.length === 1 ? 'stock' : 'stocks'}
                        </p>
                      </div>
                      <div className="bg-secondary-dark/50 p-3 rounded-2xl text-light-accent border border-white/10 group-hover:scale-110 transition-transform">
                        <Briefcase size={24} />
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-6 flex-grow">
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-2">Analysis Rationale</span>
                      <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        {analysis.rationale}
                      </p>
                      
                      {/* Small stock summary */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex flex-wrap gap-2">
                          {items.slice(0, 3).map(item => (
                            <span key={item.stock.id} className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-gray-400">
                              {item.stock.symbol.split('.')[0]}
                            </span>
                          ))}
                          {items.length > 3 && <span className="text-[10px] text-gray-500">+{items.length - 3} more</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck size={14} className="text-light-accent" />
                        <span className="text-[10px] font-black text-gray-400 uppercase">Analysis Confidence</span>
                      </div>
                      <span className="text-xs font-black text-white px-2 py-0.5 bg-white/10 rounded-md uppercase">
                        {analysis.confidence}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => handleBuyPortfolio(groupName, items)}
                        className="w-full glass-button bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-green-400 flex items-center justify-center transition-all active:scale-95"
                      >
                        <RefreshCw size={14} className="mr-2" />
                        Buy Whole Portfolio
                      </button>
                      <button 
                        onClick={() => {
                          if (items.length > 0) {
                            navigate('/customer-welcome/forecast', { state: { symbol: items[0].stock.symbol } });
                          }
                        }}
                        className="w-full glass-button bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center justify-center transition-all active:scale-95"
                      >
                        <Zap size={14} className="mr-2" />
                        Analyze Deeply
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

          {/* Single Stocks Section - Original Table View */}
          {groupCollections()['Single Stocks'] && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-2 h-8 rounded-full bg-gray-500"></div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  Single Stocks
                  <span className="ml-3 text-sm font-bold text-gray-400 bg-white/5 border border-white/5 px-3 py-1 rounded-full lowercase">
                    {groupCollections()['Single Stocks'].length} {groupCollections()['Single Stocks'].length === 1 ? 'stock' : 'stocks'}
                  </span>
                </h2>
              </div>
              
              <div className="glass-panel border border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/3 border-b border-white/5">
                        <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Stock</th>
                        <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Price</th>
                        <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">PE Ratio</th>
                        <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest">Sector</th>
                        <th className="p-6 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/2">
                      {groupCollections()['Single Stocks'].map((item, index) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors group border-l-4 border-l-transparent">
                          <td className="p-6">
                            <div className="flex flex-col">
                              <span className="text-lg font-black text-white group-hover:text-light-accent transition-colors">
                                {item.stock.symbol.split('.')[0]}
                              </span>
                              <span className="text-xs font-bold text-gray-400 uppercase mt-1">
                                {item.stock.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="text-lg font-black text-white">
                              {item.stock.currency === 'USD' ? '$' : '₹'}{parseFloat(item.stock.current_price).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className="text-sm font-black text-white bg-white/10 px-3 py-1 rounded-lg border border-white/5">
                              {item.stock.pe_ratio ? parseFloat(item.stock.pe_ratio).toFixed(2) : 'N/A'}
                            </span>
                          </td>
                          <td className="p-6">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              {item.stock.sector}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-4">
                              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 shadow-sm">
                                <input 
                                  type="number" 
                                  min="1"
                                  value={quantities[item.stock.id] || 1}
                                  onChange={(e) => handleQuantityChange(item.stock.id, e.target.value)}
                                  className="w-16 bg-transparent text-center text-sm font-black focus:outline-none text-white"
                                />
                                <button 
                                  onClick={() => handleBuy(item.stock.id)}
                                  className="glass-button bg-green-500/10 border border-green-500/20 text-green-400 font-black px-4 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-green-500/20 transition-all shadow-md active:scale-95"
                                >
                                  Buy
                                </button>
                              </div>
                              <button 
                                onClick={() => handleRemove(item.stock.id)}
                                className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-xl"
                                title="Remove from Collection"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-20 border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
          <div className="bg-white/5 p-8 rounded-full border border-white/5 text-gray-500 animate-pulse">
            <Bookmark size={64} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Your collection is empty</h3>
            <p className="text-gray-400 max-w-xs mt-2 font-medium">Head to the Stocks page and click 'Add' on any stock to build your watchlist.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCollections;
