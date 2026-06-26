import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';
import { APP_NAME } from '../config';

export default function Register({ onLoginRedirect }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-6 bg-[#f5f5f7] dark:bg-[#000000] select-none transition-colors duration-300">
      <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl w-full max-w-[400px] p-8 rounded-3xl flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] dark:shadow-none animate-fade">
        
        {/* Header/Branding block */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-16 h-16 mb-1">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="transform rotate-[-90deg]">
              {/* Outer ring (Red/Pink) */}
              <circle cx="12" cy="12" r="9" stroke="#FF2D55" strokeWidth="2.8" strokeLinecap="butt" strokeDasharray="42 14" />
              {/* Middle ring (Green) */}
              <circle cx="12" cy="12" r="6" stroke="#30D158" strokeWidth="2.8" strokeLinecap="butt" strokeDasharray="27 10" />
              {/* Inner ring (Blue) */}
              <circle cx="12" cy="12" r="3" stroke="#0A84FF" strokeWidth="2.8" strokeLinecap="butt" strokeDasharray="12 6" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-[13px] text-black/40 dark:text-white/40 font-semibold tracking-tight">
            Start tracking your health journey with {APP_NAME}.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="bg-[#ff2d55]/10 text-[#ff2d55] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-center leading-normal">
            {error}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name Block */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Block */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Block */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Password</label>
            <input
              type="password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Core Register Action */}
          <button 
            type="submit" 
            className="w-full inline-flex items-center justify-center px-4 py-2.5 mt-2 text-[14px] font-medium rounded-xl bg-[#0a84ff] text-white hover:bg-[#2292ff] disabled:opacity-50 active:scale-[0.98] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-[#0a84ff]" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        {/* Footer Navigation Switch */}
        <div className="text-center text-[13px] text-black/40 dark:text-white/40 border-t border-black/[0.03] dark:border-white/[0.05] pt-4 mt-1 font-semibold">
          Already have an account?{' '}
          <button 
            type="button" 
            className="text-[#0a84ff] font-bold hover:underline bg-transparent border-none p-0 cursor-pointer outline-none align-baseline text-[13px]" 
            onClick={onLoginRedirect}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
