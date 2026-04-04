import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, User, Building, MapPin, ShieldCheck, Mail } from "lucide-react";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { motion, AnimatePresence } from "framer-motion";

interface PendingDoctor {
  id: string;
  user_id: string;
  specialty: string;
  license_number: string;
  years_of_experience: number;
  verification_status: string;
  bio?: string;
  medical_school: string;
  graduation_year: number;
  languages_spoken: string;
  clinic_address: string;
  user?: {
    name: string;
    email: string;
  };
  documents?: {
    id: string;
    document_type: string;
    cloudinary_url: string;
    uploaded_at: string;
  }[];
}

interface PendingLab {
  id: string;
  name: string;
  address: string;
  contact_email: string;
  license_number: string;
  verification_status: string;
}

const AdminApprovals = () => {
  const [pendingDocs, setPendingDocs] = useState<PendingDoctor[]>([]);
  const [pendingLabs, setPendingLabs] = useState<PendingLab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"doctors" | "laboratories">("doctors");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedDoctor, setSelectedDoctor] = useState<PendingDoctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Map frontend status to backend status
      const docStatus = statusFilter === "approved" ? "verified" : statusFilter;
      const labStatus = statusFilter === "approved" ? "approved" : statusFilter;

      const [labsRes, docsRes] = await Promise.all([
        api.get(`/admin/laboratories?status=${labStatus}`),
        api.get(`/admin/doctors?status=${docStatus}`)
      ]);

      setPendingLabs(labsRes.data.laboratories || []);
      setPendingDocs(docsRes.data.doctors || []);
    } catch {
      toast.error("Failed to fetch clinical providers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleReview = async (type: "doctor" | "lab", id: string, status: "approved" | "rejected") => {
    try {
      if (type === "lab") {
        await api.put("/admin/laboratories/review", { lab_id: id, status });
        toast.success(`Laboratory ${status}`);
      } else {
        // Backend expects 'verified' instead of 'approved'
        const backendStatus = status === "approved" ? "verified" : "rejected";
        await api.put("/admin/verifications/review", { doctor_id: id, status: backendStatus });
        toast.success(`Doctor ${backendStatus}`);
        setIsModalOpen(false);
      }
      fetchData();
    } catch {
      toast.error(`Failed to review ${type}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 leading-none">Approvals & Compliance</h1>
        <p className="text-slate-500 text-sm mt-1">Review onboarding requests from clinical practitioners and diagnostic facilities.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-white p-1.5 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "doctors" ? "bg-primary-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Doctors ({activeTab === "doctors" ? pendingDocs.length : "..."})
          </button>
          <button
            onClick={() => setActiveTab("laboratories")}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "laboratories" ? "bg-primary-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Laboratories ({activeTab === "laboratories" ? pendingLabs.length : "..."})
          </button>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          {(["pending", "approved", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                statusFilter === status 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Scanning for pending requests...</p>
          </div>
        ) : activeTab === "doctors" ? (
          <AnimatePresence mode="wait">
            {pendingDocs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-white rounded-2xl border border-slate-100 italic text-slate-400">
                No pending doctor verifications.
              </motion.div>
            ) : (
              pendingDocs.map((doc) => (
                <Card key={doc.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{doc.user?.name}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-0.5">
                          <Mail size={14} /> {doc.user?.email}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200">
                            {doc.specialty}
                          </Badge>
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1">
                            <ShieldCheck size={12} /> License: {doc.license_number}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        className="bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        onClick={() => {
                          setSelectedDoctor(doc);
                          setIsModalOpen(true);
                        }}
                      >
                        {statusFilter === "pending" ? "Review Details" : "View Profile"}
                      </Button>
                      
                      {statusFilter === "pending" && (
                        <Button
                          variant="primary"
                          className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleReview("doctor", doc.id, "approved")}
                        >
                          <CheckCircle2 size={18} className="mr-2" /> Approve
                        </Button>
                      )}

                      {statusFilter === "approved" && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-sm font-bold">
                          <CheckCircle2 size={16} className="mr-2" /> Verified
                        </Badge>
                      )}

                      {statusFilter === "rejected" && (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200 px-4 py-2 text-sm font-bold">
                          <XCircle size={16} className="mr-2" /> Rejected
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            {pendingLabs.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center bg-white rounded-2xl border border-slate-100 italic text-slate-400">
                No pending laboratory applications.
              </motion.div>
            ) : (
              pendingLabs.map((lab) => (
                <Card key={lab.id} className="p-6 border-l-4 border-l-primary-500">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center">
                        <Building size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{lab.name}</h3>
                        <div className="space-y-1.5 mt-2">
                          <p className="text-slate-500 text-sm flex items-center gap-2">
                            <MapPin size={14} className="text-primary-500" /> {lab.address}
                          </p>
                          <p className="text-slate-500 text-sm flex items-center gap-2">
                            <Mail size={14} className="text-primary-500" /> {lab.contact_email}
                          </p>
                          <p className="text-slate-700 font-medium text-xs bg-slate-100 px-2 py-1 rounded w-fit mt-3">
                            Facility License: {lab.license_number}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {statusFilter === "pending" ? (
                        <>
                          <Button
                            variant="secondary"
                            className="flex-1 md:flex-none border-rose-100 text-rose-600 hover:bg-rose-50"
                            onClick={() => handleReview("lab", lab.id, "rejected")}
                          >
                            <XCircle size={18} className="mr-2" /> Deny
                          </Button>
                          <Button
                            variant="primary"
                            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleReview("lab", lab.id, "approved")}
                          >
                            <CheckCircle2 size={18} className="mr-2" /> Approve
                          </Button>
                        </>
                      ) : (
                        <Badge className={`px-4 py-2 text-sm font-bold flex items-center ${
                          statusFilter === "approved" 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {statusFilter === "approved" ? (
                            <><CheckCircle2 size={16} className="mr-2" /> Approved</>
                          ) : (
                            <><XCircle size={16} className="mr-2" /> Rejected</>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Review Modal */}
      <ReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={selectedDoctor}
        onReview={handleReview}
      />
    </div>
  );
};

const ReviewModal = ({ isOpen, onClose, doctor, onReview }: { 
  isOpen: boolean, 
  onClose: () => void, 
  doctor: PendingDoctor | null,
  onReview: (type: "doctor" | "lab", id: string, status: "approved" | "rejected") => void
}) => {
  if (!doctor) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                  <User size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{doctor.user?.name}</h2>
                  <p className="text-slate-500 font-medium">{doctor.user?.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="bg-primary-50 text-primary-700 border-primary-100">{doctor.specialty}</Badge>
                    <Badge className="bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1">
                      <ShieldCheck size={12} /> {doctor.license_number}
                    </Badge>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
              {/* Bio Section */}
              <section className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Professional Bio</h3>
                <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl italic">
                  "{doctor.bio || "No biography provided."}"
                </p>
              </section>

              {/* Education & Experience */}
              <div className="grid grid-cols-2 gap-8">
                <section className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Education</h3>
                  <div className="space-y-1">
                    <p className="text-slate-900 font-bold">{doctor.medical_school}</p>
                    <p className="text-slate-500 text-sm font-medium">Class of {doctor.graduation_year}</p>
                  </div>
                </section>
                <section className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Experience</h3>
                  <p className="text-slate-900 font-bold">{doctor.years_of_experience} Years Practice</p>
                  <p className="text-slate-500 text-sm font-medium">Languages: {doctor.languages_spoken}</p>
                </section>
              </div>

              {/* Clinic Address */}
              <section className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Primary Clinic Address</h3>
                <div className="flex gap-2 items-start text-slate-600">
                  <MapPin size={18} className="mt-1 text-primary-500 shrink-0" />
                  <p className="font-medium">{doctor.clinic_address}</p>
                </div>
              </section>

              {/* Documents Gallery */}
              <section className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Credentials & Verification Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  {doctor.documents && doctor.documents.length > 0 ? (
                    doctor.documents.map((doc) => (
                      <a 
                        key={doc.id}
                        href={doc.cloudinary_url}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative h-40 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary-400 transition-all flex flex-col items-center justify-center gap-2"
                      >
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:scale-110 transition-transform">
                          <FileTextIcon />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider group-hover:text-primary-600">
                          {doc.document_type.replace('_', ' ')}
                        </span>
                        <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/5 transition-colors" />
                      </a>
                    ))
                  ) : (
                    <div className="col-span-2 py-8 text-center bg-slate-50 rounded-2xl border border-dotted border-slate-200 text-slate-400 text-xs italic">
                      No supporting documents uploaded.
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 flex gap-4">
              <Button
                variant="secondary"
                className="flex-1 h-14 rounded-2xl border-rose-100 text-rose-600 hover:bg-rose-100 font-bold shadow-sm"
                onClick={() => onReview("doctor", doctor.id, "rejected")}
              >
                Reject Application
              </Button>
              <Button
                variant="primary"
                className="flex-[2] h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/20"
                onClick={() => onReview("doctor", doctor.id, "approved")}
              >
                Approve & Verify Credentials
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

export default AdminApprovals;
