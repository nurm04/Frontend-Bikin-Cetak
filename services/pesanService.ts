// @/services/pesanService.ts

export interface OrderItem {
  item_code: string;
  item_name: string;
  qty: number;
  rate: number;
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

export async function createOrder(data: OrderRequest): Promise<OrderResponse | null> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Gagal membuat pesanan");

    return await response.json();
  } catch (error) {
    if (error instanceof Error) console.error("Order Service Error:", error.message);
    return null;
  }
}