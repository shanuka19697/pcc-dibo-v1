"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, UploadCloud, X, ArrowLeft, Loader2, CheckCircle2, User, Baby, AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";
import ImageUpload from "@/components/ImageUpload";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

export default function EditDataPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Use React.use() to unwrap the params promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

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

  // Modal & Dirty State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const [recordRes, authRes] = await Promise.all([
          fetch(`/api/student-data/${id}`),
          fetch("/api/auth/me")
        ]);
        
        const authData = await authRes.json();
        if (authData.success) setUserRole(authData.role);

        const result = await recordRes.json();
        if (result.success) {
          const data = result.data;
          data.Date = new Date(data.Date).toISOString().split('T')[0];
          if (data.AgreementEndDate) {
             data.AgreementEndDate = new Date(data.AgreementEndDate).toISOString().split('T')[0];
          }
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setIsDirty(true);
  };

  const setGender = (gender: string) => {
    setFormData(prev => ({ ...prev, Gender: gender }));
    setIsDirty(true);
  };

  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      router.push("/view-data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`/api/student-data/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccessModalOpen(true);
        setIsDirty(false);
      } else {
        alert("Error updating: " + result.message);
      }
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update record.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
         <Loader2 className="animate-spin mb-4 text-brand-500" size={40} />
         <p className="font-medium animate-pulse">Retrieving Record...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
           <Link href="/view-data" className="text-brand-600 hover:text-brand-800 font-medium text-sm flex items-center gap-1 mb-2">
            <ArrowLeft size={16} /> {language === "si" ? "දත්ත ගබඩාව වෙත ආපසු" : "Back to Database"}
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t("form_edit_header")}</h1>
          <p className="text-slate-500 mt-1">{t("form_subheader_edit")}</p>
        </div>
        
        {/* Status Toggle Header */}
        <div className="glass-panel px-6 py-3 flex items-center gap-4 bg-white shadow-sm border border-slate-200 rounded-full">
           <span className="text-sm font-semibold text-slate-700">{t("label_status")}</span>
           <label className={`relative inline-flex flex-col sm:flex-row items-start sm:items-center ${userRole !== 'principal' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
              <div className="relative inline-flex items-center">
                <input type="checkbox" name="Isactive" checked={formData.Isactive} onChange={handleChange} disabled={userRole !== 'principal'} className="sr-only peer" />
                <div className={`w-14 h-7 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all ${userRole !== 'principal' ? 'bg-slate-300 peer-checked:bg-emerald-300' : 'bg-slate-200 peer-checked:bg-emerald-500'}`}></div>
              </div>
              <div className="ml-0 sm:ml-3 mt-1 sm:mt-0 flex flex-col">
                <span className={`text-sm font-bold ${formData.Isactive ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {formData.Isactive ? t("status_active") : t("status_inactive")}
                </span>
                {userRole !== 'principal' && <span className="text-[10px] text-rose-500 font-semibold absolute -bottom-5 left-0 sm:static whitespace-nowrap">{t("status_locked")}</span>}
              </div>
            </label>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-10 border-t-8 border-t-amber-500">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              {t("section_basic")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_date")} *</label>
                <input type="date" name="Date" value={formData.Date} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_name")} *</label>
                <input type="text" name="StudentName" value={formData.StudentName} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_class")} *</label>
                <input type="text" name="Class" value={formData.Class} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_index")} *</label>
                <input type="number" name="sIndexNum" value={formData.sIndexNum} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_gender")} *</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setGender('Boy')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.Gender === 'Boy' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    <User size={16} /> {t("gender_boy")}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGender('Girl')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.Gender === 'Girl' ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    <User size={16} className="scale-x-[-1]" /> {t("gender_girl")}
                  </button>
                </div>
                <input type="hidden" name="Gender" value={formData.Gender} />
              </div>
            </div>
          </div>

          {/* Section 2: Identity Verification (Photo) */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Identity Verification
            </h3>
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <label className="text-sm font-semibold text-slate-700 block mb-3">Student Photograph</label>
              <div className="w-full">
                <ImageUpload 
                  value={formData.StudentPhoto} 
                  onChange={(url) => {
                    setFormData(prev => ({ ...prev, StudentPhoto: url }));
                    setIsDirty(true);
                  }} 
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Official Details & Agreement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_reason")} *</label>
                <input type="text" name="Reason" value={formData.Reason} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Agreement End Date *</label>
                <input type="date" name="AgreementEndDate" value={formData.AgreementEndDate} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("role_teacher")} ID *</label>
                <input type="text" name="TeacherID" value={formData.TeacherID} onChange={handleChange} required className="input-field uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_teacher_title")} *</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, TeacherTitle: 'Sir' }));
                      setIsDirty(true);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.TeacherTitle === 'Sir' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    {t("teacher_sir")}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, TeacherTitle: 'Madam' }));
                      setIsDirty(true);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.TeacherTitle === 'Madam' ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    {t("teacher_madam")}
                  </button>
                </div>
                <input type="hidden" name="TeacherTitle" value={formData.TeacherTitle} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Comprehensive Agreement Details *</label>
                <textarea name="Agreement" rows={4} value={formData.Agreement} onChange={handleChange} required className="input-field resize-y" />
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
            <button 
              type="button"
              onClick={handleCancel}
              className="btn-secondary w-full sm:w-auto"
            >
              {t("btn_cancel")}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full sm:w-auto min-w-[200px] shadow-amber-500/20"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   {t("btn_update")}...
                </span>
              ) : (
                <><Save size={20} /> {t("btn_update")}</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modern Confirmation Modals */}
      <ConfirmModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => router.push("/view-data")}
        title={t("modal_cancel_title")}
        message={t("modal_cancel_msg")}
        confirmText={t("modal_cancel_btn")}
        cancelText={t("btn_keep_editing")}
        type="warning"
      />

      <ConfirmModal 
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          router.push("/view-data");
        }}
        onConfirm={() => {
          setIsSuccessModalOpen(false);
          router.push("/view-data");
        }}
        title={t("modal_success_update_title")}
        message={t("modal_success_update_msg")}
        confirmText={t("btn_ack")}
        type="success"
        showCancel={false}
      />
    </div>
  );
}
