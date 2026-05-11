"use client";
import { useState } from "react";
import { MapPin, Save } from "lucide-react";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import { updateAddress, AddressItem } from "@/services/userService";

export default function EditAddressForm({ initialData }: { initialData: AddressItem | null }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialData) return;
    
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const payload: AddressItem = {
      address_title: formData.get("address_title")?.toString() || initialData.address_title,
      address_type: formData.get("address_type")?.toString() || initialData.address_type,
      address_line1: formData.get("address_line1")?.toString() || initialData.address_line1,
      city: formData.get("city")?.toString() || initialData.city,
      state: formData.get("state")?.toString() || initialData.state,
      pincode: formData.get("pincode")?.toString() || initialData.pincode,
      phone: formData.get("address_phone")?.toString() || initialData.phone,
      country: "Indonesia",
      city_id: initialData.city_id || "",
      province_id: initialData.province_id || "",
      subdistrict_id: initialData.subdistrict_id || "",
    };

    const originalKey = `${initialData.address_title}-${initialData.address_type}`;
    
    const res = await updateAddress(originalKey, payload);
    
    if (res.success) {
      alert("Nah gitu dong, berhasil!");
    } else {
      alert(`Gagal: ${res.error}`);
    }
    setLoading(false);
  };

  if (!initialData) return null;

  return (
    <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm border border-base-content/5 p-8">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="text-primary" size={20} />
        <h2 className="text-sm font-black uppercase tracking-widest leading-none">Edit Alamat</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput label="Label Alamat" name="address_title" defaultValue={initialData.address_title} />
        
        <FormSelect 
          label="Tipe Alamat" 
          name="address_type" 
          options={["Shipping", "Billing"]}
          value={initialData.address_type} 
        />

        <FormTextarea label="Alamat Lengkap" name="address_line1" defaultValue={initialData.address_line1} className="md:col-span-2" />
        <FormInput label="Kota" name="city" defaultValue={initialData.city} />
        <FormInput label="Provinsi" name="state" defaultValue={initialData.state} />
        <FormInput label="Kode Pos" name="pincode" defaultValue={initialData.pincode} />
        <FormInput label="HP Penerima" name="address_phone" defaultValue={initialData.phone} />
      </div>

      <button disabled={loading} className="btn btn-primary mt-6 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">
        {loading ? <span className="loading loading-spinner"></span> : <><Save size={18}/> Simpan Alamat</>}
      </button>
    </form>
  );
}