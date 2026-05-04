"use client";

import { useState, useMemo, ReactNode } from "react";
import FormPesan from "../../../../components/shared/FormPesan";
import { VariantDetail, getVariantDetail, ItemTemplate, VariantLainnya } from "@/services/itemService"; 
import { addToCart } from "@/services/cartService";
import { useRouter } from "next/navigation";
import ProductCarousel from "@/components/shared/ProductCarousel";
import ProductRow from "@/components/shared/ProductRow";
import FileUpload from "@/components/ui/FileUpload";
import { ShoppingBag, CreditCard, Award, CheckCircle, Truck, ShieldCheck } from "lucide-react";
import AlertPopup from "@/components/ui/AlertPopup";
import { parseVariantsToFields, DynamicFormField } from "@/lib/variantHelper";

interface ProductClientLayoutProps {
  foundItem: ItemTemplate; 
  allVariants: VariantDetail[]; 
  initialVariant: VariantDetail | null;
  recommendations: { name: string; image: string }[];
}

export default function ProductClientLayout({ foundItem, allVariants, initialVariant, recommendations }: ProductClientLayoutProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<VariantDetail | null>(initialVariant);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  
  // State untuk menyimpan pilihan jasa (Key: Nama Grup, Value: Detail Jasa)
  const [selectedAddons, setSelectedAddons] = useState<Record<string, VariantLainnya | null>>({});

  // 1. Logic Generate Dropdown Produk Utama
  const dynamicFields = useMemo<DynamicFormField[]>(() => {
    return parseVariantsToFields(allVariants, foundItem.item_name);
  }, [allVariants, foundItem.item_name]);

  // 2. Logic Kelompokkan Jasa Tambahan berdasarkan name_variant
  const groupedAddons = useMemo(() => {
    const groups: Record<string, VariantLainnya[]> = {};
    variant?.variant_lainnya?.forEach((addon) => {
      if (!groups[addon.name_variant]) groups[addon.name_variant] = [];
      groups[addon.name_variant].push(addon);
    });
    return groups;
  }, [variant]);

  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { qty: "1" };
    dynamicFields.forEach(f => {
      if (f.options && f.options.length > 0) initial[f.name] = f.options[0];
    });
    return initial;
  });

  const [popup, setPopup] = useState<{
    isOpen: boolean; title: string; message: string; type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, title: "", message: "", type: "info" });

  const currentQty = parseInt(selectedAttrs.qty || "1", 10);

  // Kalkulasi Harga
  const basePrice = useMemo(() => {
    if (!variant || !variant.pricing_rules) return 0;
    const rule = variant.pricing_rules.find(
      r => currentQty >= r.min_qty && (r.max_qty === 0 || currentQty <= r.max_qty)
    );
    return rule ? rule.rate : (variant.pricing_rules[0]?.rate || 0);
  }, [variant, currentQty]);

  const addonTotal = Object.values(selectedAddons).reduce((acc, curr) => acc + (curr?.price || 0), 0);
  const totalPrice = (basePrice + addonTotal) * currentQty;

  const handleAttributeChange = async (name: string, value: string) => {
    const updatedAttrs = { ...selectedAttrs, [name]: value };
    setSelectedAttrs(updatedAttrs);

    if (name !== "qty") {
      setLoading(true);
      const data = await getVariantDetail(foundItem.item_name, updatedAttrs);
      if (data) {
        setVariant(data);
        setSelectedAddons({}); // Reset jasa jika spek produk berubah
      }
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!variant) return;
    const token = localStorage.getItem("token"); 
    if (!token) {
      setPopup({ isOpen: true, title: "Perlu Login", message: "Silakan login dulu.", type: "warning" });
      return;
    }

    setCartLoading(true);
    const imageUrl = foundItem.image_url || "";

    try {
      // Masukkan Produk Utama
      await addToCart({
        item_code: variant.item_code,
        variant_name: variant.variant_name,
        qty: currentQty,
        price: basePrice,
        image_url: imageUrl
      }, token);

      // Masukkan Semua Jasa yang dipilih
      for (const addon of Object.values(selectedAddons)) {
        if (addon) {
          await addToCart({
            item_code: addon.item_code,
            variant_name: `${addon.name_variant} - ${addon.item_code.split('-').pop() || ""}`,
            qty: currentQty,
            price: addon.price,
            image_url: imageUrl
          }, token);
        }
      }
      setPopup({ isOpen: true, title: "Berhasil!", message: "Masuk keranjang.", type: "success" });
    } catch (err) {
      setPopup({ isOpen: true, title: "Gagal", message: "Cek koneksi lu.", type: "error" });
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8 relative">
      <AlertPopup 
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoClose={popup.type === "success" ? 3000 : undefined} 
        onCancel={() => setPopup({ ...popup, isOpen: false })}
        onConfirm={popup.type === "warning" ? () => router.push("/login") : undefined} 
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 p-6 rounded-2xl border border-base-content/5">
            <ProductCarousel image={foundItem.image_url} name={foundItem.item_name} />
            <div className="flex flex-col">
              <h1 className="text-3xl font-black uppercase mb-6">{foundItem.item_name}</h1>
              <div className={`space-y-6 ${loading ? "opacity-40" : ""}`}>
                <FormPesan fields={dynamicFields} values={selectedAttrs} onValueChange={handleAttributeChange} />
                
                {/* {Object.keys(groupedAddons).length > 0 && (
                  <div className="pt-4 border-t border-base-content/10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Opsi Tambahan</p>
                    {Object.entries(groupedAddons).map(([groupName, addons]) => (
                      <div key={groupName} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase opacity-60">{groupName}</label>
                        <select 
                          className="select select-bordered w-full rounded-xl"
                          value={selectedAddons[groupName]?.item_code || ""}
                          onChange={(e) => {
                            const val = addons.find(a => a.item_code === e.target.value) || null;
                            setSelectedAddons(prev => ({ ...prev, [groupName]: val }));
                          }}
                        >
                          <option value="">Tanpa {groupName}</option>
                          {addons.map(a => (
                            <option key={a.item_code} value={a.item_code}>
                              {a.item_code.split('-').pop()} (+ Rp {a.price.toLocaleString("id-ID")})
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
              <button onClick={handleAddToCart} disabled={cartLoading || loading || !variant} className="btn btn-primary mt-8 rounded-2xl font-black">
                {cartLoading ? <span className="loading loading-spinner"></span> : "TAMBAH KERANJANG"}
              </button>
            </div>
          </div>
          <ProductRow title="Produk Serupa" data={recommendations} />
        </div>

        <div className="hidden lg:block space-y-4">
          <div className="card bg-base-100 p-6 rounded-2xl border border-base-content/10 shadow-sm">
             <h3 className="text-[10px] font-black uppercase opacity-40 mb-4 flex items-center gap-2"><CreditCard size={14}/> Ringkasan</h3>
             <div className="space-y-2 text-xs font-bold uppercase">
                <div className="flex justify-between"><span>Harga</span><span>Rp {basePrice.toLocaleString("id-ID")}</span></div>
                {addonTotal > 0 && <div className="flex justify-between text-primary"><span>Jasa</span><span>+ Rp {addonTotal.toLocaleString("id-ID")}</span></div>}
                <div className="divider my-1 opacity-10"></div>
                <div className="text-xl font-black text-primary">Rp {totalPrice.toLocaleString("id-ID")}</div>
             </div>
          </div>
          <FileUpload />
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