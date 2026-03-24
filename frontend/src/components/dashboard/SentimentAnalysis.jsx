
import React, { useState, useEffect } from 'react';
import { BarChart3, Briefcase, Search } from 'lucide-react';
import axios from 'axios';

const SentimentAnalysis = () => {
  const [symbol, setSymbol] = useState('');
  const [sentimentData, setSentimentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stocks/');
        const result = await response.json();
        setStocks(result);
      } catch (err) {
        console.error('Failed to fetch stocks:', err);
      }
    };

    const fetchPortfolios = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
          const response = await axios.get(`http://localhost:8000/api/stocks/portfolios/?user_id=${userData.id}`);
          setPortfolios(response.data);
        }
      } catch (error) {
        console.error('Error fetching portfolios:', error);
      }
    };

    fetchStocks();
    fetchPortfolios();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSymbol(value);
    setSelectedStock(null);
    setSentimentData(null);
    setSelectedPortfolio(null);
    if (value) {
      const filtered = stocks.filter(stock =>
        stock.name.toLowerCase().includes(value.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handlePortfolioChange = (e) => {
    const portfolioId = e.target.value;
    const portfolio = portfolios.find(p => p.id.toString() === portfolioId);
    setSelectedPortfolio(portfolio);
    setSymbol('');
    setSelectedStock(null);
    setSentimentData(null);
    setSuggestions([]);
  };

  const handleSuggestionClick = (stock) => {
    setSymbol(stock.name);
    setSelectedStock(stock);
    setSuggestions([]);
    setSelectedPortfolio(null);
    handleSearch(stock.symbol);
  };

  const handleSearch = async (searchSymbol) => {
    if (!searchSymbol) return;
    setLoading(true);
    setError(null);
    setSentimentData(null);

    try {
      const response = await fetch(`http://localhost:8000/api/stocks/sentiment/${searchSymbol}/`);
      if (!response.ok) {
        throw new Error('Could not fetch sentiment data.');
      }
      const result = await response.json();
      setSentimentData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'Positive') return 'text-green-600';
    if (sentiment === 'Negative') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Sentiment Analysis</h1>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Left Column */}
        <div className="w-full md:w-1/2">
          <div className="glass-panel p-6 border border-white/5 h-full relative z-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <Search size={14} className="mr-2" /> Stock Search
            </h2>
            <div className="relative">
              <input
                type="text"
                value={symbol}
                onChange={handleInputChange}
                placeholder="Enter stock name or symbol..."
                className="glass-input px-4 py-3 w-full"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-secondary-dark border border-white/10 rounded-xl mt-2 shadow-2xl max-h-48 overflow-y-auto custom-scrollbar">
                  {suggestions.map(stock => (
                    <li
                      key={stock.id}
                      onClick={() => handleSuggestionClick(stock)}
                      className="px-4 py-3 cursor-pointer hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors"
                    >
                      <span className="font-bold text-white">{stock.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase ml-2">({stock.symbol})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-1/2">
          <div className="glass-panel p-6 border border-white/5 h-full">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
              <Briefcase size={14} className="mr-2" /> Select Portfolio
            </h2>
            <select
              value={selectedPortfolio ? selectedPortfolio.id : ''}
              onChange={handlePortfolioChange}
              className="glass-input px-4 py-3 w-full appearance-none cursor-pointer"
            >
              <option value="" disabled>Select a portfolio...</option>
              {portfolios.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Unified Display Area */}
      <div className="mb-8">
        {selectedPortfolio && (
          <div className="glass-panel p-6 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-4">{selectedPortfolio.name}</h3>
            <ul className="divide-y divide-white/5">
              {selectedPortfolio.items.map(item => (
                <li key={item.stock.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-semibold text-white">{item.stock.name} <span className="text-xs text-gray-400">({item.stock.symbol})</span></p>
                    <p className="text-xs text-gray-400 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-black text-white">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: item.stock.currency || 'INR' }).format(item.stock.current_price)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedStock && !selectedPortfolio && sentimentData && (
          <div className="glass-panel p-6 border border-white/5 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Stock</p>
              <h3 className="text-3xl font-black text-white mt-1">{selectedStock.name} <span className="text-lg opacity-60">({selectedStock.symbol})</span></h3>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sentiment</p>
              <p className={`text-4xl font-black mt-1 ${getSentimentColor(sentimentData.sentiment)}`}>
                {sentimentData.sentiment}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel p-8 border border-white/5 min-h-[400px] flex flex-col">
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-light-accent rounded-full animate-spin"></div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Analyzing Sentiment...</p>
          </div>
        )}
        {error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <p className="text-lg font-bold text-red-400 mb-2">Analysis Failed</p>
            <p className="text-sm text-gray-400 max-w-xs">{error}</p>
          </div>
        )}
        {sentimentData && sentimentData.articles && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/5 pb-4">Recent News & Articles</h3>
            <ul className="space-y-4">
              {sentimentData.articles.map((article, index) => (
                <li key={index} className="pb-4 border-b border-white/5 last:border-b-0">
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-light-accent hover:text-white transition-all duration-200 block">
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!sentimentData && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center h-full space-y-6">
            <div className="bg-orange-500/10 p-6 rounded-full text-orange-400 border border-orange-500/20 animate-pulse">
              <BarChart3 size={48} />
            </div>
            <div className="max-w-xs">
              <h2 className="text-2xl font-black text-white mb-2">Sentiment Analysis</h2>
              <p className="text-sm font-medium text-gray-400 leading-relaxed">
                Enter a stock name or symbol to see the latest news and aggregate market sentiment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalysis;
