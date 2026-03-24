import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-dark flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background decoration */}
      {/* Background image covering full screen */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/bull_hero_8k.png"
          alt="Futuristic Bull Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content Floated to Bottom Left Corner */}
      <div className="z-10 absolute bottom-16 left-12 text-left max-w-sm px-4">
        <div className="flex items-center mb-5 drop-shadow-xl">
          <TrendingUp size={40} className="text-light-accent mr-3" />
          <h1 className="text-4xl font-extrabold tracking-tighter text-white">
            Stock<span className="text-light-accent">Verse</span>
          </h1>
        </div>
        <p className="text-sm text-gray-200 font-medium drop-shadow-md leading-relaxed">
          Navigate the financial universe with precision. Real-time insights, advanced tracking, and professional tools for everyone.
        </p>

        {/* Actions Button */}
        <button
          onClick={() => navigate('/register')}
          className="mt-6 glass-button py-2.5 px-8 text-base font-extrabold tracking-wide uppercase hover:glass-button-active shadow-2xl w-full sm:w-auto"
        >
          Get Started
        </button>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-gray-500 text-sm">
        © 2026 StockVerse. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
