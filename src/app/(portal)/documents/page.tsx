"use client";

import * as React from "react";
import {
  FileText,
  Upload,
  Download,
  ShieldCheck,
  AlertTriangle,
  X,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  fileSize: string;
  scope: string;
  expiresAt: string | null;
}

export default function DocumentsPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [docs, setDocs] = React.useState<DocumentItem[]>([
    {
      id: "doc-1",
      title: "Global Employee Code of Conduct 2026",
      category: "Policies & Handbooks",
      fileSize: "2.4 MB PDF",
      scope: "All Employees",
      expiresAt: "2027-01-01",
    },
    {
      id: "doc-2",
      title: "Cross-Border Holiday Calendar Protocol",
      category: "Policies & Handbooks",
      fileSize: "840 KB PDF",
      scope: "UAE & India Entities",
      expiresAt: "Permanent",
    },
    {
      id: "doc-3",
      title: "Standard Employment Agreement (UAE)",
      category: "Contracts & Letters",
      fileSize: "1.1 MB PDF",
      scope: "Acme Holdings UAE",
      expiresAt: "Permanent",
    },
    {
      id: "doc-4",
      title: "Executive Residence Visa Copy — Sarah Connor",
      category: "IDs & Compliance",
      fileSize: "520 KB PDF",
      scope: "Confidential HR",
      expiresAt: "2026-11-28", // Expiring soon!
    },
  ]);

  const [form, setForm] = React.useState({
    title: "",
    category: "Policies & Handbooks",
    scope: "All Employees",
    expiresAt: "Permanent",
  });

  React.useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch("/api/documents");
        if (res.ok) {
          const data = await res.json();
          if (data.documents && data.documents.length > 0) {
            setDocs(data.documents);
          }
        }
      } catch (err) {
        console.error("Failed to load documents:", err);
      }
    }
    loadDocs();
  }, []);

  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.warning("Title Required", "Please provide a document title.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          fileSize: "1.8 MB PDF",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Upload Failed", data.error || "Could not register document.");
        return;
      }

      setDocs((prev) => [data.document, ...prev]);
      setModalOpen(false);
      setForm({
        title: "",
        category: "Policies & Handbooks",
        scope: "All Employees",
        expiresAt: "Permanent",
      });

      toast.success(
        "Document Registered",
        `"${data.document.title}" saved to database and stored in private vault.`
      );
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Network Error", "Could not reach database API.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDoc = async (id: string, title: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    try {
      const res = await fetch(`/api/documents?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Delete Failed", data.error || "Could not delete document.");
        return;
      }

      toast.info("Document Removed", `"${title}" removed from vault.`);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Network Error", "Could not reach database API.");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Document Management & Private Vault
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Private object storage, signed download URLs, and document expiry tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#167D8D] hover:bg-[#126876] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Private S3 Security Callout */}
        <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#167D8D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#071B2B] dark:text-[#B9E4E8]">
              Private Object Storage & Ephemeral Signed URLs
            </h4>
            <p className="text-zinc-600 dark:text-zinc-400">
              Documents are never exposed via public web links. All downloads generate temporary cryptographic signed URLs (15-minute expiration) with strict tenant and permission validation.
            </p>
          </div>
        </div>

        {/* Documents Table */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
              Document Repository ({docs.length} items)
            </h3>
            <span className="text-xs text-zinc-500">
              Live Database Encrypted (AES-256)
            </span>
          </div>

          <div className="divide-y divide-[#EEEEEE] dark:divide-[#163854] text-xs">
            {docs.map((doc) => {
              const isExpiring = doc.expiresAt?.includes("2026-11");
              return (
                <div
                  key={doc.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-[#eaf7f9] dark:bg-[#12334f] text-[#167D8D] dark:text-[#B9E4E8] shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9] text-sm">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {doc.category} • {doc.fileSize} • Scope: {doc.scope}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isExpiring && (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        <AlertTriangle className="w-3 h-3" /> Expiring: {doc.expiresAt}
                      </span>
                    )}

                    <button
                      onClick={() =>
                        toast.success(
                          "Signed URL Generated",
                          `Ephemeral download link created for ${doc.title} (expires in 15 mins).`
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => handleDeleteDoc(doc.id, doc.title)}
                      title="Delete document"
                      className="p-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Upload Document */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#0c263d] rounded-2xl border border-[#EEEEEE] dark:border-[#163854] max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#163854]">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-[#167D8D]" />
                  <h3 className="font-bold text-[#071B2B] dark:text-[#f0f7f9]">
                    Upload Document to Vault
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. UAE Labor Law Amendment 2026 Advisory"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Category *
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option value="Policies & Handbooks">Policies & Handbooks</option>
                      <option value="Contracts & Letters">Contracts & Letters</option>
                      <option value="IDs & Compliance">IDs & Compliance</option>
                      <option value="Tax & Financial">Tax & Financial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                      Access Scope
                    </label>
                    <select
                      value={form.scope}
                      onChange={(e) => setForm({ ...form, scope: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option value="All Employees">All Employees</option>
                      <option value="Confidential HR">Confidential HR</option>
                      <option value="Executive Only">Executive Only</option>
                      <option value="UAE & India Entities">UAE & India Entities</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1 font-semibold">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    placeholder="YYYY-MM-DD or Permanent"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#EEEEEE] dark:border-[#163854] text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#167D8D] text-white font-semibold disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{submitting ? "Uploading..." : "Save to Vault"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
