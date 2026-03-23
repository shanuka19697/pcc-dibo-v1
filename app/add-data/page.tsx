"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UploadCloud, X, LayoutDashboard, User, Baby } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

export default function AddDataPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Date: new Date().toISOString().split('T')[0],
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
    Isactive: true,
  });

  // Modal & Dirty State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleCancel = () => {
    if (isDirty) {
      setIsCancelModalOpen(true);
    } else {
      router.push("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/student-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccessModalOpen(true);
        setIsDirty(false);
      } else {
        alert("Error saving data: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t("form_new_header")}</h1>
          <p className="text-slate-500 mt-1">{t("form_subheader_add")}</p>
        </div>
        <Link href="/" className="btn-secondary whitespace-nowrap hidden sm:flex">
          <LayoutDashboard size={18} /> {t("nav_dashboard")}
        </Link>
      </div>

      <div className="glass-panel p-6 sm:p-10 border-t-8 border-t-brand-500">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              {t("section_basic")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_date")} *</label>
                <input type="date" name="Date" value={formData.Date} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_name")} *</label>
                <input type="text" name="StudentName" placeholder="e.g. Emily Chen" value={formData.StudentName} onChange={handleChange} required className="input-field placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_class")} *</label>
                <input type="text" name="Class" placeholder="e.g. 10-A" value={formData.Class} onChange={handleChange} required className="input-field placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_index")} *</label>
                <input type="number" name="sIndexNum" placeholder="e.g. 102934" value={formData.sIndexNum} onChange={handleChange} required className="input-field placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_gender")} *</label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, Gender: 'Boy' }));
                      setIsDirty(true);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.Gender === 'Boy' ? 'bg-blue-500 border-blue-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    <User size={16} /> {t("gender_boy")}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, Gender: 'Girl' }));
                      setIsDirty(true);
                    }}
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
              <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Identity Verification
            </h3>
            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <label className="text-sm font-semibold text-slate-700 block mb-3">Student Photograph *</label>
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

          {/* Section 3: Official Details */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-brand-100 text-brand-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Official Details & Agreement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("label_reason")} *</label>
                <input type="text" name="Reason" placeholder="" value={formData.Reason} onChange={handleChange} required className="input-field placeholder:text-slate-300" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Agreement End Date *</label>
                <input type="date" name="AgreementEndDate" value={formData.AgreementEndDate} onChange={handleChange} required className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t("role_teacher")} ID *</label>
                <input type="text" name="TeacherID" placeholder="T-001" value={formData.TeacherID} onChange={handleChange} required className="input-field placeholder:text-slate-300 uppercase" />
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
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.TeacherTitle === 'Sir' ? 'bg-blue-700 border-blue-700 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    {t("teacher_sir")}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, TeacherTitle: 'Madam' }));
                      setIsDirty(true);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${formData.TeacherTitle === 'Madam' ? 'bg-pink-500 border-pink-500 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    {t("teacher_madam")}
                  </button>
                </div>
                <input type="hidden" name="TeacherTitle" value={formData.TeacherTitle} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Comprehensive Agreement Details *</label>
                <textarea name="Agreement" rows={4} placeholder="" value={formData.Agreement} onChange={handleChange} required className="input-field placeholder:text-slate-300 resize-y" />
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
              disabled={loading}
              className="btn-primary w-full sm:w-auto min-w-[200px]"
            >
              {loading ? (
                <span className="flex items-center gap-2 animate-pulse"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> {t("btn_save")}...</span>
              ) : (
                <><Save size={20} /> {t("btn_save")}</>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modern Confirmation Modals */}
      <ConfirmModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => router.push("/")}
        title={t("modal_cancel_title")}
        message={t("modal_cancel_msg")}
        confirmText={t("modal_cancel_btn")}
        cancelText={t("btn_continue")}
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
        title={t("modal_success_reg_title")}
        message={t("modal_success_reg_msg")}
        confirmText={t("btn_ack")}
        type="success"
        showCancel={false}
      />
    </div>
  );
}
