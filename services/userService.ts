"use server"; // WAJIB ada di baris pertama agar fungsi ini bisa dipanggil Client Component

import { cookies } from "next/headers";

export interface UserProfile {
  email: string;
  full_name?: string;
  phone?: string;
}

const API_URL = "https://bikincetak-api.up.railway.app/v1/user/profile";

export async function getUserProfile() {
  try {
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("jwt");

    // Jika tidak ada cookie, langsung return error tanpa tembak API
    if (!jwtCookie) {
      return { error: "Tidak ada sesi aktif" };
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Format pengiriman cookie manual dari server-to-server
        "Cookie": `jwt=${jwtCookie.value}`
      },
      cache: "no-store",
    });

    // Cek jika status unauthorized
    if (response.status === 401) {
      return { error: "Sesi tidak valid atau expired" };
    }

    const resData = await response.json();

    if (!response.ok) {
      return { error: resData.message || "Gagal mengambil data profil" };
    }

    // Return data user
    return { data: resData.data || resData };
  } catch (error) {
    console.error("USER_SERVICE_ERROR:", error);
    return { error: "Gagal terhubung ke server backend." };
  }
}