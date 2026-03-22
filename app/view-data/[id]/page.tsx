"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Calendar, Edit3, User, GraduationCap, MapPin, CheckCircle2, XCircle, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { t, language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await fetch(`/api/student-data/${id}`);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
         <Loader2 className="animate-spin mb-4 text-brand-500" size={40} />
         <p className="font-medium animate-pulse">{language === "si" ? "සම්පූර්ණ ශිෂ්‍ය පැතිකඩ ලබා ගනිමින්..." : "Retrieving comprehensive student portfolio..."}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">{t("no_records")}</h2>
        <Link href="/view-data" className="text-brand-600 hover:underline mt-4 inline-block">{language === "si" ? "දත්ත ගබඩාව වෙත ආපසු" : "Return to Database"}</Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      
      <div className="flex items-center justify-between mb-8">
        <Link href="/view-data" className="text-slate-500 hover:text-brand-600 font-medium text-sm flex items-center gap-1 transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow border border-slate-100">
          <ArrowLeft size={16} /> {language === "si" ? "දත්ත ගබඩාව වෙත ආපසු" : "Back to Database"}
        </Link>
        <Link href={`/edit-data/${id}`} className="btn-primary py-2 px-6 shadow-brand-500/20 text-sm">
          <Edit3 size={16} /> {language === "si" ? "සංස්කරණය" : "Edit Record"}
        </Link>
      </div>

      <div className="glass-panel overflow-hidden border-t-8 border-t-brand-500 flex flex-col lg:flex-row">
        
        {/* Left Side: Photo with Gender Fallback */}
        <div className={`w-full lg:w-2/5 xl:w-1/3 min-h-[400px] relative border-r border-slate-100 flex-shrink-0 flex items-center justify-center ${data.Gender === 'Girl' ? 'bg-rose-500' : 'bg-blue-500'}`}>
           {data.StudentPhoto ? (
             <img 
               src={data.StudentPhoto} 
               alt={data.StudentName} 
               className="w-full h-full object-cover object-center absolute inset-0 z-10" 
             />
           ) : (
             <div className="text-white drop-shadow-2xl transform hover:scale-110 transition-transform duration-500 z-10">
                <User size={160} strokeWidth={1.5} className={data.Gender === 'Girl' ? 'scale-x-[-1]' : ''} />
             </div>
           )}
            {/* Status Badge Overlay */}
            <div className={`absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full z-20 shadow-xl backdrop-blur-md border border-white/20 font-bold text-sm ${data.Isactive ? 'bg-emerald-500/90 text-white shadow-emerald-500/30' : 'bg-rose-500/90 text-white shadow-rose-500/30'}`}>
              {data.Isactive ? <><CheckCircle2 size={16} /> {t("status_active")}</> : <><XCircle size={16} /> {t("status_inactive")}</>}
            </div>
        </div>

        {/* Right Side: Student Data */}
        <div className="p-8 sm:p-12 pb-12 flex-1 bg-white">
          
          <div className="mb-10 border-b border-slate-100 pb-8">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 uppercase font-sans tracking-tighter">{data.StudentName}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${data.Gender === 'Girl' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                <User size={14} className={data.Gender === 'Girl' ? 'scale-x-[-1]' : ''} /> {data.Gender === 'Girl' ? t("gender_girl") : t("gender_boy")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-semibold border border-brand-100">
                <LayoutDashboard size={14} /> {t("label_index")}: {data.sIndexNum}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-100">
                <GraduationCap size={14} /> {t("label_class")}: {data.Class}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold border border-slate-200">
                <Calendar size={14} /> {t("label_date")}: {new Date(data.Date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
              </span>
            </div>
          </div>

          <div className="space-y-10">
            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-brand-700">
                <MapPin size={20}/> 
                {language === "si" ? "සන්දර්භය සහ අරමුණු" : "Context & Objectives"}
              </h3>
              <p className="text-slate-700 text-lg leading-relaxed bg-brand-50/50 p-6 rounded-2xl border border-brand-100/50">
                {data.Reason}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-4 text-blue-700 uppercase tracking-wide text-xs">
                   {language === "si" ? "පරිපාලන පැවරුම්" : "Administrative Assignments"}
                </h3>
                 <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{t("role_teacher")}</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">{data.TeacherID}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Observer ID</span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">{data.ObserverTeacherID}</span>
                  </div>
                </div>
              </section>
              <section>
                <h3 className="text-base font-bold text-slate-900 mb-4 text-amber-700 uppercase tracking-wide text-xs">
                   {language === "si" ? "කාලරේඛා වලංගුකරණය" : "Timeline Validation"}
                </h3>
                 <div className="space-y-4">
                  <div className="flex flex-col py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium mb-1">Agreement Expiration</span>
                    <span className="font-bold text-slate-900 text-lg flex items-center gap-2">
                       {new Date(data.AgreementEndDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            <section>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 text-emerald-700">
                 <CheckCircle2 size={20}/> 
                 {language === "si" ? "සම්පූර්ණ ගිවිසුම් විස්තර" : "Comprehensive Agreement Details"}
              </h3>
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-100">
                <p className="text-slate-700 leading-relaxed font-serif text-base italic">
                  "{data.Agreement}"
                </p>
              </div>
            </section>
          </div>

        </div>

      </div>
    </div>
  );
}
