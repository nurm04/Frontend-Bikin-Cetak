// @/components/shared/ProductClientLayout.tsx
"use client";

import { useState, useMemo, ReactNode } from "react";
import FormPesan from "../../../../components/shared/FormPesan";
import { VariantDetail, getVariantDetail, ItemTemplate, VariantLainnya } from "@/services/itemService"; 
import { addToCart } from "@/services/cartService";
import { useRouter } from "next/navigation";
import ProductCarousel from "@/components/shared/ProductCarousel";
import ProductRow from "@/components/shared/ProductRow";
import FileUpload from "@/components/ui/FileUpload";
import { CheckCircle, Truck, ShieldCheck, Award, ShoppingBag } from "lucide-react";
import AlertPopup from "@/components/ui/AlertPopup";
// Import helper yang sudah diperbaiki
import { parseVariantsToFields, DynamicFormField } from "@/lib/variantHelper"; 

interface RecommendationItem {
  name: string;
  image: string;
}

interface ProductClientLayoutProps {
  foundItem: ItemTemplate; 
  allVariants: VariantDetail[]; 
  initialVariant: VariantDetail | null;
  recommendations: RecommendationItem[];
}

export default function ProductClientLayout({ foundItem, allVariants, initialVariant, recommendations }: ProductClientLayoutProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<VariantDetail | null>(initialVariant);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartLoading, setCartLoading] = useState<boolean>(false);
  
  const [selectedAddons, setSelectedAddons] = useState<Record<string, VariantLainnya | null>>({});

  // FIXED: Logic dynamicFields tanpa error mapping
  const dynamicFields = useMemo<DynamicFormField[]>(() => {
    return parseVariantsToFields(allVariants, foundItem.item_name);
  }, [allVariants, foundItem.item_name]);

  // FIXED: Inisialisasi selectedAttrs
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = { qty: "1" };
    // Gunakan dynamicFields langsung
    dynamicFields.forEach(f => {
      if (f.options && f.options.length > 0) {
        initial[f.name] = f.options[0];
      }
    });
    return initial;
  });

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, title: "", message: "", type: "info" });

  const currentQty = parseInt(selectedAttrs.qty || "1", 10);

  const basePrice = useMemo(() => {
    if (!variant || !variant.pricing_rules) return 0;
    const rule = variant.pricing_rules.find(
      r => currentQty >= r.min_qty && (r.max_qty === 0 || currentQty <= r.max_qty)
    );
    return rule ? rule.rate : variant.pricing_rules[0]?.rate || 0;
  }, [variant, currentQty]);

  const addonPrice = Object.values(selectedAddons).reduce((sum, addon) => sum + (addon?.price || 0), 0);
  const totalPrice = (basePrice + addonPrice) * currentQty;

  const handleAttributeChange = async (name: string, value: string) => {
    const updatedAttrs = { ...selectedAttrs, [name]: value };
    setSelectedAttrs(updatedAttrs);

    if (name !== "qty") {
      setLoading(true);
      const data = await getVariantDetail(foundItem.item_name, updatedAttrs);
      if (data) {
        setVariant(data);
        setSelectedAddons({});
      }
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!variant) return;
    const token = localStorage.getItem("token"); 

    if (!token) {
      setPopup({ isOpen: true, title: "Perlu Login", message: "Silakan login.", type: "warning" });
      return;
    }

    setCartLoading(true);
    const imageUrl = foundItem.image_url || ""; 

    try {
      await addToCart({
        item_code: variant.item_code,
        variant_name: variant.variant_name,
        qty: currentQty,
        price: basePrice,
        image_url: imageUrl
      }, token);

      const addons = Object.values(selectedAddons);
      for (const addon of addons) {
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
      setPopup({ isOpen: true, title: "Gagal", message: "Koneksi bermasalah", type: "error" });
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
        confirmText="Login Sekarang"
        cancelText="Tutup"
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-content/5">
              <ProductCarousel image={foundItem.image_url} name={foundItem.item_name} />

              <div className="flex flex-col h-full">
                <h1 className="text-3xl font-bold mb-6 uppercase tracking-tighter">{foundItem.item_name}</h1>

                <div className="space-y-6">
                  {/* ... Bagian tabel pricing_rules ... */}
                  <div className="divider"></div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">Spesifikasi Cetak</p>
                    <div className="bg-base-200/30 p-4 rounded-2xl border border-base-content/5 space-y-4">
                      <FormPesan 
                        fields={dynamicFields} 
                        values={selectedAttrs}
                        onValueChange={handleAttributeChange} 
                      />
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                <div className="flex items-center justify-end gap-4">
                  <button onClick={handleAddToCart} disabled={cartLoading || loading || !variant} className="btn btn-primary shadow-lg uppercase font-bold rounded-2xl px-6">
                    {cartLoading ? <span className="loading loading-spinner"></span> : <><ShoppingBag size={18} /> Tambah Keranjang</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}