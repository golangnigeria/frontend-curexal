import { useState } from 'react';
import { Search, Calendar, Clock, Video, FileText, Check, X } from 'lucide-react';

export const DoctorAppointments = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'completed'>('pending');

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Appointment Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review requests, schedule consultations, and manage your day.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-slate-200"
              placeholder="Search patients by name or ID..."
            />
          </div>
          <div className="flex gap-2">
            <input type="date" className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'pending' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            Pending Requests <span className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400 py-0.5 px-2 rounded-full text-xs">2</span>
          </button>
          <button 
            onClick={() => setActiveTab('accepted')}
            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'accepted' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            Confirmed Schedule
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'completed' ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
          >
            History & Records
          </button>
        </div>

        {/* List Content */}
        <div className="p-6 space-y-4">
          
          {activeTab === 'pending' && (
             <div className="p-4 border border-amber-200 dark:border-amber-800/50 rounded-xl bg-amber-50/50 dark:bg-amber-900/10">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">New Patient Request: Jane Smith</h4>
                       <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Virtual</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Reason: Chronic headache and fatigue for 3 days.</p>
                    <div className="flex items-center gap-4 mt-2 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-1"><Calendar size={14} /> Requested: Oct 25</div>
                      <div className="flex items-center gap-1"><Clock size={14} /> Preference: Morning</div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-amber-200 dark:border-amber-800/50">
                     <button className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">
                       <Check size={16} /> Accept
                     </button>
                     <button className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 text-sm font-medium rounded-lg transition-colors border border-red-200 dark:border-red-900/50">
                       <X size={16} /> Decline
                     </button>
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'accepted' && (
             <div className="p-5 border border-slate-100 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 hover:shadow-md transition-shadow">
               <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-center gap-4">
                     <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50">
                        <span className="text-xs font-bold uppercase tracking-wider">Oct</span>
                        <span className="text-xl font-extrabold leading-none">24</span>
                     </div>
                     <div>
                        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Michael Johnson</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                           <Clock size={14} /> 10:30 AM
                           <span className="mx-1">•</span>
                           <Video size={14} className="text-blue-500" /> Virtual
                        </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                       Start Consultation
                     </button>
                     <button className="px-3 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="View Patient File">
                       <FileText size={18} />
                     </button>
                  </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
