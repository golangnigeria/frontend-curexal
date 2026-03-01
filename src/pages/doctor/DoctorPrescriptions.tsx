import { useState } from 'react';
import { Search, Send, ShieldAlert, Pill } from 'lucide-react';
import api from '../../lib/api';

export const DoctorPrescriptions = () => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, this would be an async search against the backend API to find patients
  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mocking finding a patient
    const term = e.target.value;
    if (term.length > 3) {
      setPatientName('John Doe');
      setPatientId('fd3b9b9c-xyz');
    } else {
      setPatientName('');
      setPatientId('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return alert('Please select a valid patient first.');
    
    setIsSubmitting(true);
    try {
      await api.post('/doctors/prescriptions/issue', {
        patient_id: patientId,
        medication_name: medication,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        notes: notes
      });
      // Reset form
      setMedication(''); setDosage(''); setFrequency(''); setDuration(''); setNotes('');
      alert('Prescription sent to pharmacy network successfully.');
    } catch (err) {
      console.error('Failed to issue prescription', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Issue Prescription</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Digitally route medications directly to Curexal partner pharmacies.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Prescription Form Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          
          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 border-b border-primary-100 dark:border-primary-900/50">
             <label className="block text-sm font-semibold text-primary-800 dark:text-primary-300 mb-2">Patient Search</label>
             <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-primary-400" />
                </div>
                <input
                  type="text"
                  onChange={handlePatientSearch}
                  className="block w-full pl-10 pr-3 py-3 border border-primary-200 dark:border-primary-800 rounded-xl bg-white dark:bg-slate-950 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium text-slate-800 dark:text-slate-200"
                  placeholder="Type Name, Email, or Patient ID..."
                />
             </div>
             
             {patientName && (
               <div className="mt-4 p-3 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800/50 rounded-lg flex items-center gap-3">
                 <div className="h-10 w-10 text-xl font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-full flex justify-center items-center">
                   {patientName.charAt(0)}
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 dark:text-slate-200">{patientName}</h4>
                   <p className="text-xs text-slate-500">Target selected for prescription</p>
                 </div>
               </div>
             )}
          </div>

          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medication Name & Strength</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Pill size={16} />
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={medication} 
                      onChange={e => setMedication(e.target.value)} 
                      className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" 
                      placeholder="e.g. Amoxicillin 500mg" 
                    />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dosage Form</label>
                  <input type="text" required value={dosage} onChange={e => setDosage(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="e.g. 1 Capsule" />
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Frequency</label>
                  <select required value={frequency} onChange={e => setFrequency(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100">
                    <option value="">Select Frequency...</option>
                    <option value="once_daily">Once Daily (OD)</option>
                    <option value="twice_daily">Twice Daily (BID)</option>
                    <option value="three_times">Three Times a Day (TID)</option>
                    <option value="four_times">Four Times a Day (QID)</option>
                    <option value="as_needed">As Needed (PRN)</option>
                  </select>
               </div>
               
               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" placeholder="e.g. 7 Days" />
               </div>

               <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Additional Instructions for Patient/Pharmacy</label>
                  <textarea 
                    rows={3} 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-surface dark:bg-slate-950 sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100" 
                    placeholder="Take after a full meal to prevent nausea..."
                  ></textarea>
               </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button type="submit" disabled={isSubmitting || !patientId} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20 active:scale-95">
                {isSubmitting ? 'Sending...' : <><Send size={18} /> Transmit to Pharmacy Array</>}
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-6 flex flex-col justify-center items-center text-center">
             <div className="h-14 w-14 bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500 rounded-full flex items-center justify-center mb-4">
               <ShieldAlert size={28} />
             </div>
             <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Automated Verification</h3>
             <p className="text-slate-600 dark:text-slate-400 text-sm">
               All prescriptions issued through Curexal automatically undergo an AI conflict check against the patient's existing medication list to prevent adverse interactions.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorPrescriptions;
