import React from 'react';
import { History } from 'lucide-react';

const OrderHistory = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Order History</h1>
      </header>
      <div className="glass-panel p-20 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
        <div className="bg-orange-500/10 p-6 rounded-full text-orange-400 border border-orange-500/20 animate-pulse">
          <History size={48} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-2">No Order History</h2>
          <p className="text-sm font-medium text-gray-400 max-w-md leading-relaxed">
            A complete history of all your market orders and financial transactions will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
