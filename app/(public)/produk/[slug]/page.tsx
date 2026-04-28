// @/app/(public)/produk/[slug]/page.tsx
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import ProductRow from "@/components/shared/ProductRow";
import ProductCarousel from "@/components/ui/ProductCarousel";
import { CheckCircle, Truck, ShieldCheck, Award } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import FileUpload from "@/components/ui/FileUpload";
import { getItems, getVariantDetail } from "@/services/itemService";
import ProductAction from "@/components/shared/ProductAction";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Produk({ params }: PageProps) {
  const { slug } = await params;
  const itemGroups = await getItems();
  
  const currentGroup = itemGroups.find((group) => 
    group.templates.some((t) => slugify(t.item_name) === slug)
  );
  
  if (!currentGroup) return notFound();
  
  const foundItem = currentGroup.templates.find(
    (t) => slugify(t.item_name) === slug
  );
  
  if (!foundItem) return notFound();

  const mappedFields = foundItem.attributes.map((attr) => ({
    name: attr.attribute,
    label: attr.attribute,
    type: "select",
    options: attr.attribute_values.map((v) => v.attribute_value),
  }));

  const initialAttributes: Record<string, string> = {};
  mappedFields.forEach(field => {
    if (field.options && field.options.length > 0) {
      initialAttributes[field.name] = field.options[0]; 
    }
  });

  const initialVariant = await getVariantDetail(foundItem.item_name, initialAttributes);

  const products = currentGroup.templates;
  const recommendations = products
    .filter((item) => item.item_name !== foundItem.item_name)
    .slice(0, 4)
    .map((item) => ({
      name: item.item_name,
      image: item.image_url || "/images/placeholder-product.jpg"
    }));

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

                <ProductAction 
                  initialVariant={initialVariant} 
                  itemName={foundItem.item_name}
                  mappedFields={mappedFields}
                />

                <div className="divider"></div>

                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="lg:hidden text-right">
                    <p className="text-[10px] font-bold uppercase opacity-40 leading-none mb-1">Total Estimasi</p>
                    <p className="text-xl font-black text-primary italic">Rp {initialVariant?.pricing_rules[0]?.rate.toLocaleString("id-ID") || "0.000"}</p>
                  </div>
                  <Link
                    href="/cart"
                    className="btn btn-primary shadow-lg shadow-primary/20 uppercase font-bold rounded-2xl px-6"
                  >
                    Tambah Keranjang
                  </Link>
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
                        <td>
                          {rule.estimasi}
                        </td>
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
              <ProductRow
                title="Produk Lainnya"
                data={recommendations}
              />
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
                    <p className="text-2xl font-black text-primary">Rp {initialVariant?.pricing_rules[0]?.rate.toLocaleString("id-ID") || "0.000"}</p>
                  </div>
                  <Link href={"/cart"} className="btn btn-primary w-full rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2">
                    Beli
                  </Link>
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