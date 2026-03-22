"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, Database, PlusCircle, Menu, X, Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [greetingKey, setGreetingKey] = useState<any>("greeting_morning");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Determine greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreetingKey("greeting_morning");
    else if (hour < 18) setGreetingKey("greeting_afternoon");
    else setGreetingKey("greeting_evening");

    // Fetch user role
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUserRole(data.role);
      } catch (err) {
        console.error("Auth check failed", err);
      }
    };
    checkUser();
  }, []);

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { name: t("nav_dashboard"), href: "/", icon: <LayoutDashboard size={20} /> },
    { name: t("nav_database"), href: "/view-data", icon: <Database size={20} /> },
    { name: t("nav_add_student"), href: "/add-data", icon: <PlusCircle size={20} /> },
  ];

  if (pathname === "/login") return null;

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="glass-panel py-3 px-4 md:px-6 flex items-center justify-between border-white/20 shadow-2xl shadow-slate-900/10">
        
        {/* Brand Section */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Database size={24} />
            </div>
            <div className="hidden xs:block">
              <span className="text-lg font-black tracking-tighter text-slate-900 leading-none block">STUDENT</span>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest leading-none">Management</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                    isActive 
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25 scale-105" 
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Action/Utility Section */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
            <button 
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'en' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("si")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'si' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              සිං
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 ml-1 hidden md:block"></div>

          {/* Identity Badge (Desktop) */}
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t(greetingKey)}</span>
             <span className="text-sm font-extrabold text-slate-900 capitalize leading-none mb-1">
                {userRole === 'principal' ? t("role_principal") : t("role_teacher")}
             </span>
             <div className="flex items-center gap-1.5 opacity-60">
                <div className={`w-1.5 h-1.5 rounded-full ${userRole === 'principal' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">{userRole} {t("access_level")}</span>
             </div>
          </div>

          {/* User Aura Avatar */}
          <div className="relative group p-1 ml-1">
             <div className={`absolute inset-0 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300 ${userRole === 'principal' ? 'bg-amber-500' : 'bg-brand-500'}`}></div>
             <div className={`relative w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform duration-300 group-hover:rotate-6 ${userRole === 'principal' ? 'bg-amber-500' : 'bg-brand-500'}`}>
                <User size={22} />
             </div>
          </div>

          <div className="h-8 w-px bg-slate-200 ml-2 hidden sm:block"></div>

          {/* Logout Button (Desktop) */}
          <button 
            onClick={handleLogout}
            className="hidden sm:flex p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 items-center justify-center group"
            title={t("nav_logout")}
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all duration-300 flex items-center justify-center"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden absolute top-20 right-0 left-0 transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-4 opacity-0 invisible pointer-events-none'}`}>
        <div className="glass-panel p-4 flex flex-col gap-2 shadow-2xl border-white/20">
          
          {/* Mobile Nav Links */}
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 mb-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-2">Navigation</span>
             {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-200 ${
                    isActive 
                      ? "bg-brand-500 text-white shadow-lg" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-brand-500"}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile User Section */}
          <div className="px-4 py-2 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${userRole === 'principal' ? 'bg-amber-500' : 'bg-brand-500'}`}>
                   <User size={20} />
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-slate-400 uppercase">{t(greetingKey)}</span>
                   <span className="text-base font-black text-slate-900 capitalize">{userRole === 'principal' ? t("role_principal") : t("role_teacher")}</span>
                </div>
             </div>
             
             <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-rose-100 transition-colors border border-rose-100 shadow-sm"
             >
                <LogOut size={18} /> {t("nav_logout")}
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
