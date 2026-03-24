import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminWelcome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser || savedUser.role !== 'admin') {
      navigate('/login');
    } else {
      setUser(savedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-primary-dark flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Glow Orbs (Mesh Gradient) */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-500/25 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-fuchsia-500/25 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-[30%] left-[20%] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[90px] animate-pulse delay-500"></div>

        {/* Futuristic Dot Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.20]" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.4) 1px, transparent 1.5px)',
            backgroundSize: '24px 24px'
          }}
        ></div>
        
        {/* Subtle Decorative Grid Lines */}
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      <h1 className="text-5xl font-black mb-8 animate-pulse tracking-tight z-10">Welcome Admin!</h1>
      {user && (
        <div className="glass-panel p-8 w-96 text-center z-10">
          <p className="text-xl mb-3 font-bold">Logged in as: <span className="text-light-accent">{user.full_name}</span></p>
          <p className="mb-2 text-gray-300">Admin ID: <span className="font-mono font-bold text-white">{user.custom_id}</span></p>
          <p className="mb-8 text-gray-300">Username: <span className="text-white">{user.username}</span></p>
          <button
            onClick={handleLogout}
            className="w-full glass-button py-3 font-extrabold uppercase tracking-wider bg-red-900/40 border-red-500/30 hover:bg-red-600 hover:border-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminWelcome;
