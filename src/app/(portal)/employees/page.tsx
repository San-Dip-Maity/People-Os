"use client";

import * as React from "react";
import {
  Search,
  Plus,
  Building2,
  MapPin,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "@/components/ui/toast";
interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  legalEntity: string;
  workLocation: string;
  employmentType: string;
  status: "ACTIVE" | "PROBATION" | "NOTICE";
  joinDate: string;
  manager: string;
  avatar: string;
}

const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    code: "EMP-0101",
    name: "Sarah Connor",
    email: "sarah.connor@acme.com",
    phone: "+971 50 123 4567",
    department: "Engineering",
    designation: "Lead Infrastructure Architect",
    legalEntity: "Acme Holdings UAE Ltd",
    workLocation: "Dubai Internet City",
    employmentType: "Full-Time Permanent",
    status: "ACTIVE",
    joinDate: "2023-04-15",
    manager: "Marcus Vance",
    avatar: "SC",
  },
  {
    id: "emp-2",
    code: "EMP-0102",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@acme.com",
    phone: "+91 98450 12345",
    department: "Engineering",
    designation: "Senior Full Stack Engineer",
    legalEntity: "Acme Holdings UAE Ltd", // Employed by UAE entity
    workLocation: "Bengaluru Tech Park", // Working from India
    employmentType: "Full-Time Permanent",
    status: "ACTIVE",
    joinDate: "2024-01-10",
    manager: "Sarah Connor",
    avatar: "RK",
  },
  {
    id: "emp-3",
    code: "EMP-0103",
    name: "Daniel Lee",
    email: "daniel.lee@acme.com",
    phone: "+1 415 555 2671",
    department: "Product",
    designation: "Principal Product Manager",
    legalEntity: "Acme Americas Delaware Corp",
    workLocation: "New York / Remote",
    employmentType: "Full-Time Permanent",
    status: "PROBATION",
    joinDate: "2026-05-18",
    manager: "Alex Morgan",
    avatar: "DL",
  },
  {
    id: "emp-4",
    code: "EMP-0104",
    name: "Elena Rostova",
    email: "elena.rostova@acme.com",
    phone: "+971 52 987 6543",
    department: "Human Resources",
    designation: "People Operations Lead",
    legalEntity: "Acme Holdings UAE Ltd",
    workLocation: "Dubai Internet City",
    employmentType: "Full-Time Permanent",
    status: "ACTIVE",
    joinDate: "2022-09-01",
    manager: "Alex Morgan",
    avatar: "ER",
  },
  {
    id: "emp-5",
    code: "EMP-0105",
    name: "Aisha Al-Mansoor",
    email: "aisha.mansoor@acme.com",
    phone: "+971 54 321 0987",
    department: "Finance",
    designation: "Financial Controller",
    legalEntity: "Acme Holdings UAE Ltd",
    workLocation: "Dubai Internet City",
    employmentType: "Full-Time Permanent",
    status: "PROBATION",
    joinDate: "2026-05-24",
    manager: "Marcus Vance",
    avatar: "AA",
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = React.useState<Employee[]>(mockEmployees);
  const [search, setSearch] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("ALL");
  const [entityFilter, setEntityFilter] = React.useState("ALL");
  const [selectedEmp, setSelectedEmp] = React.useState<Employee | null>(null);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Load from database on mount
  React.useEffect(() => {
    async function loadEmployees() {
      try {
        const res = await fetch("/api/employees");
        if (res.ok) {
          const data = await res.json();
          if (data.employees && data.employees.length > 0) {
            setEmployees(data.employees);
          }
        }
      } catch (err) {
        console.error("Failed to load employees from DB:", err);
      }
    }
    loadEmployees();
  }, []);

  // New employee form state
  const [newForm, setNewForm] = React.useState({
    name: "",
    email: "",
    department: "Engineering",
    designation: "",
    legalEntity: "Acme Holdings UAE Ltd",
    workLocation: "Dubai Internet City",
  });

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.code.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;
    const matchesEntity =
      entityFilter === "ALL" || emp.legalEntity === entityFilter;
    return matchesSearch && matchesDept && matchesEntity;
  });

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email) {
      toast.warning("Incomplete Information", "Full name and corporate email are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newForm.name,
          email: newForm.email,
          department: newForm.department,
          designation: newForm.designation || "Associate",
          legalEntity: newForm.legalEntity,
          workLocation: newForm.workLocation,
          status: "PROBATION",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("Onboarding Failed", data.error || "Failed to persist employee record.");
        return;
      }

      setEmployees((prev) => [data.employee, ...prev]);
      setAddModalOpen(false);
      setNewForm({
        name: "",
        email: "",
        department: "Engineering",
        designation: "",
        legalEntity: "Acme Holdings UAE Ltd",
        workLocation: "Dubai Internet City",
      });
      toast.success(
        "Employee Onboarded",
        `Employee ${data.employee.name} (${data.employee.code}) saved to database successfully.`
      );
    } catch (err) {
      console.error("Employee creation error:", err);
      toast.error("Network Error", "Could not reach database API.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="title-page text-[#071B2B] dark:text-[#f0f7f9] flex items-center gap-2">
              Employee Directory & Lifecycle
            </h1>
            <p className="text-supporting text-zinc-500 dark:text-zinc-400">
              Manage workforce records, effective-dated assignments, and employment status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddModalOpen(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20 focus:border-[#167D8D]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Filter by department"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              aria-label="Filter by legal entity"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
            >
              <option value="ALL">All Legal Entities</option>
              <option value="Acme Holdings UAE Ltd">Acme UAE Ltd</option>
              <option value="Acme Americas Delaware Corp">Acme Americas Corp</option>
            </select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="rounded-xl border border-[#EEEEEE] dark:border-[#163854] bg-white dark:bg-[#0c263d] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafafa] dark:bg-[#071B2B] border-b border-[#EEEEEE] dark:border-[#163854] text-zinc-500 dark:text-zinc-400 uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Employee</th>
                  <th className="px-5 py-3.5">Role & Department</th>
                  <th className="px-5 py-3.5">Legal Entity</th>
                  <th className="px-5 py-3.5">Work Location</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] dark:divide-[#163854]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-zinc-500">
                      No matching employee records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => setSelectedEmp(emp)}
                      className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#B9E4E8] dark:bg-[#12334f] text-[#071B2B] dark:text-[#B9E4E8] font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-[#071B2B] dark:text-[#f0f7f9]">
                            {emp.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            {emp.code}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">
                          {emp.designation}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {emp.department}
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-zinc-700 dark:text-zinc-300">
                        {emp.legalEntity}
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          {emp.workLocation}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            emp.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <span className="text-[#167D8D] dark:text-[#B9E4E8] font-medium hover:underline inline-flex items-center gap-1">
                          View Profile <ChevronRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Employee Detail Slide-Over Drawer */}
        {selectedEmp && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => setSelectedEmp(null)}
            />
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0c263d] h-full shadow-2xl z-10 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-[#EEEEEE] dark:border-[#163854]">
              <div className="p-6 border-b border-[#EEEEEE] dark:border-[#163854] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#071B2B] dark:text-[#f0f7f9]">
                    Employee Profile
                  </h3>
                  <p className="text-xs text-zinc-500">{selectedEmp.code}</p>
                </div>
                <button
                  onClick={() => setSelectedEmp(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 flex-1">
                {/* Header card */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#fafafa] dark:bg-[#0a2134] border border-[#EEEEEE] dark:border-[#163854]">
                  <div className="w-14 h-14 rounded-full bg-[#167D8D] text-white font-bold text-lg flex items-center justify-center shrink-0">
                    {selectedEmp.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                      {selectedEmp.name}
                    </h4>
                    <p className="text-xs text-zinc-500">{selectedEmp.designation}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {selectedEmp.status}
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Joined: {selectedEmp.joinDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Organizational Assignment Rule Callout */}
                <div className="p-4 rounded-xl border border-[#B9E4E8] dark:border-[#163854] bg-[#eaf7f9] dark:bg-[#0a2134] space-y-2">
                  <div className="text-xs font-semibold text-[#071B2B] dark:text-[#B9E4E8] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Effective Organizational Assignment
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1">
                    <p>
                      <strong>Legal Entity (Contractual):</strong> {selectedEmp.legalEntity}
                    </p>
                    <p>
                      <strong>Physical Work Location:</strong> {selectedEmp.workLocation}
                    </p>
                    <p className="text-[#071B2B] dark:text-[#B9E4E8] pt-1 border-t border-[#B9E4E8]/60 dark:border-[#163854]">
                      Notice: Holiday calendar assigned based on physical Work Location ({selectedEmp.workLocation}), independent of employing entity.
                    </p>
                  </div>
                </div>

                {/* Contact & Reporting */}
                <div className="space-y-3">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Contact & Reporting Hierarchy
                  </h5>
                  <div className="space-y-2 text-xs divide-y divide-[#EEEEEE] dark:divide-[#163854]">
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-500">Corporate Email:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {selectedEmp.email}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-500">Phone:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {selectedEmp.phone}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-500">Reporting Manager:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {selectedEmp.manager}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-zinc-500">Employment Contract:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {selectedEmp.employmentType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#EEEEEE] dark:border-[#163854] flex gap-2">
                <button
                  onClick={() => setSelectedEmp(null)}
                  className="flex-1 py-2 px-3 rounded-lg border border-[#EEEEEE] dark:border-[#163854] text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setAddModalOpen(false)}
            />
            <div className="relative w-full max-w-md bg-white dark:bg-[#0c263d] rounded-2xl shadow-2xl border border-[#EEEEEE] dark:border-[#163854] overflow-hidden z-10 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#163854]">
                <h3 className="font-bold text-sm text-[#071B2B] dark:text-[#f0f7f9]">
                  Onboard New Employee
                </h3>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.name}
                    onChange={(e) =>
                      setNewForm({ ...newForm, name: e.target.value })
                    }
                    placeholder="e.g. Liam Gallagher"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newForm.email}
                    onChange={(e) =>
                      setNewForm({ ...newForm, email: e.target.value })
                    }
                    placeholder="e.g. liam.g@acme.com"
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none focus:ring-2 focus:ring-[#167D8D]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Department
                    </label>
                    <select
                      value={newForm.department}
                      onChange={(e) =>
                        setNewForm({ ...newForm, department: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    >
                      <option>Engineering</option>
                      <option>Product</option>
                      <option>Human Resources</option>
                      <option>Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={newForm.designation}
                      onChange={(e) =>
                        setNewForm({ ...newForm, designation: e.target.value })
                      }
                      placeholder="e.g. DevOps Engineer"
                      className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Legal Employing Entity
                  </label>
                  <select
                    value={newForm.legalEntity}
                    onChange={(e) =>
                      setNewForm({ ...newForm, legalEntity: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  >
                    <option>Acme Holdings UAE Ltd</option>
                    <option>Acme Americas Delaware Corp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Work Location (Determines Holiday Calendar)
                  </label>
                  <select
                    value={newForm.workLocation}
                    onChange={(e) =>
                      setNewForm({ ...newForm, workLocation: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] bg-[#fafafa] dark:bg-[#0a2134] text-[#071B2B] dark:text-[#f0f7f9] focus:outline-none"
                  >
                    <option>Dubai Internet City</option>
                    <option>Bengaluru Tech Park</option>
                    <option>New York / Remote</option>
                  </select>
                </div>

                <div className="pt-3 flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-3 py-2 rounded-lg border border-[#EEEEEE] dark:border-[#163854] text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Create Employee"
                    )}
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
