import { PRODUCT_CATEGORIES } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import ProductRow from "@/components/shared/ProductRow";
import ProductCarousel from "@/components/ui/ProductCarousel";
import { CheckCircle, Truck, ShieldCheck, Award } from "lucide-react";
import { ReactNode } from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Produk({ params }: PageProps) {
  const { slug } = await params;

  let foundProduct = null;
  let foundCategory = null;

  for (const cat of PRODUCT_CATEGORIES) {
    const product = cat.submenu.find((p) => slugify(p.name) === slug);
    if (product) {
      foundProduct = product;
      foundCategory = cat;
      break;
    }
  }

  if (!foundProduct || !foundCategory) return notFound();

  const recommendations = foundCategory.submenu
    .filter((p) => p.name !== foundProduct?.name)
    .map((p) => ({ 
      name: p.name, 
      price: p.price, 
      image: p.image
    }));

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-3 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-base-100 p-6 rounded-3xl shadow-sm border border-base-content/5">
              
              {/* Menggunakan image produk dari data.tsx */}
              <ProductCarousel image={foundProduct.image} name={foundProduct.name} />

              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2 uppercase">{foundProduct.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="badge badge-primary font-bold uppercase">Terlaris</span>
                    <span className="text-sm opacity-60">Item Code: {foundProduct.item_code_template}</span>
                  </div>
                  <p className="text-4xl font-black text-primary uppercase">
                    {foundProduct.price} <span className="text-sm font-normal text-base-content opacity-60">/ pcs</span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider mb-3 opacity-70">Deskripsi Produk</p>
                    <article className="prose prose-sm max-w-none text-base-content/70">
                      <p>Cetak <strong>{foundProduct.name}</strong> dengan spesifikasi khusus. Kami menggunakan bahan berkualitas tinggi yang diproses langsung dari gudang produksi kami.</p>
                      <ul className="text-[11px] uppercase font-bold list-none mt-2 p-0 space-y-1">
                        {foundProduct.fields.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            {f.label}: {f.options ? f.options.join(", ") : "Custom"}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </div>

                  <div className="divider"></div>

                  <div className="flex gap-3">
                    <button className="btn btn-primary flex-1 shadow-lg shadow-primary/20 uppercase font-bold">Tambah Keranjang</button>
                    <Link 
                      href={`/pesan/${slugify(foundProduct.name)}`} 
                      className="btn btn-outline btn-primary uppercase font-bold"
                    >
                      Beli Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-100 p-8 rounded-3xl shadow-sm border border-base-content/5">
              <div className="tabs tabs-bordered mb-6">
                <a className="tab tab-active font-bold uppercase text-xs">Informasi Grosir</a>
              </div>

              <div className="overflow-x-auto rounded-xl border border-base-300">
                <table className="table table-zebra w-full">
                  <thead className="bg-base-200 uppercase text-[10px]">
                    <tr>
                      <th>Quantity</th>
                      <th>Harga Satuan</th>
                      <th>Estimasi Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-bold">Sesuai Pesanan</td>
                      <td className="text-primary font-bold">{foundProduct.price}</td>
                      <td>1-3 Hari Kerja</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-base-100 px-8 py-4 rounded-3xl shadow-sm border border-base-content/5">
              <ProductRow 
                title={`Lainnya di ${foundCategory.label}`} 
                data={recommendations}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
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
      <p className="font-bold uppercase text-[10px]">{title}</p>
      <p className="opacity-80 text-[10px]">{desc}</p>
    </div>
  </div>
);