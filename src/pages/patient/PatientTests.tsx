import { Activity, Beaker, FileText, Search } from 'lucide-react';

export const PatientTests = () => {
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lab Tests</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Book new tests and view your diagnostic results.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Beaker size={18} />
          Book Lab Test
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-slate-200"
              placeholder="Search past results..."
            />
          </div>
        </div>

        {/* Requested Tests Container */}
        <div className="p-6">
           <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Pending Requests</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 flex justify-between items-start">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Activity size={16} className="text-amber-500" />
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Comprehensive Metabolic Panel</h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Requested by Dr. Jenkins • Oct 22</p>
               </div>
               <span className="px-2 py-1 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Awaiting Sample</span>
             </div>
           </div>

           <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-4">Completed Results</h3>
           
           <div className="space-y-3">
             {/* Mock Result Item */}
             <div className="flex items-center justify-between p-4 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
               <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-primary-600 dark:text-primary-400">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Complete Blood Count (CBC)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sep 15, 2023 • City Center Lab</p>
                  </div>
               </div>
               <div className="text-right flex items-center gap-3">
                 <span className="hidden sm:inline-block text-xs font-medium text-green-600 dark:text-green-400">Normal Range</span>
                 <button className="text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:underline">
                   View PDF
                 </button>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PatientTests;
