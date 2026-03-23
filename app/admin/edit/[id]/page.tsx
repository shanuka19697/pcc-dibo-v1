"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, Shield, User, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";
import ImageUpload from "@/components/ImageUpload";

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const [formData, setFormData] = useState({
    Date: "",
    StudentName: "",
    Class: "",
    StudentPhoto: "",
    Gender: "Boy",
    sIndexNum: "",
    Reason: "",
    TeacherID: "",
    TeacherTitle: "Sir",
    Agreement: "",
    AgreementEndDate: "",
    Isactive: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/student-data/${id}`);
        const result = await res.json();
        if (result.success) {
          const data = result.data;
          data.Date = new Date(data.Date).toISOString().split('T')[0];
          if (data.AgreementEndDate) {
            data.AgreementEndDate = new Date(data.AgreementEndDate).toISOString().split('T')[0];
          }
          setFormData(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/student-data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        setToast({ type: 'success', msg: 'Record updated successfully!' });
        setTimeout(() => router.push(`/admin/student/${id}`), 1500);
      } else {
        setToast({ type: 'error', msg: result.message || 'Update failed.' });
      }
    } catch {
      setToast({ type: 'error', msg: 'Failed to update.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mr-3" size={28} /> Loading record...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-white/5 flex flex-col z-30">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">PCC Admin</p>
              <p className="text-xs text-slate-500">Edit Record</p>
            </div>
          </div>
        </div>
        <nav className="p-4 flex-1 space-y-1">
          <Link href={`/admin/student/${id}`} className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium">
            <ArrowLeft size={16} /> Back to Profile
          </Link>
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium">
            <Shield size={16} /> All Students
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Edit Student Record</h1>
            <p className="text-slate-500 text-sm mt-0.5">{formData.StudentName}</p>
          </div>
          {/* Active toggle — admin can always toggle */}
          <label className="flex items-center gap-3 px-5 py-2.5 bg-slate-900 border border-white/10 rounded-xl cursor-pointer">
            <span className="text-sm font-semibold text-slate-400">Status</span>
            <div className="relative inline-flex items-center">
              <input type="checkbox" name="Isactive" checked={formData.Isactive} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-700 peer-checked:bg-emerald-500 rounded-full transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
            </div>
            <span className={`text-sm font-bold ${formData.Isactive ? 'text-emerald-400' : 'text-slate-500'}`}>
              {formData.Isactive ? 'Active' : 'Inactive'}
            </span>
          </label>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            {toast.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">Basic Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date *</label>
                <input type="date" name="Date" value={formData.Date} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name *</label>
                <input type="text" name="StudentName" value={formData.StudentName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class *</label>
                <input type="text" name="Class" value={formData.Class} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Index Number *</label>
                <input type="number" name="sIndexNum" value={formData.sIndexNum} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender *</label>
                <div className="flex gap-4">
                  {['Boy', 'Girl'].map(g => (
                    <button key={g} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, Gender: g }))}
                      className={`flex-1 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${formData.Gender === g ? (g === 'Boy' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-pink-600 border-pink-600 text-white') : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'}`}>
                      <User size={14} className={g === 'Girl' ? 'scale-x-[-1]' : ''} /> {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Photo */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">Student Photo</h2>
            </div>
            <div className="p-6">
              <ImageUpload
                value={formData.StudentPhoto}
                onChange={(url) => setFormData(prev => ({ ...prev, StudentPhoto: url }))}
              />
            </div>
          </div>

          {/* Section 3: Teacher & Agreement */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-bold text-white">Teacher & Agreement</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher ID *</label>
                <input type="text" name="TeacherID" value={formData.TeacherID} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm uppercase focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Honorific *</label>
                <div className="flex gap-4">
                  {['Sir', 'Madam'].map(t => (
                    <button key={t} type="button"
                      onClick={() => setFormData(prev => ({ ...prev, TeacherTitle: t }))}
                      className={`flex-1 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.TeacherTitle === t ? 'bg-violet-600 border-violet-600 text-white shadow-lg' : 'bg-slate-800 border-white/10 text-slate-400 hover:border-white/20'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason *</label>
                <input type="text" name="Reason" value={formData.Reason} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agreement End Date *</label>
                <input type="date" name="AgreementEndDate" value={formData.AgreementEndDate} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Agreement Details *</label>
                <textarea name="Agreement" rows={4} value={formData.Agreement} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-800/70 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-y" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-2">
            <Link href={`/admin/student/${id}`} className="px-6 py-2.5 border border-white/10 text-slate-400 hover:text-white rounded-xl text-sm font-medium transition-all">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
