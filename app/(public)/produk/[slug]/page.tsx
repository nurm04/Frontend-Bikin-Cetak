// @/app/(public)/produk/[slug]/page.tsx
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import ProductRow from "@/components/shared/ProductRow";
import ProductCarousel from "@/components/ui/ProductCarousel";
import { CheckCircle, Truck, ShieldCheck, Award } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";
import FormPesan from "@/components/shared/FormPesan";
import FileUpload from "@/components/ui/FileUpload";
// IMPORT SERVICE BARU
import { getItems } from "@/services/itemService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Produk({ params }: PageProps) {
  const { slug } = await params;

  // 1. AMBIL DATA DARI API
  const allItems = await getItems();

  // 2. CARI PRODUK BERDASARKAN SLUG (slugify dari item_name)
  const foundItem = allItems.find((item) => slugify(item.item_name) === slug);

  if (!foundItem) return notFound();

  // 3. KONVERSI ATTRIBUTES API KE FORMAT FIELDS (Buat FormPesan)
  // Biar komponen FormPesan lu nggak error, kita map format API ke format field yang diharapkan
  const mappedFields = foundItem.attributes.map((attr) => ({
    name: attr.attribute, // Nama Select (bahan, ukuran, dll)
    label: attr.attribute,
    type: "select",
    options: attr.attribute_value.map((v) => v.value), // Value dari Select
  }));

  // 4. REKOMENDASI (Ambil 4 produk lain selain yang lagi dibuka)
  const recommendations = allItems
    .filter((item) => item.item_name == foundItem.item_name)
    .slice(0, 4)
    .map((item) => ({
      name: item.item_name,
      image: "/images/placeholder-product.jpg"
    }));

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-content/5">
              
              <ProductCarousel image="/images/placeholder-product.jpg" name={foundItem.item_name} />

              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2 uppercase italic tracking-tighter">
                    {foundItem.item_name}
                  </h1>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Deskripsi Produk</p>
                    <article className="prose prose-sm max-w-none text-base-content/70">
                      <p>Cetak <strong>{foundItem.name}</strong> dengan spesifikasi khusus. Kami menggunakan bahan berkualitas tinggi yang diproses langsung dari gudang produksi kami.</p>
                    </article>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-3">
                      Daftar Harga Grosir
                    </p>
                    <div className="overflow-hidden border border-base-content/10 rounded-2xl">
                      <table className="table table-zebra w-full bg-base-100">
                        <thead className="bg-base-200/50 text-base-content/60">
                          <tr className="border-b border-base-content/10">
                            <th className="text-[10px] font-black uppercase py-3">Jumlah (Qty)</th>
                            <th className="text-[10px] font-black uppercase py-3 text-right">Harga / Pcs</th>
                          </tr>
                        </thead>
                        
                        <tbody className="text-sm font-bold">
                          {[
                            { min: 1, max: 9, price: 19000 },
                            { min: 10, max: 49, price: 17500 },
                            { min: 50, max: 0, price: 15000 },
                          ].map((rule, index) => (
                            <tr key={index} className="border-b border-base-content/5 last:border-none">
                              <td className="py-4">
                                {rule.max === 0 ? `≥ ${rule.min} pcs` : `${rule.min} - ${rule.max} pcs`}
                              </td>
                              <td className="py-4 text-right text-primary font-black italic">
                                Rp {rule.price.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-[9px] mt-2 opacity-40 italic font-medium">
                      *Harga otomatis update berdasarkan pilihan bahan & ukuran.
                    </p>
                  </div>

                  <div className="divider"></div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-40">Spesifikasi</p>
                      <div className="bg-base-200/30 p-4 rounded-2xl border border-base-content/5">
                        <FormPesan fields={mappedFields} />
                      </div>
                    </div>

                    <div className="divider"></div>
                    <div className="flex gap-3 justify-end">
                      <Link
                        href="/cart"
                        className="btn btn-outline btn-primary uppercase font-bold"
                      >
                        Tambah Keranjang
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-3xl border p-8 shadow-md">
              <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
                Informasi Harga Pengerjaan
              </legend>
              <div className="overflow-hidden border border-base-content/10 rounded-2xl">
                <table className="table table-zebra w-full bg-base-100">
                  <thead className="bg-base-200/50 text-base-content/60">
                    <tr className="border-b border-base-content/10">
                      <th className="text-[10px] font-black uppercase py-3">Estimasi Pengerjaan</th>
                      <th className="text-[10px] font-black uppercase py-3 text-right">Harga</th>
                    </tr>
                  </thead>
                  
                  <tbody className="text-sm font-bold">
                    {[
                      { estimasi: "1 hari", price: 19000 },
                      { estimasi: "2 hari", price: 17500 },
                      { estimasi: "3 hari", price: 15000 },
                    ].map((rule, index) => (
                      <tr key={index} className="border-b border-base-content/5 last:border-none">
                        <td className="py-4">
                          {rule.estimasi}
                        </td>
                        <td className="py-4 text-right text-primary font-black italic">
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
              <FileUpload />

              <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-2xl border p-8 shadow-md sticky">
                <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
                  Total
                </legend>

                <div className="">
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <p className="text-[10px] font-bold uppercase text-primary mb-1">Total Estimasi</p>
                    <p className="text-2xl font-black text-primary">Rp 0.000</p>
                  </div>
                  <Link href={"/cart"} className="btn btn-primary w-full rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2">
                    Beli
                  </Link>
                </div>
              </fieldset>

              <div className="card bg-primary text-primary-content shadow-xl shadow-primary/20">
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

              <div className="card bg-base-100 border border-base-300 shadow-sm">
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