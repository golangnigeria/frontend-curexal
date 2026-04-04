import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  DollarSign,
  Activity,
  Upload,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Hash,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import axios from "axios";
import api from "../../lib/api";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { useDebounce } from "../../hooks/useDebounce";

interface Investigation {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
  code?: string;
  is_active?: boolean;
  lab_specific_price?: number;
}

interface ExcelInvestigation {
  name?: string;
  description?: string;
  category?: string;
  base_price?: string | number;
  code?: string;
  is_active?: string | number | boolean;
  lab_specific_price?: string | number;
}

const AdminInvestigations = () => {
  const [allInvestigations, setAllInvestigations] = useState<Investigation[]>(
    [],
  );
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<Investigation | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: 0,
    category: "General",
    code: "",
    is_active: true,
    lab_specific_price: "",
  });

  const emptyForm = {
    name: "",
    description: "",
    base_price: 0,
    category: "General",
    code: "",
    is_active: true,
    lab_specific_price: "",
  };

  const fetchInvestigations = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      // Use the admin endpoint which returns all investigations
      const response = await api.get(`/admin/investigations`);
      const all: Investigation[] = response.data.investigations || [];
      setAllInvestigations(all);
    } catch (err) {
      console.error("Fetch error:", err);
      let msg =
        "Failed to fetch investigations. Check your session or the backend.";
      if (axios.isAxiosError(err)) {
        msg =
          err.response?.data?.detail ||
          err.response?.data?.title ||
          `API Error: ${err.response?.status ?? err.message}`;
      }
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering and pagination
  useEffect(() => {
    let filtered = allInvestigations;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.name.toLowerCase().includes(q) ||
          inv.category.toLowerCase().includes(q) ||
          inv.description.toLowerCase().includes(q),
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((inv) => inv.category === categoryFilter);
    }
    setPage(1); // reset to page 1 on filter change
    setInvestigations(filtered);
  }, [debouncedSearch, categoryFilter, allInvestigations]);

  useEffect(() => {
    fetchInvestigations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        base_price: formData.base_price,
        category: formData.category,
        is_active: formData.is_active,
        ...(formData.code.trim() ? { code: formData.code.trim() } : {}),
        ...(formData.lab_specific_price !== ""
          ? { lab_specific_price: Number(formData.lab_specific_price) }
          : {}),
      };
      if (editingInv) {
        await api.put(`/admin/investigations/${editingInv.id}`, payload);
        toast.success("Investigation updated successfully");
      } else {
        await api.post("/admin/investigations", payload);
        toast.success("Investigation created successfully");
      }
      setIsModalOpen(false);
      setEditingInv(null);
      setFormData(emptyForm);
      fetchInvestigations();
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Failed to save investigation");
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: "Malaria Test",
        description: "Standard MP test",
        base_price: 2500,
        category: "General",
        code: "MAL-001",
        is_active: true,
        lab_specific_price: 2200,
      },
      {
        name: "Full Blood Count",
        description: "Comprehensive hematology panel",
        base_price: 5000,
        category: "Hematology",
        code: "HEM-001",
        is_active: true,
        lab_specific_price: 4500,
      },
      {
        name: "Urinalysis",
        description: "Standard urine test",
        base_price: 1500,
        category: "Microbiology",
        code: "MIC-001",
        is_active: true,
        lab_specific_price: 1400,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "investigations_template.xlsx");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(buffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<ExcelInvestigation>(ws);

        if (!data || data.length === 0) {
          toast.error("The Excel file is empty or invalid");
          return;
        }

        // Sanitize data before sending: ensure types match backend exactly
        const sanitizedInvestigations = data
          .map((item) => {
            const rawPrice = item.base_price?.toString() || "0";
            const cleanPrice = Number(rawPrice.replace(/[^0-9.]/g, "")) || 0;

            let labPrice: number | undefined = undefined;
            if (item.lab_specific_price !== undefined && item.lab_specific_price !== null && item.lab_specific_price !== "") {
              const cleaned = Number(item.lab_specific_price.toString().replace(/[^0-9.]/g, ""));
              if (!isNaN(cleaned)) labPrice = cleaned;
            }

            let isActive = true;
            if (item.is_active !== undefined && item.is_active !== null) {
              const activeStr = String(item.is_active).toLowerCase().trim();
              isActive = activeStr !== "false" && activeStr !== "0" && activeStr !== "";
            }

            return {
              name: String(item.name || "").trim(),
              description: String(item.description || "").trim(),
              category: String(item.category || "General").trim(),
              base_price: cleanPrice,
              code: (item.code && String(item.code).trim()) ? String(item.code).trim() : undefined,
              is_active: isActive,
              lab_specific_price: labPrice,
            };
          })
          .filter((item) => item.name);

        const response = await api.post("/admin/investigations/bulk", {
          investigations: sanitizedInvestigations,
        });
        const { message } = response.data;
        toast.success(
          message ||
            `Successfully processed ${sanitizedInvestigations.length} investigations`,
        );
        fetchInvestigations();
        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err: unknown) {
        console.error("Upload error:", err);
        let errorMessage =
          "Failed to process Excel file. Ensure it matches the template headers.";
        if (axios.isAxiosError(err)) {
          errorMessage = err.response?.data?.detail || errorMessage;
        }
        toast.error(errorMessage);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleEdit = (inv: Investigation) => {
    setEditingInv(inv);
    setFormData({
      name: inv.name,
      description: inv.description,
      base_price: inv.base_price,
      category: inv.category,
      code: inv.code ?? "",
      is_active: inv.is_active ?? true,
      lab_specific_price:
        inv.lab_specific_price != null ? String(inv.lab_specific_price) : "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this investigation?"))
      return;

    try {
      await api.delete(`/admin/investigations/${id}`);
      toast.success("Investigation deleted successfully");
      fetchInvestigations();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete investigation");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Investigations Manager
          </h1>
          <p className="text-slate-500 mt-1">
            Configure diagnostic products, pricing, and categories for the
            platform.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="h-11 px-4 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Template
          </Button>
          <Button
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="h-11 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all shadow-sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Bulk Import"}
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="h-11 px-6 shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Investigation
          </Button>
        </div>
      </div>

      {/* Professional Search & Filter Bar */}
      <Card className="p-1 px-4 border-slate-200/60 shadow-sm bg-white/50 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-4 py-3">
          <div className="relative flex-1 w-full group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search
                className={`h-4 w-4 transition-colors ${searchQuery ? "text-primary-500" : "text-slate-400"}`}
              />
            </div>
            <input
              type="text"
              placeholder="Search by name, category, or description..."
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 focus:bg-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              className="bg-slate-50 border border-slate-100 text-slate-600 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500/10 transition-all font-medium"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="General">General</option>
              <option value="Hematology">Hematology</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Radiology">Radiology</option>
              <option value="Biochemistry">Biochemistry</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border-slate-200/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Test Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Code</th>
                <th className="px-6 py-4 font-semibold">Base Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Activity className="h-8 w-8 text-primary-500 animate-pulse" />
                      <p className="text-slate-400 text-sm font-medium">
                        Updating list...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-slate-800 font-semibold text-sm">
                          Error loading investigations
                        </p>
                        <p className="text-rose-500 text-xs mt-1 max-w-sm">
                          {fetchError}
                        </p>
                      </div>
                      <button
                        onClick={fetchInvestigations}
                        className="text-xs text-primary-600 underline hover:text-primary-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : investigations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    No investigations found. Add one above to get started.
                  </td>
                </tr>
              ) : (
                investigations
                  .slice((page - 1) * limit, page * limit)
                  .map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex-shrink-0 bg-slate-50 text-primary-600 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors border border-slate-100 flex-shrink-0">
                            <Activity size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {inv.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate max-w-[250px]">
                              {inv.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600 border-none font-medium text-[10px] uppercase tracking-wider"
                        >
                          {inv.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {inv.code ? (
                          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                            <Hash size={10} />
                            {inv.code}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg">
                          ₦{inv.base_price.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {inv.is_active !== false ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(inv)}
                            className="p-2 text-slate-400 hover:text-primary-600 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                            title="Edit Investigation"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                            title="Delete Investigation"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Professional Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-sm text-slate-500 font-medium">
            {investigations.length === 0 ? (
              <span>0 results</span>
            ) : (
              <>
                Showing{" "}
                <span className="text-slate-900">{(page - 1) * limit + 1}</span>{" "}
                to{" "}
                <span className="text-slate-900">
                  {Math.min(page * limit, investigations.length)}
                </span>{" "}
                of{" "}
                <span className="text-slate-900">{investigations.length}</span>{" "}
                results
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 p-0 border-slate-200"
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.ceil(investigations.length / limit) },
                (_, i) => i + 1,
              ).map((p) => {
                if (
                  p === 1 ||
                  p === Math.ceil(investigations.length / limit) ||
                  (p >= page - 1 && p <= page + 1)
                ) {
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all ${
                        page === p
                          ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                          : "text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                } else if (p === page - 2 || p === page + 2) {
                  return (
                    <span key={p} className="px-1 text-slate-300">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page * limit >= investigations.length}
              onClick={() => setPage((p) => p + 1)}
              className="h-9 w-9 p-0 border-slate-200"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Modal for Adding/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingInv ? "Edit Investigation" : "Add New Investigation"}
              </h3>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Investigation Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Malaria Parasite Test"
                />
              </div>

              {/* Code + Category side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Code
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={14}
                    />
                    <Input
                      className="pl-8 font-mono"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="e.g. MAL-001"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>General</option>
                    <option>Hematology</option>
                    <option>Microbiology</option>
                    <option>Radiology</option>
                    <option>Biochemistry</option>
                  </select>
                </div>
              </div>

              {/* Base Price + Lab-Specific Price side-by-side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Base Price (₦) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <Input
                      type="number"
                      required
                      className="pl-9"
                      value={formData.base_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          base_price: Number(e.target.value),
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">
                    Lab-Specific Price (₦)
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                      size={16}
                    />
                    <Input
                      type="number"
                      className="pl-9"
                      value={formData.lab_specific_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lab_specific_price: e.target.value,
                        })
                      }
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Details about the test..."
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">Active</p>
                  <p className="text-xs text-slate-400">
                    Visible to doctors & patients on the platform
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, is_active: !formData.is_active })
                  }
                  className="text-slate-400 hover:text-primary-600 transition-colors"
                >
                  {formData.is_active ? (
                    <ToggleRight size={36} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={36} className="text-slate-300" />
                  )}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  type="button"
                  className="flex-1"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingInv(null);
                    setFormData(emptyForm);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="flex-1">
                  {editingInv ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestigations;
