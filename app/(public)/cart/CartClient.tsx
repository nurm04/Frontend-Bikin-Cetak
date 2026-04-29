// @/components/shared/CartClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartItems, updateCartItemQty, deleteCartItem } from "@/services/cartService";
import AlertPopup from "@/components/ui/AlertPopup";

interface CartItemAPI {
  id: number;
  item_code: string;
  variant_name: string;
  qty: number;
  price: number;
  image_url?: string;
}

export default function CartClient() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemAPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    idToDelete: number | null;
  }>({ isOpen: false, idToDelete: null });

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Silakan login terlebih dahulu untuk melihat keranjang.");
        router.push("/login");
        return;
      }

      const res = await getCartItems(token);
      
      if (res.error) {
        setError(res.error);
      } else {
        setCartItems(res.data?.items || []); 
      }
      setLoading(false);
    };

    fetchCart();
  }, [router]);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

  const handleUpdateQty = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    
    const token = localStorage.getItem("token");
    if (!token) return;

    setActionLoading(id);

    const res = await updateCartItemQty(id, newQty, token);
    
    if (res.error) {
      alert(res.error);
    } else {
      const newCart = cartItems.map(item => 
        item.id === id ? { ...item, qty: newQty } : item
      );
      setCartItems(newCart);
    }
    
    setActionLoading(null);
  };

  const triggerDelete = (id: number) => {
    setPopup({ isOpen: true, idToDelete: id });
  };

  const confirmDelete = async () => {
    const id = popup.idToDelete;
    if (!id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setActionLoading(id);
    
    const res = await deleteCartItem(id, token);

    if (res.error) {
      alert(res.error);
    } else {
      const newCart = cartItems.filter(item => item.id !== id);
      setCartItems(newCart);
    }

    setPopup({ isOpen: false, idToDelete: null });
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 py-6 px-4 md:px-8 relative">
      
      <AlertPopup 
        isOpen={popup.isOpen}
        title="Hapus Pesanan"
        message="Apakah Anda yakin ingin menghapus pesanan ini dari keranjang belanja?"
        isLoading={actionLoading === popup.idToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setPopup({ isOpen: false, idToDelete: null })}
      />

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

              {error && (
                <div className="alert alert-error text-xs font-bold rounded-xl mb-4">
                  {error}
                </div>
              )}

              {cartItems.length === 0 && !error ? (
                <div className="text-center py-12 opacity-50">
                  <p className="font-bold">Keranjang Anda masih kosong.</p>
                </div>
              ) : (
                <div className="divide-y divide-base-content/5">
                  {cartItems.map((item) => (
                    <div key={item.id} className={`py-6 flex flex-col sm:flex-row gap-6 items-start transition-opacity ${(actionLoading === item.id && !popup.isOpen) ? "opacity-50 pointer-events-none" : ""}`}>
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-base-200 flex-shrink-0 border border-base-content/5">
                        <Image 
                          src={item.image_url || "/images/placeholder-product.jpg"} 
                          alt={item.variant_name} 
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-1">
                        <h3 className="font-black uppercase text-sm tracking-tight leading-tight">
                          {item.variant_name.split("-")[0]} 
                        </h3>
                        <p className="text-xs font-bold text-primary">Rp {item.price.toLocaleString("id-ID")} / pcs</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="badge badge-ghost text-[9px] uppercase font-bold opacity-60 py-3">
                            VARIAN: {item.variant_name.split("-").slice(1).join(" ") || "DEFAULT"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto gap-4">
                        <div className="flex items-center bg-base-200 rounded-xl p-1">
                          <button 
                            onClick={() => handleUpdateQty(item.id, item.qty - 1)} 
                            disabled={actionLoading === item.id}
                            className="btn btn-ghost btn-xs btn-square"
                          >
                            <Minus size={12}/>
                          </button>
                          
                          <span className="px-3 text-xs font-black">
                            {actionLoading === item.id && !popup.isOpen ? <span className="loading loading-spinner loading-xs"></span> : item.qty}
                          </span>
                          
                          <button 
                            onClick={() => handleUpdateQty(item.id, item.qty + 1)} 
                            disabled={actionLoading === item.id}
                            className="btn btn-ghost btn-xs btn-square"
                          >
                            <Plus size={12}/>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <p className="font-black text-sm">Rp {(item.price * item.qty).toLocaleString("id-ID")}</p>
                          <button 
                            onClick={() => triggerDelete(item.id)}
                            disabled={actionLoading === item.id}
                            className="btn btn-ghost btn-xs text-error btn-square hover:bg-error/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="card bg-base-100 border border-base-content/10 shadow-xl rounded-2xl overflow-hidden">
                <div className="p-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-6">Ringkasan Pesanan</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Subtotal</span>
                      <span className="font-bold">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">Biaya Admin</span>
                      <span className="font-bold">Rp 0</span>
                    </div>
                    <div className="divider"></div>
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black uppercase tracking-widest">Total</span>
                      <span className="text-2xl font-black text-primary leading-none">Rp {subtotal.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <button 
                    disabled={cartItems.length === 0}
                    className="btn btn-primary btn-block rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30 h-14"
                  >
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