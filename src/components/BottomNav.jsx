import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, User, LogOut, Sun, Moon } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const { logout, theme, toggleTheme } = useAuth();

  return (
    <div className="hidden max-md:flex fixed bottom-5 left-4 right-4 h-16 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-none rounded-full z-50 justify-around items-center px-4 pb-[env(safe-area-inset-bottom)] transition-colors duration-300">
      
      {/* Dashboard Tab */}
      <button 
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium transition-colors duration-200 ${
          activeTab === 'dashboard' 
            ? 'text-[#0071e3] dark:text-[#0a84ff]' 
            : 'text-[#8e8e93] dark:text-[#98989d]'
        }`}
        onClick={() => setActiveTab('dashboard')}
      >
        <TrendingUp size={22} strokeWidth={activeTab === 'dashboard' ? 2.3 : 1.8} />
        <span>Dashboard</span>
      </button>

      {/* Profile Tab */}
      <button 
        className={`flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium transition-colors duration-200 ${
          activeTab === 'profile' 
            ? 'text-[#0071e3] dark:text-[#0a84ff]' 
            : 'text-[#8e8e93] dark:text-[#98989d]'
        }`}
        onClick={() => setActiveTab('profile')}
      >
        <User size={22} strokeWidth={activeTab === 'profile' ? 2.3 : 1.8} />
        <span>Profile</span>
      </button>

      {/* Theme Toggle Tab */}
      <button 
        className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium text-[#8e8e93] dark:text-[#98989d] hover:text-[#0071e3] dark:hover:text-[#0a84ff] transition-colors duration-200" 
        onClick={toggleTheme}
      >
        {theme === 'light' ? <Moon size={22} strokeWidth={1.8} /> : <Sun size={22} strokeWidth={1.8} />}
        <span>Theme</span>
      </button>

      {/* Logout Tab */}
      <button 
        className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-[11px] font-medium text-[#8e8e93] dark:text-[#98989d] hover:text-[#ff3b30] dark:hover:text-[#ff453a] transition-colors duration-200" 
        onClick={logout}
      >
        <LogOut size={22} strokeWidth={1.8} />
        <span>Exit</span>
      </button>

    </div>
  );
}