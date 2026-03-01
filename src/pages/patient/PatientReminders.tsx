import { Clock, Bell, Plus, CheckCircle2 } from 'lucide-react';

export const PatientReminders = () => {
  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Medication Reminders</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Never miss a dose. Manage your daily scheduled intakes.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={18} />
          Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Reminders */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
           <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-6">
              <Bell className="text-amber-500" size={20} /> Today's Schedule
           </h3>

           <div className="space-y-4">
              
              {/* Reminder Item - Pending */}
              <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500 flex justify-between items-center group">
                 <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Lisinopril 10mg</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" /> 08:00 AM - After Breakfast
                    </p>
                 </div>
                 <button className="h-10 w-10 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-300 hover:border-green-500 hover:text-green-500 transition-colors bg-white dark:bg-slate-900 shadow-sm" aria-label="Mark taken">
                    <CheckCircle2 size={24} />
                 </button>
              </div>

              {/* Reminder Item - Taken */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center opacity-60">
                 <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg line-through">Vitamin D3</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={14} className="text-slate-400" /> 07:00 AM - With Meal
                    </p>
                 </div>
                 <div className="h-10 w-10 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={32} />
                 </div>
              </div>

           </div>
        </div>

        {/* Prescription Link Notice */}
        <div className="bg-linear-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl border border-primary-100 dark:border-primary-900/50 p-6 flex flex-col justify-center items-center text-center">
           <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-4 text-primary-500">
             <Clock size={32} />
           </div>
           <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-2">Automated Scheduling</h3>
           <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6">
             When a doctor issues a prescription through Curexal, smart reminders are automatically added to your daily schedule based on the prescribed dosage frequency.
           </p>
           <button className="px-5 py-2 bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-semibold rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
             View Active Prescriptions
           </button>
        </div>

      </div>
    </div>
  );
};

export default PatientReminders;
