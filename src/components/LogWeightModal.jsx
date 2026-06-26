import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function LogWeightModal({ isOpen, onClose, onSave, initialWeight = '' }) {
  const [weight, setWeight] = useState(initialWeight);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setWeight(initialWeight);
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setError('');
    }
  }, [isOpen, initialWeight]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 500) {
      setError('Please enter a valid weight between 1 and 500 kg.');
      return;
    }

    onSave({
      weight: parsedWeight,
      date,
      note: note.trim()
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-xl flex items-center justify-center z-[100] transition-all duration-300 animate-fade" 
      onClick={onClose}
    >
      <div 
        className="bg-white/90 dark:bg-[#1c1c1e]/90 w-full max-w-[440px] mx-4 p-6 rounded-3xl flex flex-col gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-[19px] font-bold text-black dark:text-white tracking-tight">
            Record Daily Weight
          </h2>
          <button 
            type="button"
            className="flex items-center justify-center w-7 h-7 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-black/40 dark:text-white/40 hover:bg-black/[0.08] dark:hover:bg-white/[0.12] transition-colors duration-150" 
            onClick={onClose}
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="bg-[#ff2d55]/10 text-[#ff2d55] px-4 py-3 rounded-2xl text-[13px] font-semibold leading-normal">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Weight Input */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent placeholder:text-black/25 dark:placeholder:text-white/25"
              placeholder="0.0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Date Input */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Date</label>
            <input
              type="date"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Notes Input */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[13px] font-semibold text-black/45 dark:text-white/45 px-0.5 uppercase tracking-wide">Notes (Optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] text-black dark:text-white text-[15px] outline-none transition-all duration-200 focus:bg-white dark:focus:bg-[#2c2c2e] focus:ring-2 focus:ring-[#0a84ff] focus:border-transparent min-h-[76px] resize-none placeholder:text-black/25 dark:placeholder:text-white/25"
              placeholder="Add details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Apple-Style Action Buttons */}
          <div className="flex gap-2.5 mt-3 justify-end">
            <button 
              type="button" 
              className="px-4 py-2 text-[14px] font-medium rounded-xl bg-black/[0.03] dark:bg-white/[0.05] text-black/70 dark:text-white/80 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] active:scale-[0.98] transition-all duration-150"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-[14px] font-medium rounded-xl bg-[#0a84ff] text-white hover:bg-[#2292ff] active:scale-[0.98] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
            >
              Save Log
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}