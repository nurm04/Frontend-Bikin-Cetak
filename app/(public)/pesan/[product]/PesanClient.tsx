"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { createOrder, OrderItem } from "@/services/pesanService";
import Link from "next/link";

interface CartStorageItem {
  id: number;
  item_code: string;
  variant_name: string;
  qty: number;
  price: number;
  image_url?: string;
}

declare global {
  interface Window {
    snap: { pay: (token: string, options: object) => void; };
  }
}

export default function PesanClient() {
  const router = useRouter();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounting, setIsMounting] = useState<boolean>(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  const loadCheckoutData = useCallback(() => {
    const savedData = localStorage.getItem("checkout_items");
    if (!savedData) return router.push("/cart");

    try {
      const parsedItems: CartStorageItem[] = JSON.parse(savedData);
      setItems(parsedItems.map(item => ({
        item_code: item.item_code,
        item_name: item.variant_name || "Produk Bikin Cetak",
        qty: Number(item.qty),
        rate: Number(item.price)
      })));
    } catch (e) { router.push("/cart"); }
    finally { setIsMounting(false); }
  }, [router]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    loadCheckoutData();
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-xxxxxxxx";
    const script = document.createElement("script");
    script.src = midtransScriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);
    return () => { 
      const existingScript = document.querySelector(`script[src="${midtransScriptUrl}"]`);
      if (existingScript) document.body.removeChild(existingScript); 
    };
  }, [loadCheckoutData]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sesi login Anda sudah habis. Silakan login kembali.");
      router.push("/login");
      return;
    }

    setLoading(true);
    
    const payload = { 
      address_name: "Nurm house-Shipping", 
      items: items 
    };

    console.log("PAYLOAD GOLANG:", JSON.stringify(payload, null, 2));

    const result = await createOrder(payload, token); 

    if (result?.snap_token) {
      window.snap.pay(result.snap_token, {
        onSuccess: () => { 
          localStorage.removeItem("checkout_items"); 
          router.push("/orders"); 
        },
        onError: () => { alert("Pembayaran Gagal!"); }
      });
    } else {
      alert("Gagal membuat pesanan. Cek log console!");
    }
    
    setLoading(false);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);

  if (isMounting) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="breadcrumbs text-[10px] uppercase font-black opacity-40 tracking-widest">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/cart">Keranjang</Link></li>
              <li>Checkout</li>
            </ul>
          </div>
          <Link href="/cart" className="btn btn-ghost btn-xs gap-2 uppercase font-bold opacity-60">
            <ArrowLeft size={14} /> Kembali ke Keranjang
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-content/5">
              <div className="flex items-center gap-3 mb-6 border-b border-base-content/5 pb-4">
                <MapPin className="text-primary" size={20} />
                <h2 className="text-xl font-black uppercase tracking-tight">Lokasi Pengiriman</h2>
              </div>
              
              <div className="bg-base-200/50 p-6 rounded-2xl border border-dashed border-base-300 flex justify-between items-center">
                <div>
                  <p className="font-black text-sm uppercase italic tracking-tighter">Rumah Budi</p>
                  <p className="text-xs font-bold opacity-60 mt-1">Gresik, Jawa Timur - 61121</p>
                </div>
                <button className="btn btn-ghost btn-xs uppercase font-bold text-[10px] opacity-50">Ubah</button>
              </div>
            </div>

            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-content/5">
              <div className="flex items-center gap-3 mb-6 border-b border-base-content/5 pb-4">
                <ShoppingBag className="text-primary" size={20} />
                <h2 className="text-xl font-black uppercase tracking-tight">Pesanan Anda ({items.length})</h2>
              </div>
              
              <div className="divide-y divide-base-content/5">
                {items.map((item, idx) => (
                  <div key={idx} className="py-6 flex flex-col sm:flex-row gap-6 items-start">
                    
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-base-200 flex-shrink-0 border border-base-content/5">
                      <Image 
                        src="/favicon.ico" 
                        alt="icon" 
                        fill 
                        sizes="96px"
                        className="object-contain p-4 opacity-40" 
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="font-black uppercase text-sm tracking-tight leading-tight">
                        {item.item_name.split("-")[0] || item.item_name}
                      </h3>
                      <p className="text-xs font-bold text-primary">Rp {item.rate.toLocaleString("id-ID")} / pcs</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge badge-ghost text-[9px] uppercase font-bold opacity-60 py-3">
                          VARIAN: {item.item_name.split("-").slice(1).join(" ") || "DEFAULT"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase opacity-50">Jumlah:</span>
                        <span className="text-sm font-black">{item.qty}</span>
                      </div>
                      <p className="font-black text-sm text-primary">
                        Rp {(item.qty * item.rate).toLocaleString("id-ID")}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="card bg-base-100 border-2 border-base-content/10 shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-8 flex items-center gap-2">
                    <CreditCard size={14} /> Detail Pembayaran
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[10px] font-bold uppercase opacity-60">Subtotal Produk</span>
                      <span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[10px] font-bold uppercase opacity-60">Biaya Layanan</span>
                      <span className="font-bold">Rp 0</span>
                    </div>
                    <div className="divider opacity-10 my-0"></div>
                    <div className="flex flex-col gap-1 pt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Tagihan</span>
                      <span className="text-3xl font-black text-primary italic tracking-tighter leading-none">
                        Rp {subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    disabled={loading || items.length === 0}
                    className="btn btn-primary btn-block rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 h-16 text-xs"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Konfirmasi & Bayar"}
                  </button>

                  <p className="text-[8px] text-center mt-6 opacity-40 font-bold uppercase tracking-tighter leading-relaxed">
                    Pemesanan diproses otomatis setelah pembayaran diverifikasi oleh Midtrans.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}