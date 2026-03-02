import { Clock, Bell, Plus, CheckCircle2 } from "lucide-react";

export const PatientReminders = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Medication Reminders
          </h2>
          <p className="text-slate-500 mt-1">
            Never miss a dose. Manage your daily scheduled intakes.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={18} />
          Add Reminder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Reminders */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-6">
            <Bell className="text-amber-500" size={20} /> Today's Schedule
          </h3>

          <div className="space-y-4">
            {/* Reminder Item - Pending */}
            <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 flex justify-between items-center group">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">
                  Lisinopril 10mg
                </h4>
                <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> 08:00 AM -
                  After Breakfast
                </p>
              </div>
              <button
                className="h-10 w-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 hover:border-green-500 hover:text-green-500 transition-colors bg-white shadow-sm"
                aria-label="Mark taken"
              >
                <CheckCircle2 size={24} />
              </button>
            </div>

            {/* Reminder Item - Taken */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center opacity-60">
              <div>
                <h4 className="font-bold text-slate-800 text-lg line-through">
                  Vitamin D3
                </h4>
                <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> 07:00 AM - With
                  Meal
                </p>
              </div>
              <div className="h-10 w-10 flex items-center justify-center text-green-500">
                <CheckCircle2 size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Link Notice */}
        <div className="bg-primary-50 rounded-2xl border border-primary-100 p-6 flex flex-col justify-center items-center text-center">
          <div className="h-16 w-16 bg-white rounded-full shadow-md flex items-center justify-center mb-4 text-primary-500">
            <Clock size={32} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-2">
            Automated Scheduling
          </h3>
          <p className="text-slate-600 max-w-sm mb-6">
            When a doctor issues a prescription through Curexal, smart reminders
            are automatically added to your daily schedule based on the
            prescribed dosage frequency.
          </p>
          <button className="px-5 py-2 bg-white text-primary-600 font-semibold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            View Active Prescriptions
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientReminders;
