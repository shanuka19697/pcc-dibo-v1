"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield, Search, Eye, Pencil, Trash2, Loader2, LogOut,
  Users, UserCheck, UserX, Monitor, RefreshCw, Linkedin, Send
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student-data");
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        setFiltered(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFiltered(students.filter(s =>
      s.StudentName?.toLowerCase().includes(q) ||
      s.TeacherID?.toLowerCase().includes(q) ||
      s.Class?.toLowerCase().includes(q) ||
      String(s.sIndexNum).includes(q)
    ));
  }, [searchQuery, students]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/student-data/${id}`, { method: "DELETE" });
      setStudents(prev => prev.filter(s => s._id !== id));
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const activeCount = students.filter(s => s.Isactive).length;
  const inactiveCount = students.length - activeCount;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-white/5 flex flex-col z-30">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">PCC Admin</p>
              <p className="text-xs text-slate-500">System Control</p>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-1">
          <div className="px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center gap-3 text-violet-300 text-sm font-semibold">
            <Users size={16} /> Student Records
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white">Student Records</h1>
            <p className="text-xs text-slate-500 mt-0.5">{students.length} total records</p>
          </div>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl text-sm transition-all">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </header>

        <main className="flex-1 p-8 space-y-6">
          {/* Developer details */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Developer Details</p>
            <h2 className="text-lg font-bold text-white mt-2">Shanuka Lakshan</h2>
            <p className="text-sm text-violet-300 mt-1">DD Developer</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/shanuka-lakshan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all text-sm font-medium"
              >
                <Linkedin size={15} /> LinkedIn Profile
              </a>
              <a
                href="https://t.me/shanuka_lakshan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition-all text-sm font-medium"
              >
                <Send size={15} /> Telegram Profile
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Students", value: students.length, icon: Users, color: "blue" },
              { label: "Active", value: activeCount, icon: UserCheck, color: "emerald" },
              { label: "Inactive", value: inactiveCount, icon: UserX, color: "rose" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-900/60 border border-white/5 rounded-2xl p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-${color}-500/10`}>
                  <Icon size={20} className={`text-${color}-400`} />
                </div>
                <p className="text-2xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by name, teacher ID, class, or index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
          </div>

          {/* Table */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-500">
                <Loader2 className="animate-spin mr-3" size={24} /> Loading records...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Search size={40} className="mb-4 opacity-30" />
                <p className="font-medium">No records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Index</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map((s) => (
                      <tr key={s._id} className="hover:bg-white/3 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${s.Gender === 'Girl' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'}`}>
                              {s.StudentName?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm leading-tight">{s.StudentName}</p>
                              <p className="text-xs text-slate-500">{s.Gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300 font-mono text-xs">{s.sIndexNum}</td>
                        <td className="px-6 py-4 text-slate-300">{s.Class}</td>
                        <td className="px-6 py-4">
                          <span className="text-slate-300">{s.TeacherTitle} {s.TeacherID}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${s.Isactive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.Isactive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {s.Isactive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {s.submittedDevice?.ip ? (
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5 text-xs">
                                <Monitor size={12} className="text-violet-400 shrink-0" />
                                <span className="text-violet-400 font-mono">{s.submittedDevice.ip}</span>
                              </div>
                              {s.submittedDevice.deviceModel && s.submittedDevice.deviceModel !== 'Unknown' && (
                                <span className="text-slate-500 text-xs pl-0.5">{s.submittedDevice.deviceModel}</span>
                              )}
                              {s.submittedDevice.os && s.submittedDevice.os !== 'Unknown' && (
                                <span className="text-slate-600 text-[10px] pl-0.5">{s.submittedDevice.os}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/student/${s._id}`}
                              className="p-2 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all"
                              title="View"
                            >
                              <Eye size={15} />
                            </Link>
                            <Link
                              href={`/admin/edit/${s._id}`}
                              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </Link>
                            <button
                              onClick={() => setConfirmDelete(s._id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-1">Delete Record?</h3>
            <p className="text-slate-400 text-sm text-center mb-6">This action cannot be undone. The student record will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-sm font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={!!deletingId}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                {deletingId ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
