"use client";

import { useState } from "react";
import FormPesan from "./FormPesan";
import { VariantDetail, getVariantDetail } from "@/services/itemService";

interface FormField {
  name: string;
  label: string;
  options?: string[];
}

interface ProductActionProps {
  initialVariant: VariantDetail | null;
  itemName: string;
  mappedFields: FormField[];
}

export default function ProductAction({ initialVariant, itemName, mappedFields }: ProductActionProps) {
  const [variant, setVariant] = useState<VariantDetail | null>(initialVariant);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    mappedFields.forEach(f => {
      if (f.options && f.options.length > 0) initial[f.name] = f.options[0];
    });
    return initial;
  });

  const handleAttributeChange = async (name: string, value: string) => {
    const updatedAttrs = { ...selectedAttrs, [name]: value };
    setSelectedAttrs(updatedAttrs);
    const isAttribute = mappedFields.some(f => f.name === name);

    if (isAttribute) {
      setLoading(true);
      const data = await getVariantDetail(itemName, updatedAttrs);
      if (data) {
        setVariant(data);
      }
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`mt-4 transition-all ${loading ? "opacity-40" : "opacity-100"}`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">
            Deskripsi Produk
          </p>
          <article className="prose prose-sm max-w-none text-base-content/70">
            <p>Cetak <strong>{variant?.description}</strong> dengan spesifikasi khusus. Kami menggunakan bahan berkualitas tinggi yang diproses langsung dari gudang produksi kami.</p>
          </article>
        </div>

        <div className="divider"></div>
      
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">
          Daftar Harga Grosir ({variant?.uom || 'Pcs'})
        </p>
        <div className="overflow-hidden border border-base-content/10 rounded-2xl">
          <table className="table table-zebra w-full bg-base-100">
            <thead className="bg-base-200/50">
              <tr className="border-b border-base-content/10">
                <th className="text-xs font-black uppercase">Jumlah</th>
                <th className="text-xs font-black uppercase text-right">Harga</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold">
              {variant?.pricing_rules.map((rule, index) => (
                <tr key={index}>
                  <td>{rule.max_qty === 0 ? `≥ ${rule.min_qty}` : `${rule.min_qty} - ${rule.max_qty}`}</td>
                  <td className="text-right text-primary font-black">
                    Rp {rule.rate.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">Spesifikasi</p>
        <div className="bg-base-200/30 p-4 rounded-2xl border border-base-content/5">
          <FormPesan 
            fields={mappedFields}
            values={selectedAttrs} 
            onValueChange={handleAttributeChange} 
          />
        </div>
      </div>
    </div>
  );
}