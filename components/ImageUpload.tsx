"use client";

import { ImageKitProvider, upload } from "@imagekit/next";
import { UploadCloud, Loader2, X, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT || "placeholder";
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY || "placeholder";

const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) {
        throw new Error(`Authentication request failed: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Authentication request failed: ${error}`);
  }
};

export default function ImageUpload({ 
    value, 
    onChange 
}: { 
    value: string, 
    onChange: (url: string) => void 
}) {
    const { t } = useLanguage();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onUploadStart = () => {
        setUploading(true);
        setError("");
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onUploadStart();

        try {
            const authParams = await authenticator() as { 
                signature: string; 
                token: string; 
                expire: number; 
            };

            const result = await upload({
                file,
                fileName: "student_photo.webp",
                publicKey: publicKey as string,
                signature: authParams.signature,
                token: authParams.token,
                expire: authParams.expire,
                folder: "/student_photos",
                tags: ["student"]
            });
            
            setUploading(false);
            if (result.url) {
                onChange(result.url);
            }
        } catch (err: any) {
            setUploading(false);
            setError(t("upload_error"));
            console.error("Upload error:", err);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <ImageKitProvider urlEndpoint={urlEndpoint}>
            <div className="relative w-full pb-2">
                <div 
                    onClick={!uploading && !value ? triggerUpload : undefined}
                    className={`relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 overflow-hidden ${value ? 'border-amber-400 bg-amber-50/20' : 'border-slate-300 bg-white hover:border-amber-400 hover:bg-slate-50 cursor-pointer'} ${uploading ? 'pointer-events-none opacity-80' : ''}`}
                >
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center justify-center text-amber-500">
                           <Loader2 className="animate-spin mb-3" size={32} />
                           <p className="text-sm font-bold text-slate-700">{t("upload_start")}</p>
                        </div>
                    ) : value ? (
                        <div className="relative w-full h-full flex items-center justify-center group">
                            <img src={value} alt="Preview" className="h-full object-contain drop-shadow-md" />
                            
                            <div 
                                onClick={triggerUpload}
                                className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-30 cursor-pointer"
                            >
                               <span className="text-white font-medium flex items-center gap-2"><UploadCloud size={20}/> {t("upload_reupload")}</span>
                            </div>

                            <button 
                                type="button"
                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors z-50"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(""); }}
                            >
                                <X size={16} />
                            </button>
                            <div className="absolute bottom-3 left-3 bg-emerald-500 text-white text-[10px] uppercase tracking-wide font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-30 ring-2 ring-white">
                                <CheckCircle2 size={12}/> {t("upload_success")}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center p-6 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all pointer-events-none">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                               <UploadCloud size={24} className="text-amber-500" />
                            </div>
                            <p className="text-sm font-bold text-slate-700">{t("upload_prompt")}</p>
                            <p className="text-xs text-slate-400 mt-1">{t("upload_hint")}</p>
                        </div>
                    )}
                </div>
                {error && <p className="text-red-500 text-xs font-bold mt-2 text-center absolute -bottom-4 w-full">{error}</p>}
            </div>
        </ImageKitProvider>
    );
}
