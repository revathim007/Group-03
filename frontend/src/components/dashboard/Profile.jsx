import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Shield, Settings, CreditCard, Bell, Bookmark, ShoppingBag, History } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    setUser(savedUser);
  }, []);

  if (!user) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">User Profile</h1>
      </header>

      <div className="glass-panel overflow-hidden border border-white/5">
        {/* Profile Header Background */}
        <div className="h-40 bg-gradient-to-r from-secondary-dark via-medium-tone to-secondary-dark opacity-80"></div>
        
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="p-1 bg-white/10 backdrop-blur-md rounded-full shadow-2xl border border-white/10">
              <div className="bg-secondary-dark p-6 rounded-full text-light-accent border border-white/10">
                <UserIcon size={64} />
              </div>
            </div>
            <button 
              onClick={() => navigate('/customer-welcome/settings')}
              className="bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-all text-gray-300 hover:text-white border border-white/5 shadow-md flex items-center space-x-2"
            >
              <Settings size={20} />
              <span className="text-sm font-bold">Edit Profile</span>
            </button>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Info Section */}
              <div className="space-y-6">
                <div className="glass-panel p-5 bg-white/2 border border-white/5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Full Name</label>
                  <div className="flex items-center space-x-3 text-white">
                    <UserIcon size={20} className="text-light-accent" />
                    <span className="text-xl font-black">{user.full_name}</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-white/2 border border-white/5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <div className="flex items-center space-x-3 text-white">
                    <Mail size={20} className="text-light-accent" />
                    <span className="text-xl font-bold">{user.email}</span>
                  </div>
                </div>

                <div className="glass-panel p-5 bg-white/2 border border-white/5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Account ID</label>
                  <div className="flex items-center space-x-3 text-white">
                    <Shield size={20} className="text-light-accent" />
                    <span className="text-lg font-mono font-bold">{user.custom_id}</span>
                  </div>
                </div>
              </div>

              {/* My Activity Section */}
              <div className="space-y-4">
                <h3 className="font-black text-white text-lg mb-4 border-b border-white/5 pb-2">My Activity</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => navigate('/customer-welcome/collections')}
                    className="flex items-center space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group shadow-sm"
                  >
                    <div className="bg-secondary-dark p-2.5 rounded-xl shadow-sm text-light-accent group-hover:scale-110 transition-transform border border-white/10">
                      <Bookmark size={18} />
                    </div>
                    <span className="font-bold text-sm text-white">My Collections</span>
                  </button>
                  <button 
                    onClick={() => navigate('/customer-welcome/purchases')}
                    className="flex items-center space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group shadow-sm"
                  >
                    <div className="bg-secondary-dark p-2.5 rounded-xl shadow-sm text-light-accent group-hover:scale-110 transition-transform border border-white/10">
                      <ShoppingBag size={18} />
                    </div>
                    <span className="font-bold text-sm text-white">My Purchases</span>
                  </button>
                  <button 
                    onClick={() => navigate('/customer-welcome/orders')}
                    className="flex items-center space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group shadow-sm"
                  >
                    <div className="bg-secondary-dark p-2.5 rounded-xl shadow-sm text-light-accent group-hover:scale-110 transition-transform border border-white/10">
                      <History size={18} />
                    </div>
                    <span className="font-bold text-sm text-white">Order History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
