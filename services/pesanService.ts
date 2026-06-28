/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { cookies } from "next/headers";

export interface OrderRequest {
  address_name: string;
  selected_item_ids: string[];
}

export interface OrderResponse {
  message: string;
  snap_token: string;
  order_id: string;
}

export interface OrderResult {
  success: boolean;
  data?: OrderResponse;
  error?: string;
}

const API_URL = "https://bikincetak.up.railway.app/v1/order";

async function getAuthHeader() {
  const cookieStore = await cookies();
  const jwtCookie = cookieStore.get("jwt");
  if (!jwtCookie) return null;
  
  return {
    "Content-Type": "application/json",
    "Cookie": `jwt=${jwtCookie.value}`
  };
}

export async function createOrder(data: OrderRequest): Promise<OrderResult> {
  try {
    const headers = await getAuthHeader();
    
    if (!headers) {
      return { success: false, error: "Sesi login tidak valid atau sudah habis. Silakan login ulang." };
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const textResponse = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(textResponse);
    } catch (e) {
      return { success: false, error: `Server response error: ${textResponse}` };
    }

    if (!response.ok) {
      return { 
        success: false, 
        error: responseData.error || responseData.message || `Gagal membuat pesanan (Status: ${response.status})`
      };
    }

    return { success: true, data: responseData as OrderResponse };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Order Service Error:", error.message);
      return { success: false, error: `Kesalahan jaringan: ${error.message}` };
    }
    return { success: false, error: "Terjadi kesalahan sistem yang tidak diketahui." };
  }
}