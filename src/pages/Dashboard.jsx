import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import WeightChart from '../components/WeightChart';
import WorkoutCalendar from '../components/WorkoutCalendar';
import LogWeightModal from '../components/LogWeightModal';
import { 
  Plus, 
  Weight, 
  Activity, 
  Flame, 
  Trash2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function Dashboard() {
  const { apiFetch, user } = useAuth();
  
  const [weightLogs, setWeightLogs] = useState([]);
  const [completedDates, setCompletedDates] = useState([]);
  const [streak, setStreak] = useState(0);
  
  const [filter, setFilter] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const weightRes = await apiFetch(`/weight?filter=${filter}`);
      if (weightRes.ok) {
        const weightData = await weightRes.json();
        setWeightLogs(weightData);
      }

      const workoutRes = await apiFetch('/workout');
      if (workoutRes.ok) {
        const workoutData = await workoutRes.json();
        setCompletedDates(workoutData.map(log => log.date));
      }

      const localToday = new Date();
      const todayStr = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, '0')}-${String(localToday.getDate()).padStart(2, '0')}`;
      const streakRes = await apiFetch(`/workout/streak?today=${todayStr}`);
      if (streakRes.ok) {
        const streakData = await streakRes.json();
        setStreak(streakData.streak);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Could not update dashboard data. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filter]);

  const handleSaveWeight = async (logData) => {
    try {
      const response = await apiFetch('/weight', {
        method: 'POST',
        body: JSON.stringify(logData),
      });

      if (response.ok) {
        setIsLogModalOpen(false);
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save weight log');
      }
    } catch (err) {
      console.error(err);
      setError('Error updating weight');
    }
  };

  const handleDeleteWeight = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this weight log?')) return;
    
    try {
      const response = await apiFetch(`/weight/${logId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchDashboardData();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete log');
      }
    } catch (err) {
      console.error(err);
      setError('Error deleting log');
    }
  };

  const handleToggleWorkout = async (dateString) => {
    try {
      const response = await apiFetch('/workout', {
        method: 'POST',
        body: JSON.stringify({ date: dateString }),
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to toggle workout', err);
    }
  };

  const getLatestWeight = () => {
    if (weightLogs.length === 0) return null;
    const sorted = [...weightLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted[0];
  };

  const latestLog = getLatestWeight();
  const latestWeight = latestLog ? latestLog.weight : null;

  const calculateBMI = () => {
    if (!latestWeight || !user?.profile?.height) return null;
    const heightM = user.profile.height / 100;
    return (latestWeight / (heightM * heightM)).toFixed(2);
  };

  const bmiVal = calculateBMI();

  const getGoalStatus = () => {
    if (!latestWeight || !user?.profile?.targetWeight) return null;
    const diff = latestWeight - user.profile.targetWeight;
    if (diff === 0) return 'Goal reached!';
    return diff > 0 
      ? `${diff.toFixed(1)} kg above target` 
      : `${Math.abs(diff).toFixed(1)} kg below target`;
  };

  const goalStatus = getGoalStatus();

  const getStreakStatusMessage = () => {
    if (streak === 0) return 'Log a workout to start!';
    if (streak === 1) return 'First day logged. Keep it up!';
    return `${streak} active days in a row!`;
  };

  const getDayDiffStatus = () => {
    if (weightLogs.length < 2) return null;
    const sorted = [...weightLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const diff = sorted[0].weight - sorted[1].weight;
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)} kg vs last entry`;
  };

  const dayDiffStatus = getDayDiffStatus();

  const filters = [
    { key: '7d', label: '7D' },
    { key: '30d', label: '30D' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="animate-fade max-w-[1200px] mx-auto px-6 py-8 select-none">
      
      {/* Error Alert Box */}
      {error && (
        <div className="bg-[#ff2d55]/10 text-[#ff2d55] px-4 py-3 text-[14px] font-semibold flex items-center gap-2 mb-6">
          <AlertCircle size={16} strokeWidth={2.5} />
          <span>{error}</span>
        </div>
      )}

      {/* Split Main Visual Analytics Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (1/3 Width Section): Activity controls & Quick logging */}
        <div className="flex flex-col gap-6">
          {/* Welcome Header Section */}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-4xl font-extrabold tracking-tight text-black dark:text-white leading-tight">
              Welcome, {user?.name ? user.name.split(' ')[0] : ''}
            </h1>
            <p className="text-black/40 dark:text-white/40 text-[11px] font-bold uppercase tracking-wider mt-1">
              Today's Activity
            </p>
          </div>

          {/* Quick weight recording action */}
          <button 
            type="button"
            className="w-full inline-flex items-center justify-center px-4 py-3.5 text-[15px] font-bold bg-[#0a84ff] text-white hover:bg-[#2292ff] active:scale-[0.99] transition-all duration-150 gap-2 shadow-[0_2px_8px_rgba(10,132,255,0.15)] dark:shadow-none" 
            onClick={() => setIsLogModalOpen(true)}
          >
            <Plus size={18} strokeWidth={3} />
            <span>RECORD WEIGHT</span>
          </button>

          {/* Compact Workout Streak Banner */}
          <div className="bg-[#30d158]/10 text-[#30d158] px-4 py-3 flex items-center justify-between text-[13px] font-bold tracking-tight">
            <div className="flex items-center gap-2">
              <Flame size={15} strokeWidth={2.5} className="animate-pulse" />
              <span>ACTIVE WORKOUT STREAK</span>
            </div>
            <span>{streak} {streak === 1 ? 'DAY' : 'DAYS'}</span>
          </div>

          {/* Workout Calendar Widget */}
          <WorkoutCalendar 
            completedDates={completedDates} 
            onToggleDate={handleToggleWorkout} 
          />
        </div>

        {/* Right Column (2/3 Width Section): Weight analytics & history */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Top Row: Metric stats cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <MetricCard
              title="Current Weight"
              value={latestWeight !== null ? latestWeight : '—'}
              unit={latestWeight !== null ? 'kg' : ''}
              icon={Weight}
              footer={dayDiffStatus || (user?.profile?.targetWeight ? `Target: ${user.profile.targetWeight} kg` : 'No target set')}
              accented={latestWeight !== null}
            />

            <MetricCard
              title="Body Mass Index"
              value={bmiVal !== null ? bmiVal : '—'}
              unit=""
              icon={Activity}
              footer={user?.profile?.height ? `Height: ${user.profile.height} cm` : 'Set height in settings'}
            />

            <MetricCard
              title="Target Status"
              value={user?.profile?.targetWeight ? `${user.profile.targetWeight}` : '—'}
              unit={user?.profile?.targetWeight ? 'kg' : ''}
              icon={HelpCircle}
              footer={goalStatus || 'Set target in profile'}
            />
          </div>

          {/* Weight Trends Line/Area Graph */}
          <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col gap-5">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h3 className="text-[16px] font-bold text-black dark:text-white tracking-tight">Weight Trends</h3>
                <p className="text-[12px] text-black/40 dark:text-white/40 font-medium">Logged weight fluctuations over time</p>
              </div>

              {/* Segmented filter selector buttons */}
              <div className="flex bg-black/[0.04] dark:bg-white/[0.06] p-0.5">
                {filters.map(f => (
                  <button 
                    key={f.key}
                    className={`px-3 py-1 text-[12px] font-semibold transition-all duration-150 border-none outline-none
                      ${filter === f.key 
                        ? 'bg-white dark:bg-[#2c2c2e] text-black dark:text-white shadow-sm' 
                        : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full h-72 mt-2">
              {loading ? (
                <div className="h-full flex items-center justify-center text-black/40 dark:text-white/40 text-[14px] font-medium tracking-tight">
                  Loading statistics...
                </div>
              ) : (
                <WeightChart logs={weightLogs} />
              )}
            </div>
          </div>

          {/* Historical Log History ledger table */}
          <div className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-md p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col gap-4">
            <div>
              <h3 className="text-[16px] font-bold text-black dark:text-white tracking-tight">Log History</h3>
              <p className="text-[12px] text-black/40 dark:text-white/40 font-medium">Review or delete your weight log entries</p>
            </div>
            
            <div className="overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
              {weightLogs.length === 0 ? (
                <div className="p-8 text-center text-black/40 dark:text-white/40 text-[14px] font-medium tracking-tight">
                  No records stored yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-[14px]">
                    <thead>
                      <tr>
                        <th className="bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 font-semibold text-black/40 dark:text-white/40 text-[12px] tracking-tight uppercase">Date</th>
                        <th className="bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 font-semibold text-black/40 dark:text-white/40 text-[12px] tracking-tight uppercase">Weight</th>
                        <th className="bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 font-semibold text-black/40 dark:text-white/40 text-[12px] tracking-tight uppercase">Notes</th>
                        <th className="bg-black/[0.02] dark:bg-white/[0.02] px-4 py-2.5 w-[44px]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.02] dark:divide-white/[0.03]">
                      {[...weightLogs]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((log) => (
                          <tr key={log._id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] group transition-colors duration-150">
                            <td className="px-4 py-3 text-black dark:text-white font-normal tracking-tight">
                              {new Date(log.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                timeZone: 'UTC'
                              })}
                            </td>
                            <td className="px-4 py-3 text-black dark:text-white font-bold tracking-tight">
                              {log.weight} kg
                            </td>
                            <td className="px-4 py-3 text-black/60 dark:text-white/60 text-[13px] max-w-[200px] truncate tracking-tight">
                              {log.note || <span className="opacity-20">—</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                type="button"
                                className="flex items-center justify-center text-black/30 dark:text-white/30 p-1.5 transition-all hover:bg-[#ff2d55]/10 hover:text-[#ff2d55] dark:hover:text-[#ff2d55] outline-none"
                                onClick={() => handleDeleteWeight(log._id)}
                                title="Delete data row"
                              >
                                <Trash2 size={14} strokeWidth={2} />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Log Weight Modal Overlay View */}
      <LogWeightModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveWeight}
        initialWeight={latestWeight !== null ? latestWeight : ''}
      />
    </div>
  );
}