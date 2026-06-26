import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  TrendingUp, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon,
  Activity
} from 'lucide-react';
import { APP_NAME } from '../config';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'WF';
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <div className={`${isCollapsed ? 'w-[72px]' : 'w-[250px]'} bg-[#f5f5f7]/85 dark:bg-[#121212]/80 backdrop-blur-xl px-3.5 py-6 flex flex-col justify-between h-screen sticky top-0 z-10 transition-all duration-300 max-md:hidden select-none`}>
      <div>
        {/* Logo / Header with Collapse Trigger */}
        <div className={`flex items-center justify-between mb-6 transition-all ${isCollapsed ? 'flex-col gap-3 justify-center px-0' : 'px-1'}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-0.5 flex items-center justify-center">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="transform rotate-[-90deg]">
                {/* Outer ring (Red/Pink) */}
                <circle cx="12" cy="12" r="9" stroke="#FF2D55" strokeWidth="2.8" strokeLinecap="butt" strokeDasharray="42 14" />
                {/* Middle ring (Green) */}
                <circle cx="12" cy="12" r="6" stroke="#30D158" strokeWidth="2.8" strokeLinecap="butt" strokeDasharray="27 10" />
                {/* Inner ring (Blue) */}
                <circle cx="12" cy="12" r="3" stroke="#0A84FF" strokeWidth="2.8" strokeLinecap="butt" strokeDasharray="12 6" />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="text-[16px] font-extrabold text-black dark:text-white tracking-tight">
                {APP_NAME}
              </span>
            )}
          </div>
          
          <button 
            type="button"
            className={`flex items-center justify-center w-6 h-6 text-black/30 dark:text-white/30 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] hover:text-black dark:hover:text-white transition-all duration-150 outline-none ${isCollapsed ? 'w-8 h-8' : ''}`}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={15} strokeWidth={2.5} /> : <ChevronLeft size={15} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Navigation Section */}
        {!isCollapsed && (
          <span className="text-[11px] font-bold text-black/30 dark:text-white/30 px-2.5 block mb-2 tracking-wider uppercase">
            Favorites
          </span>
        )}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`flex items-center gap-3 px-2.5 py-1.5 text-[13px] font-semibold transition-all duration-150 outline-none group
                  ${isActive 
                    ? 'bg-black/[0.04] dark:bg-white/[0.08] text-black dark:text-white font-semibold' 
                    : 'text-black/70 dark:text-white/70 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}
                  ${isCollapsed ? 'justify-center px-0 h-9 w-9 mx-auto' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon 
                  size={16} 
                  strokeWidth={isActive ? 2.3 : 1.8} 
                  className={isActive ? 'text-[#0a84ff]' : 'text-black/40 dark:text-white/40 group-hover:text-black dark:group-hover:text-white'} 
                />
                {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="flex flex-col gap-2 pt-4">
        
        {/* Theme Toggle */}
        <button 
          className={`flex items-center gap-3 text-black/60 dark:text-white/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white px-2.5 py-1.5 transition-all duration-150 ${isCollapsed ? 'justify-center h-9 w-9 mx-auto px-0' : ''}`}
          onClick={toggleTheme}
          title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        >
          {theme === 'light' ? <Moon size={16} strokeWidth={1.8} /> : <Sun size={16} strokeWidth={1.8} />}
          {!isCollapsed && <span className="text-[13px] tracking-tight">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        {/* User Badge */}
        {user && (
          <div className={`flex items-center gap-2.5 p-1.5 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.03] cursor-pointer ${isCollapsed ? 'justify-center p-0 h-9 w-9 mx-auto' : ''}`}>
            <div className="w-8 h-8 bg-black/[0.05] dark:bg-white/[0.1] text-black/80 dark:text-white/90 flex items-center justify-center font-bold text-[12px] shrink-0">
              {getInitials(user.name)}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden leading-tight">
                <span className="font-bold text-[13px] text-black dark:text-white whitespace-nowrap text-ellipsis tracking-tight">{user.name}</span>
                <span className="text-[11px] text-black/40 dark:text-white/40 whitespace-nowrap text-ellipsis tracking-tight">{user.email}</span>
              </div>
            )}
          </div>
        )}

        {/* Logout Control */}
        <div className={`flex ${isCollapsed ? 'justify-center mt-1' : 'px-1 mt-1'}`}>
          <button 
            className={`flex items-center text-black/40 dark:text-white/40 hover:text-[#ff2d55] dark:hover:text-[#ff2d55] transition-colors p-1.5 ${isCollapsed ? 'h-9 w-9 justify-center hover:bg-black/[0.02] dark:hover:bg-white/[0.03]' : ''}`}
            onClick={logout}
            title="Log Out"
          >
            <LogOut size={15} strokeWidth={1.8} />
            {!isCollapsed && <span className="ml-2 text-[12px] font-bold tracking-tight">Log Out</span>}
          </button>
        </div>
      </div>
    </div>
  );
}