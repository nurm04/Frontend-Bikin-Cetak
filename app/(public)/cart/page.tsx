import { PRODUCT_CATEGORIES } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartPage() {
 
  const cartItems = [
    {
      ...PRODUCT_CATEGORIES[0].submenu[0],
      id: "cart-1",
      quantity: 2,
      specs: { material: "Vinyl White", cutting: "Kiss Cut" }
    },
    {
      ...PRODUCT_CATEGORIES[2].submenu[0],
      id: "cart-2",
      quantity: 1,
      specs: { size: "60x160cm", material: "Albatros" }
    }
  ];

  const subtotal = 215000;

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="breadcrumbs text-[10px] uppercase font-black opacity-40 tracking-widest">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li>Keranjang Belanja</li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost btn-xs gap-2 uppercase font-bold opacity-60">
            <ArrowLeft size={14} /> Lanjut Belanja
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-content/5">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="text-primary" size={20} />
                <h2 className="text-xl font-black uppercase tracking-tight">Pesanan Anda ({cartItems.length})</h2>
              </div>

              <div className="divide-y divide-base-content/5">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-base-200 flex-shrink-0 border border-base-content/5">
											<Image 
												src={item.image} 
												alt={item.name} 
												fill
												sizes="96px"
												className="object-cover"
											/>
										</div>

                    <div className="flex-1 space-y-1">
                      <h3 className="font-black uppercase text-sm tracking-tight leading-tight">{item.name}</h3>
                      <p className="text-xs font-bold text-primary">{item.price} / pcs</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.entries(item.specs).map(([key, val]) => (
                          <span key={key} className="badge badge-ghost text-[9px] uppercase font-bold opacity-60 py-3">
                            {key}: {val as string}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-4">
                      <div className="flex items-center bg-base-200 rounded-xl p-1">
                        <button className="btn btn-ghost btn-xs btn-square"><Minus size={12}/></button>
                        <span className="px-3 text-xs font-black">{item.quantity}</span>
                        <button className="btn btn-ghost btn-xs btn-square"><Plus size={12}/></button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <p className="font-black text-sm">Rp 30.000</p>
                        <button className="btn btn-ghost btn-xs text-error btn-square">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4">
              <div className="card bg-base-100 border border-base-content/10 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-6">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Subtotal</span>
                      <span className="font-bold">Rp 215.000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Biaya Admin</span>
                      <span className="font-bold">Rp 0</span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-widest">Total</span>
                      <span className="text-2xl font-black text-primary leading-none">Rp 215.000</span>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-block rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30 h-14">
                    Checkout Sekarang
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