"use client";

import Link from "next/link";
import Image from "next/image";
import { Users, FilePlus, Search, TrendingUp, GraduationCap, MapPin, Calendar, Award, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Hero Section with Heritage Backdrop */}
      <div className="relative h-[500px] md:h-[600px] w-full rounded-[2rem] overflow-hidden mb-12 shadow-2xl group">
        <Image 
          src="/school_hero.jpg" 
          alt="Poramadulla Central College Campus" 
          fill 
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-8 md:p-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-brand-500/20 backdrop-blur-md text-brand-100 text-sm font-bold border border-brand-400/30 shadow-xl scale-in-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400"></span>
              </span>
              {t("school_status")}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-4 drop-shadow-2xl uppercase font-sans">
              {t("school_name")}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-slate-200 italic mb-8 drop-shadow-lg tracking-tight">
              "{t("school_motto")}"
            </p>
            <div className="flex flex-wrap gap-4">
               <Link href="/view-data" className="btn-primary py-4 px-8 text-lg font-bold shadow-xl shadow-brand-600/20 group/btn hover:translate-y-[-2px] transition-all">
                  {t("btn_access_db")} <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
               </Link>
               <Link href="/add-data" className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all hover:translate-y-[-2px]">
                  {t("btn_manual_reg")}
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Legacy Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
        {[
          { icon: <Calendar size={24} />, label: t("stat_years"), val: "124+", color: "bg-blue-50 text-blue-600" },
          { icon: <Users size={24} />, label: t("stat_students"), val: "3,000+", color: "bg-brand-50 text-brand-600" },
          { icon: <Award size={24} />, label: t("stat_sports"), val: "SPORTS", color: "bg-amber-50 text-amber-600" },
          { icon: <GraduationCap size={24} />, label: t("stat_grades"), val: "Gr. 6 - A/L", color: "bg-emerald-50 text-emerald-600" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-8 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-300">
            <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* Heritage & Context Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
        <div className="space-y-6">
          <div className="inline-block p-3 bg-brand-50 rounded-2xl text-brand-600">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
             {t("heritage_title")}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {t("heritage_desc")}
          </p>
          <div className="flex gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm italic text-slate-500">
             <TrendingUp className="text-brand-500 shrink-0" size={24} />
             <span>{t("heritage_badge")}</span>
          </div>
        </div>

        <div className="glass-panel p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-slate-100/10 pointer-events-none group-hover:scale-150 transition-transform duration-1000">
            <MapPin size={200} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <MapPin className="text-rose-500" />
            {t("location_title")}
          </h3>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {t("location_desc")}
          </p>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-xl">
               <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t("label_district")}</span>
               <span className="font-bold text-slate-800 uppercase tracking-wider">{t("district_name")}</span>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
               <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">{t("label_zone")}</span>
               <span className="font-bold text-slate-800 uppercase tracking-wider">{t("zone_name")}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Access Admin Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          {t("admin_hub")}
          <div className="h-px bg-slate-200 flex-1 ml-4"></div>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/add-data" className="group relative glass-panel p-1 border-slate-200/50 hover:border-brand-500 transition-colors duration-500">
            <div className="p-8 flex items-start gap-6 bg-white rounded-xl">
              <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                <FilePlus size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t("reg_title")}</h3>
                <p className="text-sm text-slate-500 mb-4">{t("reg_desc")}</p>
                <span className="text-brand-600 text-sm font-bold flex items-center gap-2">
                  {t("launch_enrollment")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>

          <Link href="/view-data" className="group relative glass-panel p-1 border-slate-200/50 hover:border-slate-800 transition-colors duration-500">
            <div className="p-8 flex items-start gap-6 bg-white rounded-xl">
              <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl group-hover:bg-slate-800 group-hover:text-white transition-all duration-300">
                <Search size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t("db_title")}</h3>
                <p className="text-sm text-slate-500 mb-4">{t("db_desc")}</p>
                <span className="text-slate-800 text-sm font-bold flex items-center gap-2">
                  {t("open_search")} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
    </div>
  );
}
