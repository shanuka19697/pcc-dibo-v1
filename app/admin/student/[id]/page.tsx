"use client";

import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import {
  ArrowLeft, Pencil, Loader2, User, Shield, Monitor,
  Wifi, Cpu, Globe, CheckCircle2, XCircle, Calendar,
  GraduationCap, MapPin, Clock, Smartphone, Laptop
} from "lucide-react";

function InfoRow({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-slate-500 text-sm flex-shrink-0">{label}</span>
      <span className={`text-slate-200 text-sm text-right break-all ${mono ? 'font-mono text-violet-300' : 'font-medium'}`}>
        {value || '—'}
      </span>
    </div>
  );
}

export default function AdminStudentView({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`/api/student-data/${id}`);
        const result = await res.json();
        if (result.success) setData(result.data);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mr-3" size={28} /> Loading record...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <p className="text-lg font-semibold text-white">Record not found</p>
        <Link href="/admin/dashboard" className="text-violet-400 hover:underline text-sm">← Back to Dashboard</Link>
      </div>
    );
  }

  const dev = data.submittedDevice;
  const DeviceIcon = dev?.device === 'Mobile' ? Smartphone : Laptop;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar (simplified) */}
      <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-white/5 flex flex-col z-30">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">PCC Admin</p>
              <p className="text-xs text-slate-500">Student Profile</p>
            </div>
          </div>
        </div>
        <nav className="p-4 flex-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium">
            <ArrowLeft size={16} /> All Students
          </Link>
        </nav>
      </div>

      {/* Main */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">{data.StudentName}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Index #{data.sIndexNum} · Class {data.Class}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${data.Isactive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
              {data.Isactive ? <><CheckCircle2 size={13} /> Active</> : <><XCircle size={13} /> Inactive</>}
            </span>
            <Link
              href={`/admin/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded-xl text-sm font-semibold transition-all"
            >
              <Pencil size={14} /> Edit Record
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <User size={16} className="text-blue-400" />
                </div>
                <h2 className="font-bold text-white">Student Information</h2>
              </div>
              <div className="px-6 py-2">
                <InfoRow label="Full Name" value={data.StudentName} />
                <InfoRow label="Gender" value={data.Gender} />
                <InfoRow label="Index Number" value={String(data.sIndexNum)} mono />
                <InfoRow label="Class" value={data.Class} />
                <InfoRow label="Date" value={new Date(data.Date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
              </div>
            </div>

            {/* Teacher & Agreement */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <GraduationCap size={16} className="text-amber-400" />
                </div>
                <h2 className="font-bold text-white">Teacher & Agreement</h2>
              </div>
              <div className="px-6 py-2">
                <InfoRow label="Teacher" value={`${data.TeacherTitle} ${data.TeacherID}`} />
                <InfoRow label="Agreement End" value={data.AgreementEndDate ? new Date(data.AgreementEndDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—'} />
                <div className="py-3">
                  <p className="text-slate-500 text-sm mb-2">Reason for Enrollment</p>
                  <p className="text-slate-200 text-sm bg-slate-800/50 p-4 rounded-xl leading-relaxed">{data.Reason}</p>
                </div>
                <div className="py-3 border-t border-white/5">
                  <p className="text-slate-500 text-sm mb-2">Agreement</p>
                  <p className="text-slate-300 text-sm italic bg-slate-800/50 p-4 rounded-xl leading-relaxed">"{data.Agreement}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Photo */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
              <div className={`aspect-square flex items-center justify-center relative ${data.Gender === 'Girl' ? 'bg-gradient-to-br from-pink-900/50 to-rose-950' : 'bg-gradient-to-br from-blue-900/50 to-indigo-950'}`}>
                {data.StudentPhoto ? (
                  <img src={data.StudentPhoto} alt={data.StudentName} className="w-full h-full object-cover" />
                ) : (
                  <User size={80} className="text-white/20" strokeWidth={1} />
                )}
              </div>
            </div>

            {/* Device / Submission Info */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                  <Monitor size={16} className="text-violet-400" />
                </div>
                <h2 className="font-bold text-white text-sm">Submission Device</h2>
              </div>
              <div className="p-5 space-y-3">
                {dev?.ip ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Wifi size={14} className="text-violet-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">IP Address</p>
                        <p className="text-violet-300 font-mono text-sm break-all">{dev.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Cpu size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Operating System</p>
                        <p className="text-white text-sm font-semibold">{dev.os}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Globe size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Browser</p>
                        <p className="text-white text-sm font-semibold">{dev.browser}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <DeviceIcon size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Device Type</p>
                        <p className="text-white text-sm font-semibold">{dev.device}</p>
                      </div>
                    </div>
                    {dev.userAgent && (
                      <div className="pt-3 border-t border-white/5">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">User Agent</p>
                        <p className="text-slate-400 font-mono text-[11px] leading-relaxed break-all bg-slate-800/50 p-3 rounded-lg">{dev.userAgent}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center py-6 gap-3 text-slate-600">
                    <Monitor size={32} className="opacity-30" />
                    <p className="text-sm text-center">No device info captured.<br />This record was created before tracking was enabled.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                <div className="w-8 h-8 bg-slate-500/10 rounded-lg flex items-center justify-center">
                  <Clock size={16} className="text-slate-400" />
                </div>
                <h2 className="font-bold text-white text-sm">Timestamps</h2>
              </div>
              <div className="px-5 py-3">
                <InfoRow label="Created" value={data.createdAt ? new Date(data.createdAt).toLocaleString() : '—'} />
                <InfoRow label="Last Updated" value={data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '—'} />
                <InfoRow label="Record ID" value={data._id} mono />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
