// @/components/shared/ProductClientLayout.tsx
"use client";

import { useState, ReactNode } from "react";
import FormPesan from "./FormPesan";
import { VariantDetail, getVariantDetail, ItemTemplate } from "@/services/itemService"; 
import { addToCart } from "@/services/cartService";
import { useRouter } from "next/navigation";
import ProductCarousel from "@/components/ui/ProductCarousel";
import ProductRow from "@/components/shared/ProductRow";
import FileUpload from "@/components/ui/FileUpload";
import { CheckCircle, Truck, ShieldCheck, Award } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  options?: string[];
}

interface RecommendationItem {
  name: string;
  image: string;
}

interface ProductClientLayoutProps {
  foundItem: ItemTemplate; 
  initialVariant: VariantDetail | null;
  mappedFields: FormField[];
  recommendations: RecommendationItem[];
}

export default function ProductClientLayout({ foundItem, initialVariant, mappedFields, recommendations }: ProductClientLayoutProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<VariantDetail | null>(initialVariant);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { qty: "1" };
    mappedFields.forEach(f => {
      if (f.options && f.options.length > 0) initial[f.name] = f.options[0];
    });
    return initial;
  });

  const currentQty = parseInt(selectedAttrs.qty || "1", 10);

  const getCurrentPrice = () => {
    if (!variant || !variant.pricing_rules) return 0;
    const rule = variant.pricing_rules.find(
      r => currentQty >= r.min_qty && (r.max_qty === 0 || currentQty <= r.max_qty)
    );
    return rule ? rule.rate : variant.pricing_rules[0]?.rate || 0;
  };

  const currentPrice = getCurrentPrice();
  const totalPrice = currentPrice * currentQty;

  const handleAttributeChange = async (name: string, value: string) => {
    const updatedAttrs = { ...selectedAttrs, [name]: value };
    setSelectedAttrs(updatedAttrs);
    const isAttribute = mappedFields.some(f => f.name === name);
    if (isAttribute) {
      setLoading(true);
      const data = await getVariantDetail(foundItem.item_name, updatedAttrs);
      if (data) setVariant(data);
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!variant) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu!");
      router.push("/login");
      return;
    }
    setCartLoading(true);
    
    const payload = {
      item_code: variant.item_code,
      variant_name: variant.variant_name,
      qty: currentQty,
      price: currentPrice
    };

    const res = await addToCart(payload, token);
    setCartLoading(false);
    
    if (res.error) {
      alert(res.error);
    } else {
      alert(res.message);
      router.push("/cart");
    }
  };

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-content/5">
              
              <ProductCarousel image={foundItem.image_url} name={foundItem.item_name} />

              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2 uppercase italic tracking-tighter">
                    {foundItem.item_name}
                  </h1>
                </div>

                <div className="space-y-6">
                  <div className={`mt-4 transition-all ${loading ? "opacity-40" : "opacity-100"}`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">
                      Deskripsi Produk
                    </p>

                    <p className="text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis quis alias doloremque, consectetur maxime blanditiis voluptatibus minus temporibus illum sequi.</p>

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
                              <td className="text-right text-primary font-black italic">
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

                <div className="divider"></div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="lg:hidden text-right">
                    <p className="text-[10px] font-bold uppercase opacity-40 leading-none mb-1">Total Estimasi</p>
                    <p className="text-xl font-black text-primary italic">Rp {totalPrice.toLocaleString("id-ID")}</p>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading || loading || !variant}
                    className="btn btn-primary shadow-lg shadow-primary/20 uppercase font-bold rounded-2xl px-6"
                  >
                    {cartLoading ? <span className="loading loading-spinner"></span> : "Tambah Keranjang"}
                  </button>
                </div>
              </div>
            </div>

            <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-2xl border p-8 shadow-md">
              <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
                Informasi Harga Pengerjaan
              </legend>
              <div className="overflow-hidden border border-base-content/10 rounded-2xl">
                <table className="table table-zebra w-full bg-base-100">
                  <thead className="bg-base-200/50 text-base-content/60">
                    <tr className="border-b border-base-content/10">
                      <th className="text-md font-black uppercase">Estimasi Pengerjaan</th>
                      <th className="text-md font-black uppercase text-right">Harga</th>
                    </tr>
                  </thead>
                  
                  <tbody className="text-sm font-bold">
                    {[
                      { estimasi: "1 hari", price: 19000 },
                      { estimasi: "2 hari", price: 17500 },
                      { estimasi: "3 hari", price: 15000 },
                    ].map((rule, index) => (
                      <tr key={index} className="border-b border-base-content/5 last:border-none">
                        <td>{rule.estimasi}</td>
                        <td className="text-right text-primary font-black italic">
                          Rp {rule.price.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>

            <div className="bg-base-100 px-8 py-4 rounded-2xl shadow-sm border border-base-content/5">
              <ProductRow title="Produk Lainnya" data={recommendations} />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-18 space-y-4">              
              <div className="-mt-3">
                <FileUpload />
              </div>

              <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-2xl border p-8 shadow-md sticky">
                <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
                  Total
                </legend>

                <div className="">
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] font-bold uppercase text-primary mb-1">Total Estimasi</p>
                    <p className="text-2xl font-black text-primary">Rp {totalPrice.toLocaleString("id-ID")}</p>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={cartLoading || loading || !variant}
                    className="btn btn-primary w-full rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2"
                  >
                     {cartLoading ? <span className="loading loading-spinner"></span> : "Beli"}
                  </button>
                </div>
              </fieldset>

              <div className="card bg-primary text-primary-content shadow-xl shadow-primary/20 rounded-2xl">
                <div className="card-body p-6 gap-4">
                  <h3 className="font-bold flex items-center gap-2 underline underline-offset-4 uppercase text-sm">
                    <Award size={20}/> LAYANAN TERBAIK
                  </h3>

                  <div className="space-y-4 text-sm leading-tight">
                    <BenefitItem icon={<CheckCircle size={18} className="text-black"/>} title="CETAK ONLINE" desc="Mudah & praktis dari rumah." />
                    <BenefitItem icon={<Truck size={18} className="text-black"/>} title="PENGIRIMAN CEPAT" desc="Ekspedisi terpercaya." />
                    <BenefitItem icon={<ShieldCheck size={18} className="text-black"/>} title="JAMINAN KUALITAS" desc="QC ketat sebelum dikirim." />
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm rounded-2xl">
                <div className="card-body p-6 text-center">
                  <p className="text-[10px] opacity-60 mb-2 uppercase font-bold tracking-widest">Butuh Bantuan?</p>
                  <button className="btn btn-outline btn-sm rounded-full btn-primary uppercase font-bold text-[10px]">Chat Admin</button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}

const BenefitItem = ({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) => (
  <div className="flex gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="font-black uppercase text-[10px] tracking-tighter leading-none mb-1">{title}</p>
      <p className="opacity-70 text-[9px] font-bold uppercase leading-tight">{desc}</p>
    </div>
  </div>
);