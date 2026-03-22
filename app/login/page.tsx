"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = "/"; // Force full reload to update server layout cookies
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-500">
      
      {/* Background Graphic elements to make it popup-like */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/20 blur-[100px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/20 blur-[100px] rounded-full mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel p-8 sm:p-10 shadow-2xl border-white/50 animate-in zoom-in-95 duration-500">
          
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 mb-6 bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center border border-slate-100">
              <img src="/logo.png" alt="PCC Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display='none' }} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">PCC Dibo</h1>
            <p className="text-slate-500 mt-2 font-medium">Authentication Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium text-center animate-in shake">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1 relative">
              <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="username"
                  required
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleChange}
                  className="input-field pl-11 bg-slate-50 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={handleChange}
                  className="input-field pl-11 bg-slate-50 shadow-inner"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-8 py-3.5 text-base shadow-brand-500/25"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20}/> Authenticating...</span>
              ) : (
                <span className="flex items-center gap-2">Login to PCC Dibo <ArrowRight size={18} /></span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Secured by PCC Administrative Systems
          </p>

        </div>
      </div>
    </div>
  );
}
