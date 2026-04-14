import HeroCarousel from "@/components/ui/HeroCarousel";
import ProductRow from "@/components/shared/ProductRow";
import { PRODUCT_CATEGORIES } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-base-200">
      <div className="py-4 md:py-8">
        <HeroCarousel />
      </div>

      <div className="container mx-auto px-4 md:px-12 pb-20">
        {PRODUCT_CATEGORIES.map((category) => (
          <ProductRow 
            key={category.key} 
            title={category.label} 
            data={category.submenu} 
          />
        ))}
      </div>

      <section className="bg-base-100 py-10 border-t border-base-300">
        <div className="container mx-auto px-4 md:px-12 text-center max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">Percetakan Online Terlengkap</h3>
          <p className="text-sm opacity-70">
            Bikin Cetak melayani berbagai kebutuhan promosi bisnis Anda mulai dari Sticker, 
            Banner, Merchandise hingga kebutuhan kantor dengan proses cepat dan harga kompetitif.
          </p>
        </div>
      </section>
    </main>
  );
}