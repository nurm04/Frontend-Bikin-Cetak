// @/services/pesanService.ts

export interface JasaTambahan {
  item_code: string;
  price: number;
}

export interface OrderItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
  jasa_tambahan?: JasaTambahan[]; // Tambahin biar gak error pas kirim addons
}

export interface OrderRequest {
  address_name: string;
  items: OrderItem[];
}

export interface OrderResponse {
  message: string;
  snap_token: string;
  order_id: string;
}

const API_URL = "https://bikincetak-api.up.railway.app/v1/order";

/**
 * Membuat pesanan ke backend Golang.
 * Return null jika terjadi error jaringan atau server.
 */
export async function createOrder(data: OrderRequest, token: string): Promise<OrderResponse | null> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("ALASAN DITOLAK GOLANG:", responseData);
      // Lempar error agar ditangkap oleh blok catch di bawah atau di komponen
      throw new Error(responseData.error || responseData.message || "Gagal membuat pesanan");
    }

    // Pastikan responseData sesuai dengan OrderResponse
    return responseData as OrderResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Order Service Error:", error.message);
    }
    return null;
  }
}