"use client";

import { useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

export default function FileUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Biar gak trigger click div
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-lg border p-8 shadow-sm">
      <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
        <Upload size={16} className="inline mr-2" /> File Desain
      </legend>

      <div
        onClick={handleDivClick}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-10 px-4 transition-all cursor-pointer group ${
          fileName 
          ? "border-primary bg-primary/5" 
          : "border-base-300 bg-base-200/50 hover:bg-base-200"
        }`}
      >
        <input
          type="file"
          name="file_desain"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!fileName ? (
          <>
            <Upload
              className="mb-4 opacity-20 group-hover:text-primary group-hover:opacity-100 transition-all"
              size={40}
            />
            <p className="text-xs font-bold uppercase opacity-50 tracking-tighter">
              Klik atau seret file desain ke sini
            </p>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-base-100 p-4 rounded-xl shadow-sm border border-primary/20 w-full max-w-xs relative">
            <File className="text-primary" size={24} />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">{fileName}</p>
              <p className="text-[10px] uppercase opacity-50">File Terpilih</p>
            </div>
            <button 
              onClick={clearFile}
              className="btn btn-circle btn-ghost btn-xs text-error"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="text-[9px] mt-3 opacity-40 uppercase font-bold text-center">
        * Format: PDF, AI, JPG, PNG (Maks 50MB)
      </p>
    </fieldset>
  );
}