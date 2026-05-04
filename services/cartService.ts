// @/services/cartService.ts
"use server";

const BASE_URL = "https://bikincetak-api.up.railway.app/v1/cart";

export interface CartPayload {
  item_code: string;
  variant_name: string;
  qty: number;
  price: number;
  image_url: string;
}

export async function addToCart(payload: CartPayload, token: string) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || "Gagal menambahkan ke keranjang" };
    }

    return { success: true, message: "Berhasil ditambahkan ke keranjang!", data };
  } catch (error) {
    return { error: "Gagal terhubung ke server percetakan." };
  }
}

export async function getCartItems(token: string) {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      cache: "no-store"
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || "Gagal mengambil data keranjang" };
    }

    return { data: data.data || data }; 
  } catch (error) {
    return { error: "Gagal terhubung ke server percetakan." };
  }
}

export async function updateCartItemQty(id: number, qty: number, token: string) {
  if (!id || id === 0) return { error: "ID pesanan tidak valid" };

  try {
    const url = `${BASE_URL}/${id}`;
    
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ qty: Number(qty) }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Respons bukan JSON:", text);
      return { error: `Server error (${response.status}). Cek terminal.` };
    }

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Gagal update jumlah" };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("FETCH ERROR:", error);
    return { error: "Koneksi ke API terputus atau timeout." };
  }
}

export async function deleteCartItem(id: number, token: string) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) return { error: data.message || "Gagal menghapus pesanan" };
    return { success: true, data };
  } catch (error) {
    return { error: "Gagal terhubung ke server." };
  }
}