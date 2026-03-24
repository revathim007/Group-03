import React, { useState } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Key, User, Mail, Phone, Check } from 'lucide-react';

const Settings = () => {
  const [editingField, setEditingField] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    setLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('User session not found. Please login again.');
        return;
      }
      const user = JSON.parse(userData);
      const response = await axios.post('http://localhost:8000/api/accounts/update-username/', {
        new_username: newUsername,
        user_id: user.id
      });

      // Update local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Username updated successfully!');
      setEditingField(null);
      setNewUsername('');
      
      // Refresh the page to reflect changes in header
      window.location.reload();
    } catch (error) {
      console.error('Update username error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('User session not found. Please login again.');
        return;
      }
      const user = JSON.parse(userData);
      const response = await axios.post('http://localhost:8000/api/accounts/update-email/', {
        new_email: newEmail,
        user_id: user.id
      });

      // Update local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Email updated successfully!');
      setEditingField(null);
      setNewEmail('');
      
      // Refresh the page to reflect changes in header
      window.location.reload();
    } catch (error) {
      console.error('Update email error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    if (!newPhone.trim()) return;

    // Validation: only numbers and exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(newPhone)) {
      alert('Phone number must be exactly 10 digits and contain only numbers');
      return;
    }

    setLoading(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('User session not found. Please login again.');
        return;
      }
      const user = JSON.parse(userData);
      const response = await axios.post('http://localhost:8000/api/accounts/update-phone/', {
        new_phone: newPhone,
        user_id: user.id
      });

      // Update local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Phone number updated successfully!');
      setEditingField(null);
      setNewPhone('');
      
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Update phone error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  const settingOptions = [
    { id: 'password', name: 'Reset Password', icon: <Key size={20} />, color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { id: 'username', name: 'Edit Username', icon: <User size={20} />, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'email', name: 'Edit Email ID', icon: <Mail size={20} />, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { id: 'phone', name: 'Edit Phone Number', icon: <Phone size={20} />, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Settings</h1>
      </header>

      <div className="glass-panel p-8 border border-white/5 text-white">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center border-b border-white/5 pb-4">
            <SettingsIcon className="text-light-accent mr-2" size={24} />
            Account Customization
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingOptions.map((option) => (
              <button 
                key={option.name}
                onClick={() => setEditingField(option.id === editingField ? null : option.id)}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all group ${
                  editingField === option.id 
                    ? 'bg-white/10 border-light-accent shadow-lg shadow-light-accent/10 ring-1 ring-light-accent/20' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`${option.bgColor} ${option.color} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {option.icon}
                  </div>
                  <span className="font-bold text-white">{option.name}</span>
                </div>
                <div className={`${editingField === option.id ? 'text-light-accent' : 'text-gray-400 group-hover:text-light-accent'} transition-colors`}>
                  <SettingsIcon size={16} />
                </div>
              </button>
            ))}
          </div>

          {/* Dynamic Edit Form */}
          {editingField === 'username' && (
            <div className="mt-8 p-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 animate-in zoom-in-95 duration-300">
              <h4 className="font-bold text-blue-400 mb-4 flex items-center">
                <User size={18} className="mr-2" />
                Change Your Username
              </h4>
              <form onSubmit={handleUpdateUsername} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="glass-input flex-1 px-4 py-3 bg-white/5"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button bg-blue-500/20 border border-blue-500/30 font-bold px-8 py-3 rounded-xl hover:bg-blue-500/30 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Updating...' : (
                    <>
                      <Check size={18} className="mr-2" />
                      Done
                    </>
                  )}
                </button>
              </form>
              <p className="mt-3 text-xs text-blue-400 font-medium italic">
                Note: You will need to use this new username for your next login.
              </p>
            </div>
          )}

          {editingField === 'email' && (
            <div className="mt-8 p-6 bg-green-500/10 rounded-2xl border border-green-500/20 animate-in zoom-in-95 duration-300">
              <h4 className="font-bold text-green-400 mb-4 flex items-center">
                <Mail size={18} className="mr-2" />
                Change Your Email ID
              </h4>
              <form onSubmit={handleUpdateEmail} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="glass-input flex-1 px-4 py-3 bg-white/5"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button bg-green-500/20 border border-green-500/30 font-bold px-8 py-3 rounded-xl hover:bg-green-500/30 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Updating...' : (
                    <>
                      <Check size={18} className="mr-2" />
                      Done
                    </>
                  )}
                </button>
              </form>
              <p className="mt-3 text-xs text-green-400 font-medium italic">
                Note: This email will be used for all future communications.
              </p>
            </div>
          )}

          {editingField === 'phone' && (
            <div className="mt-8 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20 animate-in zoom-in-95 duration-300">
              <h4 className="font-bold text-purple-400 mb-4 flex items-center">
                <Phone size={18} className="mr-2" />
                Change Your Phone Number
              </h4>
              <form onSubmit={handleUpdatePhone} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Enter new phone number"
                  className="glass-input flex-1 px-4 py-3 bg-white/5"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="glass-button bg-purple-500/20 border border-purple-500/30 font-bold px-8 py-3 rounded-xl hover:bg-purple-500/30 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Updating...' : (
                    <>
                      <Check size={18} className="mr-2" />
                      Done
                    </>
                  )}
                </button>
              </form>
              <p className="mt-3 text-xs text-purple-400 font-medium italic">
                Note: This will be your primary contact number.
              </p>
            </div>
          )}
 
           {editingField && editingField !== 'username' && editingField !== 'email' && editingField !== 'phone' && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500 font-medium">The {editingField} update feature is coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
