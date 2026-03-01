import { useState } from 'react';
import { Activity, Plus, TrendingUp, HeartPulse } from 'lucide-react';
import api from '../../lib/api';

export const PatientVitals = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/patients/vitals', {
        blood_pressure: `${systolic}/${diastolic}`,
        heart_rate: parseInt(heartRate),
        temperature: parseFloat(temperature),
        weight: parseFloat(weight)
      });
      // Reset form on success (In real app, trigger a refresh of the list)
      setSystolic(''); setDiastolic(''); setHeartRate(''); setTemperature(''); setWeight('');
    } catch (_err) {
      console.error('Failed to log vitals', _err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Health Vitals</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your daily metrics to share with your doctor.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Form Column */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6 text-primary-600 dark:text-primary-400">
            <Activity size={20} />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Log Metrics</h3>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Systolic (mmHg)</label>
                  <input type="number" required value={systolic} onChange={e => setSystolic(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="120" />
               </div>
               <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Diastolic (mmHg)</label>
                  <input type="number" required value={diastolic} onChange={e => setDiastolic(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="80" />
               </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Heart Rate (bpm)</label>
                <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="72" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Temp (°C)</label>
                  <input type="number" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="36.5" />
               </div>
               <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Weight (kg)</label>
                  <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="70.5" />
               </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors">
              {isSubmitting ? 'Saving...' : <><Plus size={18} /> Log Today's Vitals</>}
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2 text-accent-600 dark:text-accent-400">
                <TrendingUp size={20} />
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Recent Logs</h3>
             </div>
             <button className="text-sm font-medium text-primary-600 hover:underline">Download Report</button>
          </div>

          <div className="space-y-4">
             {/* Mock Data Entry */}
             <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="bg-red-50 dark:bg-red-900/30 p-2 rounded-lg text-red-500">
                     <HeartPulse size={24} />
                   </div>
                   <div>
                     <p className="font-medium text-slate-800 dark:text-slate-200">Today, 08:30 AM</p>
                     <div className="flex gap-4 mt-1 text-sm text-slate-500">
                        <span>BP: 120/80</span>
                        <span>HR: 72 bpm</span>
                        <span>Temp: 36.6°C</span>
                     </div>
                   </div>
                </div>
                <div className="text-right flex sm:flex-col items-center sm:items-end gap-2 text-xs font-semibold text-green-600 dark:text-green-400">
                   Normal
                </div>
             </div>

             {/* Mock Data Entry */}
             <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div className="flex items-center gap-4">
                   <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg text-slate-500">
                     <HeartPulse size={24} />
                   </div>
                   <div>
                     <p className="font-medium text-slate-800 dark:text-slate-200">Yesterday, 07:15 AM</p>
                     <div className="flex gap-4 mt-1 text-sm text-slate-500">
                        <span>BP: 122/82</span>
                        <span>HR: 75 bpm</span>
                        <span>Temp: 36.5°C</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PatientVitals;
