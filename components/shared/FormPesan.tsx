// @/components/ui/FormPesan.tsx (atau path yang sesuai)
"use client";

import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";

interface FormField {
  name: string;
  label: string;
  options?: string[];
}

interface FormPesanProps {
  fields: FormField[];
  values?: Record<string, string>; // <-- Tambahkan "?" agar opsional
  onValueChange?: (name: string, value: string) => void; // <-- Tambahkan "?" agar opsional
}

export default function FormPesan({ fields, values, onValueChange }: FormPesanProps) {
  return (
    <div className="grid grid-cols-1">
      {fields.map((field, index) => (
        <div key={index}>
          <FormSelect 
            label={field.label} 
            name={field.name} 
            options={field.options || []}
            value={values?.[field.name] || ""} 
            onChange={onValueChange}
          />
        </div>
      ))}
      
      <div className="">
        <FormInput 
          label="Jumlah" 
          name="qty" 
          type="number" 
          min="1"
          defaultValue="1"
          placeholder="1"
          onChange={onValueChange}
        />

        <FormTextarea 
          label="Catatan Tambahan" 
          name="catatan" 
          placeholder="Contoh: Laminasi doff, potong pola, dll..." 
          className="bg-base-100"
          onChange={onValueChange}
        />
      </div>
    </div>
  );
}