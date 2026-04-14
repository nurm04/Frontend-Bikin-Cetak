import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import { FormField } from "@/lib/data";

export default function FormPesan({ categoryLabel, fields }: { categoryLabel: string; fields: FormField[] }) {
  return (
    <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-lg border p-8 shadow-sm">
      <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
        Spesifikasi {categoryLabel}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          field.type === "select" ? (
            <FormSelect 
              key={index} 
              label={field.label} 
              name={field.name} 
              options={field.options || []} 
            />
          ) : (
            <FormInput 
              key={index} 
              label={field.label} 
              name={field.name} 
              type={field.type} 
              placeholder={field.label} 
            />
          )
        ))}
        
        <FormTextarea 
          label="Catatan Tambahan" 
          name="catatan" 
          placeholder="Tulis instruksi khusus di sini..." 
          className="md:col-span-2"
        />
      </div>
    </fieldset>
  );
}