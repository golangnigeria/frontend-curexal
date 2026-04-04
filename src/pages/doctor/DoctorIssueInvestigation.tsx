import { useState, useEffect } from "react";
import { Search, Send, Beaker, CheckCircle2, Building2, Plus, X } from "lucide-react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";

interface Laboratory {
  id: string;
  name: string;
  address: string;
}

interface Investigation {
  id: string;
  name: string;
  base_price: number;
}

const DoctorIssueInvestigation = () => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [selectedLabId, setSelectedLabId] = useState("");
  const [selectedInvs, setSelectedInvs] = useState<Investigation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [patientResults, setPatientResults] = useState<any[]>([]);
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labsRes, invsRes] = await Promise.all([
          api.get("/laboratories/approved"),
          api.get("/investigations")
        ]);
        setLaboratories(labsRes.data.laboratories || []);
        setInvestigations(invsRes.data.investigations || []);
      } catch (err) {
        toast.error("Failed to load clinical data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (patientSearchQuery.length < 2) {
        setPatientResults([]);
        return;
      }
      setIsSearchingPatient(true);
      try {
        const res = await api.get(`/patients/search?q=${patientSearchQuery}`);
        setPatientResults(res.data.patients || []);
      } catch (err) {
        toast.error("Failed to search patients");
      } finally {
        setIsSearchingPatient(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [patientSearchQuery]);

  const selectPatient = (patient: any) => {
    setPatientId(patient.id);
    setPatientName(patient.name);
    setPatientResults([]);
    setPatientSearchQuery("");
  };

  const toggleInv = (inv: Investigation) => {
    if (selectedInvs.find(i => i.id === inv.id)) {
      setSelectedInvs(selectedInvs.filter(i => i.id !== inv.id));
    } else {
      setSelectedInvs([...selectedInvs, inv]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !selectedLabId || selectedInvs.length === 0) {
      toast.warning("Please complete all selection fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/investigations/prescriptions/issue", {
        patient_id: patientId,
        laboratory_id: selectedLabId,
        investigation_ids: selectedInvs.map(i => i.id)
      });
      
      toast.success("Investigation issued! Code: " + response.data.code);
      // Reset
      setSelectedInvs([]);
      setSelectedLabId("");
      setPatientName("");
      setPatientId("");
    } catch (err) {
      toast.error("Failed to issue investigation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Issue Investigation</h1>
        <p className="text-slate-500 text-sm mt-1">Generate diagnostic test orders for patients to redeem at partner labs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          {/* Patient Selection */}
          <Card className="p-6 overflow-visible">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">1. Identify Patient</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <Input 
                placeholder="Search patient by Name, Email or Registration Number..." 
                className="pl-12 h-14 text-lg border-slate-200"
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
              />
              
              {patientResults.length > 0 && (
                <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {patientResults.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => selectPatient(p)}
                      className="p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-xs text-slate-500">{p.email}</p>
                        </div>
                        {p.patient_profile?.registration_number && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {p.patient_profile.registration_number}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isSearchingPatient && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                </div>
              )}
            </div>
            {patientName && (
              <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100 flex items-center gap-3">
                <CheckCircle2 className="text-primary-600" size={20} />
                <span className="font-semibold text-primary-900">Selected: {patientName}</span>
              </div>
            )}
          </Card>

          {/* Laboratory Selection */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">2. Select Laboratory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {laboratories.map((lab) => (
                <div 
                  key={lab.id}
                  onClick={() => setSelectedLabId(lab.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                    selectedLabId === lab.id 
                    ? "border-primary-600 bg-primary-50 shadow-md" 
                    : "border-slate-100 hover:border-slate-200"
                  }`}
                >
                  <Building2 className={selectedLabId === lab.id ? "text-primary-600" : "text-slate-400"} size={20} />
                  <div>
                    <p className={`font-bold text-sm ${selectedLabId === lab.id ? "text-primary-900" : "text-slate-700"}`}>{lab.name}</p>
                    <p className="text-xs text-slate-400 truncate w-40">{lab.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Investigation Selection */}
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">3. Diagnostic Tests</h3>
            <div className="relative mb-4">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                type="text" 
                placeholder="Filter tests..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50/50"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
               />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {investigations.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())).map((inv) => (
                <button
                  key={inv.id}
                  onClick={() => toggleInv(inv)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                    selectedInvs.find(i => i.id === inv.id)
                    ? "bg-primary-600 border-primary-600 text-white shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  <span className="truncate mr-2">{inv.name}</span>
                  {selectedInvs.find(i => i.id === inv.id) ? <X size={14} /> : <Plus size={14} className="text-slate-400" />}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Selection Summary Side Column */}
        <div className="space-y-6">
          <Card className="p-6 border-0 shadow-xl bg-slate-900 text-white sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Prescription Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm">Patient</span>
                <span className="font-bold text-right">{patientName || "--"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm">Lab</span>
                <span className="font-bold text-right truncate w-32">{laboratories.find(l => l.id === selectedLabId)?.name || "--"}</span>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <span className="text-slate-400 text-xs block mb-2 font-bold uppercase">Clinical Orders ({selectedInvs.length})</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedInvs.map(inv => (
                    <div key={inv.id} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg text-xs">
                      <span className="truncate w-32 font-medium">{inv.name}</span>
                      <button onClick={() => toggleInv(inv)} className="text-slate-500 hover:text-white">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {selectedInvs.length === 0 && <p className="text-slate-500 italic text-xs">No tests selected</p>}
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-14 bg-primary-500 hover:bg-primary-600 text-white border-0 shadow-lg shadow-primary-500/20"
              disabled={isSubmitting || !patientId || !selectedLabId || selectedInvs.length === 0}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Generating..." : "Generate Code & Send"}
              {!isSubmitting && <Send className="ml-2" size={18} />}
            </Button>
            
            <p className="mt-4 text-[10px] text-slate-500 text-center uppercase tracking-tighter">
              Patient will receive notification containing retrieval code
            </p>
          </Card>

          <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 flex gap-4">
             <div className="bg-primary-600 p-2 rounded-lg h-fit text-white">
                <Beaker size={20} />
             </div>
             <div>
                <h4 className="font-bold text-primary-900 text-sm">Quick Tip</h4>
                <p className="text-primary-700 text-xs mt-1 leading-relaxed">
                  Only laboratories approved by the Curexal Clinical Board are available for selection. 
                  Final test prices include a standard 3% platform fee.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorIssueInvestigation;
