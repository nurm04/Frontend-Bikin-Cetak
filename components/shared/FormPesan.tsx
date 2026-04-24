"use client";

import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";

interface FormField {
  name: string;
  label: string;
  type: string;
  options?: string[];
}

export default function FormPesan({ fields }: { fields: FormField[] }) {
  return (
    <div className="grid grid-cols-1">
      {fields.map((field, index) => (
        <div key={index}>
          {field.type === "select" ? (
            <FormSelect 
              label={field.label} 
              name={field.name} 
              options={field.options || []} 
            />
          ) : (
            <FormInput 
              label={field.label} 
              name={field.name} 
              type={field.type} 
              placeholder={`Pilih ${field.label}...`} 
            />
          )}
        </div>
      ))}
      
      <div className="">
        <FormTextarea 
          label="Catatan Tambahan" 
          name="catatan" 
          placeholder="Contoh: Laminasi doff, potong pola, dll..." 
          className="bg-base-100"
        />
      </div>
    </div>
  );
}