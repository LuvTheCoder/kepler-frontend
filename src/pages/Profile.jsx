import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Check, Sun, Moon } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, theme, toggleTheme } = useAuth();
  
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('prefer-not-to-say');
  const [age, setAge] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing profile values
  useEffect(() => {
    if (user && user.profile) {
      setHeight(user.profile.height !== undefined && user.profile.height !== null ? user.profile.height : '');
      setGender(user.profile.gender !== undefined && user.profile.gender !== null ? user.profile.gender : 'prefer-not-to-say');
      setAge(user.profile.age !== undefined && user.profile.age !== null ? user.profile.age : '');
      setTargetWeight(user.profile.targetWeight !== undefined && user.profile.targetWeight !== null ? user.profile.targetWeight : '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const hNum = height !== '' ? parseFloat(height) : null;
    const aNum = age !== '' ? parseInt(age) : null;
    const tNum = targetWeight !== '' ? parseFloat(targetWeight) : null;

    if (hNum !== null && (hNum <= 50 || hNum > 300)) {
      setError('Please enter a valid height between 50 and 300 cm.');
      setLoading(false);
      return;
    }

    if (aNum !== null && (aNum <= 0 || aNum > 120)) {
      setError('Please enter a valid age between 1 and 120.');
      setLoading(false);
      return;
    }

    if (tNum !== null && (tNum <= 10 || tNum > 500)) {
      setError('Please enter a valid target weight between 10 and 500 kg.');
      setLoading(false);
      return;
    }

    try {
      await updateProfile({
        height: hNum,
        gender,
        age: aNum,
        targetWeight: tNum,
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile settings');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'WF';
  };

  const hasUnsetMetrics = !user?.profile?.height || !user?.profile?.targetWeight;

  return (
    <div className="animate-fade max-w-[640px] mx-auto w-full px-6 py-8 select-none">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white mb-2">Profile Settings</h1>
        <p className="text-black/40 dark:text-white/40 text-[14px] font-medium tracking-tight">Manage your personal metrics and preferences below.</p>
      </div>

      {/* Incomplete Profile Banner */}
      {hasUnsetMetrics && (
        <div className="bg-[#0a84ff]/10 flex gap-4 px-6 py-[18px] mb-7 items-center">
          <ShieldAlert size={24} className="text-[#0a84ff] shrink-0" />
          <div>
            <h4 className="text-[#0a84ff] mb-0.5 text-[15px] font-bold">Complete Your Profile</h4>
            <p className="text-[13px] text-black/50 dark:text-white/50 font-medium">
              Set your height and age to calculate and display your Body Mass Index (BMI) accurately on your dashboard.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-[#ff2d55]/10 text-[#ff2d55] px-4 py-3 text-[13px] font-semibold text-center mb-6">
          {error}
        </div>
      )}
      
      {/* Success */}
      {success && (
        <div className="bg-[#30d158]/10 text-[#30d158] flex items-center gap-2.5 px-4 py-3 mb-6 font-semibold text-sm">
          <Check size={18} />
          {success}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-[#0a84ff] text-white flex items-center justify-center text-2xl font-bold">
            {getInitials(user?.name)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white tracking-tight">{user?.name}</h3>
            <p className="text-sm text-black/40 dark:text-white/40 font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Row 1: Height + Age */}
          <div className="flex gap-4 max-[480px]:flex-col max-[480px]:gap-0">
            <div className="flex-grow flex flex-col gap-1.5 w-full mb-5">
              <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3.5 py-2.5 bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
            
            <div className="flex-grow flex flex-col gap-1.5 w-full mb-5">
              <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Age</label>
              <input
                type="number"
                className="w-full px-3.5 py-2.5 bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
                placeholder="e.g. 28"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Gender + Target Weight */}
          <div className="flex gap-4 max-[480px]:flex-col max-[480px]:gap-0">
            <div className="flex-grow flex flex-col gap-1.5 w-full mb-5">
              <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Gender</label>
              <select
                className="w-full px-3.5 py-2.5 bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer Not To Say</option>
              </select>
            </div>

            <div className="flex-grow flex flex-col gap-1.5 w-full mb-5">
              <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3.5 py-2.5 bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
                placeholder="e.g. 70"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-between items-center mt-5 pt-5 border-t border-black/[0.03] dark:border-white/[0.05]">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">App Interface Theme</span>
              <span className="text-xs text-black/40 dark:text-white/40 font-medium">Choose a dark or light theme interface</span>
            </div>
            <button 
              type="button" 
              className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium bg-black/[0.03] dark:bg-white/[0.05] text-black dark:text-white cursor-pointer transition-all duration-150 gap-2 hover:bg-black/[0.06] dark:hover:bg-white/[0.08]" 
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button 
              type="submit" 
              className="px-4 py-2.5 text-[14px] font-semibold bg-[#0a84ff] text-white hover:bg-[#2292ff] disabled:opacity-50 active:scale-[0.98] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.15)]" 
              disabled={loading}
            >
              {loading ? 'Saving Metrics...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
