"use client";

import { useState, useRef } from "react";
import { Upload, File, X, Paperclip } from "lucide-react";

interface FileUploadProps {
  variant?: "box" | "minimal";
}

export default function FileUpload({ variant = "box" }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (variant === "minimal") {
    return (
      <div className="w-full min-w-0 max-w-full overflow-hidden">
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        {!fileName ? (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline border-dashed border-2 w-full flex items-center justify-start gap-3 rounded-2xl h-14 bg-base-200/30 hover:bg-base-200 border-base-300 min-w-0 px-4 overflow-hidden"
          >
            <Paperclip size={18} className="text-primary shrink-0" />
            <span className="opacity-50 font-black uppercase text-[10px] tracking-tighter truncate w-full text-left">Lampirkan File Desain</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/20 w-full animate-in fade-in zoom-in duration-200 min-w-0 overflow-hidden">
            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20 shrink-0">
              <File size={16} />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
               <p className="text-[11px] font-black truncate uppercase tracking-tighter leading-none w-full block">{fileName}</p>
            </div>
            <button onClick={clearFile} className="btn btn-ghost btn-circle btn-xs text-error shrink-0">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-base-100 border-base-content/5 rounded-2xl border w-full max-w-full min-w-0 p-6 shadow-sm flex flex-col overflow-hidden box-border">
      
      <div className="text-primary font-black uppercase tracking-widest text-[10px] mb-4 flex items-center shrink-0">
        <Upload size={14} className="mr-2 shrink-0" /> File Desain
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-8 px-4 transition-all cursor-pointer group w-full max-w-full min-w-0 overflow-hidden box-border ${
          fileName ? "border-primary bg-primary/5" : "border-base-300 bg-base-200/50 hover:bg-base-200"
        }`}
      >
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

        {!fileName ? (
          <>
            <Upload className="mb-4 opacity-20 group-hover:text-primary group-hover:opacity-100 transition-all shrink-0" size={32} />
            <p className="text-[10px] text-center font-black uppercase opacity-50 tracking-tighter px-2">
              Klik atau seret file desain
            </p>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl shadow-sm border border-primary/20 w-full max-w-full min-w-0 overflow-hidden box-border">
            <File className="text-primary shrink-0" size={24} />
            
            <div className="flex-1 min-w-0 overflow-hidden text-left">
              <p className="text-[11px] font-black truncate uppercase mb-0.5 block w-full">{fileName}</p>
              <p className="text-[9px] uppercase font-bold opacity-40 truncate">File Terpilih</p>
            </div>
            
            <button onClick={clearFile} className="btn btn-circle btn-ghost btn-xs text-error shrink-0 relative z-10">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-[9px] mt-4 opacity-30 uppercase font-black text-center tracking-widest truncate w-full shrink-0">
        * PDF, AI, JPG, PNG (Maks 50MB)
      </p>
    </div>
  );
}