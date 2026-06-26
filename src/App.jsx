import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { Activity } from 'lucide-react';
import { APP_NAME } from './config';
import './App.css';

function MainAppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    document.title = APP_NAME;
  }, []);

  // Splash Loading Screen
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-[var(--bg-app)] gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0a84ff]/10 text-[#0a84ff] animate-pulse">
          <Activity size={32} />
        </div>
        <h2 className="font-semibold text-lg text-black dark:text-white">{APP_NAME}</h2>
      </div>
    );
  }

  // Auth Guard
  if (!user) {
    if (authView === 'register') {
      return <Register onLoginRedirect={() => setAuthView('login')} />;
    }
    return <Login onRegisterRedirect={() => setAuthView('register')} />;
  }

  // Logged-in shell
  return (
    <div className="flex w-full min-h-screen relative">
      {/* Sidebar for Desktop */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content Area */}
      <main className="flex-1 p-10 lg:px-12 md:p-8 overflow-y-auto h-screen max-md:h-auto max-md:overflow-y-visible max-md:px-4 max-md:pt-6 max-md:pb-24 transition-all duration-300">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
