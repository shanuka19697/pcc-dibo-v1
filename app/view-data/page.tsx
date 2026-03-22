"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, Trash2, Edit3, LayoutGrid, List, AlertCircle, Calendar, Eye, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

export default function ViewDataPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dataRes, authRes] = await Promise.all([
        fetch("/api/student-data"),
        fetch("/api/auth/me")
      ]);
      const authData = await authRes.json();
      if (authData.success) setUserRole(authData.role);

      const result = await dataRes.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setStudentToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/student-data/${studentToDelete.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setData(data.filter((item: any) => item._id !== studentToDelete.id));
        setIsDeleteModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete student');
    } finally {
      setIsDeleting(false);
      setStudentToDelete(null);
    }
  };

  const filteredData = data.filter((item: any) =>
    item.StudentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sIndexNum?.toString().includes(searchQuery) ||
    item.Class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.TeacherID?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{t("db_header")}</h1>
        <p className="text-slate-500 italic">{t("db_subheader")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mb-8">
        <div className="relative group flex-grow lg:min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="input-field pl-12 pr-4 bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="glass-panel p-1.5 flex gap-1 shadow-sm bg-white/60 items-center justify-center">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${viewMode === 'table' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            title={t("view_table")}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
            title={t("view_grid")}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin mb-4 text-brand-500" size={40} />
          <p className="font-medium animate-pulse">Initializing Database Connection...</p>
        </div>
      ) : filteredData.length > 0 ? (
        
        viewMode === 'table' ? (
          <div className="glass-panel overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">{t("col_profile")}</th>
                    <th className="px-6 py-4">{t("col_academic")}</th>
                    <th className="px-6 py-4">{t("col_status")}</th>
                    <th className="px-6 py-4">{t("col_tracking")}</th>
                    <th className="px-6 py-4 text-right">{t("col_actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredData.map((item: any) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm ${item.Gender === 'Girl' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>
                            <User size={24} className={item.Gender === 'Girl' ? 'scale-x-[-1]' : ''} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{item.StudentName}</div>
                            <div className="text-slate-500 text-xs mt-0.5">ID: {item.sIndexNum}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md w-fit">{t("col_academic")} {item.Class}</span>
                          <span className="text-slate-400 text-xs ml-1">Assigned: {item.TeacherID}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${item.Isactive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.Isactive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {item.Isactive ? t("status_active") : t("status_inactive")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Calendar size={14} className="text-slate-400" />
                          <span>{new Date(item.Date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-[150px]" title={item.Reason}>
                          {item.Reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 outline-none">
                          <Link href={`/view-data/${item._id}`} className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500" title="View details">
                            <Eye size={16} />
                          </Link>
                          <Link href={`/edit-data/${item._id}`} className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-brand-500" title="Edit record">
                            <Edit3 size={16} />
                          </Link>
                          {userRole === 'principal' && (
                            <button onClick={() => handleDeleteClick(item._id, item.StudentName)} className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-red-500" title="Delete record">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item: any) => (
              <div key={item._id} className="glass-panel group overflow-visible relative flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="px-6 pt-8 pb-4 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white relative rounded-t-2xl">
                   <div className="absolute top-4 right-4 z-10">
                     <span className={`flex h-3 w-3 relative`} title={item.Isactive ? "Active" : "Inactive"}>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${item.Isactive ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${item.Isactive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      </span>
                   </div>
                  <div className="relative w-24 h-24 mb-4 group-hover:scale-105 transition-transform duration-300">
                      <div className={`w-full h-full rounded-full flex items-center justify-center ring-4 ring-white shadow-lg z-10 relative ${item.Gender === 'Girl' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'}`}>
                        <User size={48} className={item.Gender === 'Girl' ? 'scale-x-[-1]' : ''} />
                      </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 text-center px-2 truncate w-full">{item.StudentName}</h3>
                  <p className="text-brand-600 font-mono text-sm uppercase tracking-wide">ID: {item.sIndexNum}</p>
                </div>
                
                <div className="p-6 pt-2 bg-white flex-1 flex flex-col">
                  
                  <div className="flex justify-between items-center py-3 border-y border-slate-100 mb-4">
                    <div className="text-center">
                       <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">{t("col_academic")}</p>
                       <p className="font-semibold text-slate-800">{item.Class}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                     <div className="text-center">
                       <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">{t("role_teacher")}</p>
                       <p className="font-semibold text-slate-800">{item.TeacherID}</p>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 line-clamp-2 italic flex-1 flex items-center justify-center text-center">
                    "{item.Reason}"
                  </div>

                  <div className="mt-6 flex justify-between gap-2">
                    <Link href={`/view-data/${item._id}`} className="flex items-center justify-center flex-1 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-colors font-medium text-xs">
                      <Eye size={14} className="mr-1"/> {language === "si" ? "බලන්න" : "View"}
                    </Link>
                    <Link href={`/edit-data/${item._id}`} className="flex items-center justify-center flex-1 py-1.5 text-brand-600 bg-brand-50 hover:bg-brand-600 hover:text-white rounded-lg transition-colors font-medium text-xs">
                      <Edit3 size={14} className="mr-1"/> {language === "si" ? "සංස්කරණය" : "Edit"}
                    </Link>
                    {userRole === 'principal' && (
                          <button 
                            onClick={() => handleDeleteClick(item._id, item.StudentName)} 
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      ) : (
        <div className="glass-panel p-16 text-center flex flex-col items-center justify-center gap-6 max-w-2xl mx-auto border-dashed border-2 border-slate-300 bg-slate-50/50">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
             <AlertCircle size={40} className="text-slate-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{t("no_records")}</h3>
            <p className="text-slate-500 max-w-md mx-auto">We couldn't locate any records matching your search queries. Adjust your filters or create a new student record.</p>
          </div>
          <Link href="/add-data" className="btn-primary mt-2">
            {t("nav_add_student")}
          </Link>
        </div>
      )}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t("modal_delete_title")}
        message={t("modal_delete_msg")}
        confirmText={t("modal_delete_btn")}
        type="danger"
        isLoading={isDeleting}
      />

      <ConfirmModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => setIsSuccessModalOpen(false)}
        title={t("modal_success_db_title")}
        message={t("modal_success_db_msg")}
        confirmText={t("btn_ack")}
        type="success"
        showCancel={false}
      />
    </div>
  );
}
