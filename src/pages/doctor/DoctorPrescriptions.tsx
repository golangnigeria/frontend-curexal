import { useState } from "react";
import { Search, Send, ShieldAlert, Pill } from "lucide-react";
import api from "../../lib/api";

export const DoctorPrescriptions = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, this would be an async search against the backend API to find patients
  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mocking finding a patient
    const term = e.target.value;
    if (term.length > 3) {
      setPatientName("John Doe");
      setPatientId("fd3b9b9c-xyz");
    } else {
      setPatientName("");
      setPatientId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return alert("Please select a valid patient first.");

    setIsSubmitting(true);
    try {
      await api.post("/doctors/prescriptions/issue", {
        patient_id: patientId,
        medication_name: medication,
        dosage: dosage,
        frequency: frequency,
        duration: duration,
        notes: notes,
      });
      // Reset form
      setMedication("");
      setDosage("");
      setFrequency("");
      setDuration("");
      setNotes("");
      alert("Prescription sent to pharmacy network successfully.");
    } catch (err) {
      console.error("Failed to issue prescription", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-accent-500 lowercase tracking-tighter">
            Issue Prescription
          </h2>
          <p className="text-accent-400 mt-1 font-medium italic">
            Digitally route medications directly to curexal partner pharmacies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Form Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-primary-50 p-6 border-b border-primary-200">
            <label className="block text-sm font-bold text-primary-500 mb-2 uppercase tracking-widest text-[10px]">
              Patient Search
            </label>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="text"
                onChange={handlePatientSearch}
                className="block w-full pl-12 pr-4 py-4 border-none rounded-2xl bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-400 font-bold text-accent-500 placeholder:text-accent-200"
                placeholder="Type Name, Email, or Patient ID..."
              />
            </div>

            {patientName && (
              <div className="mt-4 p-3 bg-white border border-green-200 rounded-lg flex items-center gap-3">
                <div className="h-10 w-10 text-xl font-bold bg-green-50 text-green-700 rounded-full flex justify-center items-center">
                  {patientName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{patientName}</h4>
                  <p className="text-xs text-slate-500">
                    Target selected for prescription
                  </p>
                </div>
              </div>
            )}
          </div>

          <form className="p-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Medication Name & Strength
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Pill size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                    className="w-full pl-10 border border-slate-200 rounded-lg bg-slate-50 min-h-[40px] px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500 text-slate-900"
                    placeholder="e.g. Amoxicillin 500mg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Dosage Form
                </label>
                <input
                  type="text"
                  required
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 min-h-[40px] text-sm focus:ring-1 focus:ring-primary-500 text-slate-900"
                  placeholder="e.g. 1 Capsule"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Frequency
                </label>
                <select
                  required
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-surface sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900"
                >
                  <option value="">Select Frequency...</option>
                  <option value="once_daily">Once Daily (OD)</option>
                  <option value="twice_daily">Twice Daily (BID)</option>
                  <option value="three_times">Three Times a Day (TID)</option>
                  <option value="four_times">Four Times a Day (QID)</option>
                  <option value="as_needed">As Needed (PRN)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-surface sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900"
                  placeholder="e.g. 7 Days"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Additional Instructions for Patient/Pharmacy
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-surface sm:text-sm focus:ring-1 focus:ring-primary-500 text-slate-900"
                  placeholder="Take after a full meal to prevent nausea..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting || !patientId}
                className="flex-1 bg-primary-400 hover:bg-primary-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-400/20 active:scale-95"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} /> Transmit to Pharmacy Array
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-primary-50 rounded-2xl border border-primary-200 p-8 flex flex-col justify-center items-center text-center shadow-sm">
            <div className="h-16 w-16 bg-white text-primary-400 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-12">
              <ShieldAlert size={32} />
            </div>
            <h3 className="font-extrabold text-accent-500 mb-2 lowercase tracking-tighter">
              Automated Verification
            </h3>
            <p className="text-accent-400 text-sm font-medium italic">
              All prescriptions issued through curexal automatically undergo an
              AI conflict check against the patient's existing medication list
              to prevent adverse interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
