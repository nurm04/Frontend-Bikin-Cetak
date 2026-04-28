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
      <div className="w-full">
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        {!fileName ? (
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-outline border-dashed border-2 w-full justify-start gap-3 rounded-2xl h-14 bg-base-200/30 hover:bg-base-200 border-base-300"
          >
            <Paperclip size={18} className="text-primary" />
            <span className="opacity-50 font-black uppercase text-[10px] tracking-tighter">Lampirkan File Desain</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-2xl border border-primary/20 w-full animate-in fade-in zoom-in duration-200">
            <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/20">
              <File size={16} />
            </div>
            <p className="flex-1 text-[11px] font-black truncate uppercase tracking-tighter">{fileName}</p>
            <button onClick={clearFile} className="btn btn-ghost btn-circle btn-xs text-error">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-2xl border p-8 shadow-sm">
      <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4 text-[10px]">
        <Upload size={14} className="inline mr-2" /> File Desain
      </legend>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-10 px-4 transition-all cursor-pointer group ${
          fileName ? "border-primary bg-primary/5" : "border-base-300 bg-base-200/50 hover:bg-base-200"
        }`}
      >
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

        {!fileName ? (
          <>
            <Upload className="mb-4 opacity-20 group-hover:text-primary group-hover:opacity-100 transition-all" size={40} />
            <p className="text-[10px] text-center font-black uppercase opacity-50 tracking-tighter">
              Klik atau seret file desain ke sini
            </p>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl shadow-sm border border-primary/20 w-full max-w-xs relative">
            <File className="text-primary" size={24} />
            <div className="flex-1 overflow-hidden text-left">
              <p className="text-[11px] font-black truncate uppercase">{fileName}</p>
              <p className="text-[9px] uppercase font-bold opacity-40">File Terpilih</p>
            </div>
            <button onClick={clearFile} className="btn btn-circle btn-ghost btn-xs text-error">
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="text-[9px] mt-3 opacity-30 uppercase font-black text-center tracking-widest">
        * PDF, AI, JPG, PNG (Maks 50MB)
      </p>
    </fieldset>
  );
}