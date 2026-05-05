/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { createOrder, OrderItem } from "@/services/pesanService";
import Link from "next/link";
import CartProductItem from "@/components/shared/CardProductItem";

// @/app/(public)/pesan/checkout/PesanClient.tsx

interface JasaTambahan {
  item_code: string;
  price: number;
}

interface CartStorageItem {
  id: number;
  item_code: string;
  variant_name: string;
  qty: number;
  price: number;
  image_url?: string;
  variant_lainnya?: JasaTambahan[]; // Ganti ini Nur!
}

interface MidtransResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  pdf_url?: string;
  finish_redirect_url?: string;
}

interface CreateOrderResponse {
  snap_token?: string;
  error?: string;
  message?: string;
}

declare global {
  interface Window {
    snap: { pay: (token: string, options: object) => void; };
  }
}

export default function PesanClient() {
  const router = useRouter();
  const [items, setItems] = useState<CartStorageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMounting, setIsMounting] = useState<boolean>(true);

  const loadCheckoutData = useCallback(() => {
    const savedData = localStorage.getItem("checkout_items");
    if (!savedData) return router.push("/cart");

    try {
      const parsedItems: CartStorageItem[] = JSON.parse(savedData);
      setItems(parsedItems);
    } catch (e) { 
      router.push("/cart"); 
    } finally { 
      setIsMounting(false); 
    }
  }, [router]);

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

  const handleCheckout = async (): Promise<void> => {
    if (items.length === 0) return;
    
    const token: string | null = localStorage.getItem("token");
    if (!token) {
      alert("Sesi login Anda sudah habis. Silakan login kembali.");
      router.push("/login");
      return;
    }

    setLoading(true);
    
    // Mapping item dengan menyertakan harga jasa ke dalam rate
    const payload = { 
      address_name: "Nurm house-Shipping", 
      items: items.map(item => {
        // 1. Hitung total harga jasa tambahan untuk item ini
        const totalJasa = (item.variant_lainnya || []).reduce(
          (sum, j) => sum + j.price, 
          0
        );

        return {
          item_code: item.item_code,
          item_name: item.variant_name,
          qty: item.qty,
          // 2. RATE HARUS HARGA DASAR + JASA TAMBAHAN
          rate: item.price + totalJasa, 
          jasa_tambahan: item.variant_lainnya || []
        };
      })
    };

    try {
      const result = await createOrder(payload, token); 

      if (result && result.snap_token) {
        window.snap.pay(result.snap_token, {
          onSuccess: (midtransResult: MidtransResult) => { 
            localStorage.removeItem("checkout_items"); 
            router.push(`/pesan/status/${midtransResult.order_id}`); 
          },
          // ... logic lainnya
        });
      } else {
        alert("Gagal membuat pesanan. Silakan coba lagi atau cek koneksi.");
      }
    } catch (err: unknown) {
      // ... handling error
    } finally {
      setLoading(false);
    }
  };

  const totalBill = items.reduce((acc, item) => {
    const addonPrice = item.variant_lainnya?.reduce((sum, j) => sum + j.price, 0) || 0;
    return acc + ((item.price + addonPrice) * item.qty);
  }, 0);

  if (isMounting) return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs & Kembali */}
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
            {/* Lokasi Pengiriman */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-content/5">
              <div className="flex items-center gap-3 mb-6 border-b border-base-content/5 pb-4">
                <MapPin className="text-primary" size={20} />
                <h2 className="text-xl font-black uppercase tracking-tight">Lokasi Pengiriman</h2>
              </div>
              <div className="bg-base-200/50 p-6 rounded-2xl border border-dashed border-base-300 flex justify-between items-center">
                <div>
                  <p className="font-black text-sm uppercase tracking-tighter">Nurm House</p>
                  <p className="text-xs font-bold opacity-60 mt-1">Sumenep, Madura - 69417</p>
                </div>
                <button className="btn btn-ghost btn-xs uppercase font-bold text-[10px] opacity-50">Ubah</button>
              </div>
            </div>

            {/* Daftar Produk (Menggunakan Komponen CartProductItem) */}
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-content/5">
              <div className="flex items-center gap-3 mb-6 border-b border-base-content/5 pb-4">
                <ShoppingBag className="text-primary" size={20} />
                <h2 className="text-xl font-black uppercase tracking-tight">Ringkasan Produk ({items.length})</h2>
              </div>
              
              <div className="divide-y divide-base-content/5">
                {items.map((item) => (
                  <CartProductItem
                    key={item.id}
                    id={item.id}
                    variant_name={item.variant_name}
                    price={item.price}
                    qty={item.qty}
                    image_url={item.image_url}
                    // Oper ke prop komponen biar tampil baris pipe (|) nya
                    jasa_tambahan={item.variant_lainnya || []} 
                    isReadOnly={true}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Ringkasan Pembayaran */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="card bg-base-100 border-2 border-base-content/10 rounded-2xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-8 flex items-center gap-2">
                    <CreditCard size={14} /> Detail Pembayaran
                  </h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[10px] font-bold uppercase opacity-60">Total Pesanan</span>
                      <span className="font-bold">Rp {totalBill.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="divider opacity-10 my-0"></div>
                    <div className="flex flex-col gap-1 pt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Tagihan</span>
                      <span className="text-3xl font-black text-primary tracking-tighter leading-none">
                        Rp {totalBill.toLocaleString("id-ID")}
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