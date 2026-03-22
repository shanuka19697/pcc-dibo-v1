"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 font-medium py-2 px-4 rounded-xl transition-colors ml-4 border border-rose-100 shadow-sm"
    >
      <LogOut size={16} /> Logout
    </button>
  );
}
