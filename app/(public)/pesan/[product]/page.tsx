// @/app/(public)/pesan/[product]/page.tsx
import { PRODUCT_CATEGORIES } from "@/lib/data";
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FormPesan from "@/components/shared/FormPesan";
import FileUpload from "@/components/ui/FileUpload";

interface PageProps {
  params: Promise<{ product: string }>;
}

export default async function LayoutPesan({ params }: PageProps) {
  const { product } = await params;

  // Cari kategori yang punya produk tersebut
  const category = PRODUCT_CATEGORIES.find((cat) =>
    cat.submenu.some((item) => slugify(item.name) === product)
  );
  
  const productData = category?.submenu.find((item) => slugify(item.name) === product);

  if (!productData || !category) return notFound();

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="breadcrumbs text-[10px] uppercase font-bold opacity-50">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href={`/produk/${product}`}>{productData.name}</Link></li>
              <li>Konfirmasi Pesanan</li>
            </ul>
          </div>
          <Link href={`/produk/${product}`} className="btn btn-ghost btn-xs gap-2 uppercase font-bold opacity-70">
            <ArrowLeft size={14} /> Kembali
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FormPesan fields={productData.fields} />

            <FileUpload />
          </div>

          <div className="lg:col-span-1">
            <fieldset className="fieldset bg-base-100 border-base-content/5 rounded-lg border p-8 shadow-md sticky top-24">
              <legend className="fieldset-legend text-primary font-black uppercase tracking-widest px-4">
                Total
              </legend>

              <div className="">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-[10px] font-bold uppercase text-primary mb-1">Total Estimasi</p>
                  <p className="text-2xl font-black text-primary">{productData.price}</p>
                </div>

                <button className="btn btn-primary w-full rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 mt-2">
                  Beli
                </button>
              </div>
            </fieldset>
          </div>

        </div>
      </div>
    </main>
  );
}