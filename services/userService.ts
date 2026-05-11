// @/services/userService.ts
export interface UserProfile {
  email: string;
  full_name?: string;
  phone?: string;
}

const API_URL = "https://bikincetak-api.up.railway.app/v1/user/profile";

export async function getUserProfile(): Promise<{ data?: UserProfile; error?: string }> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      cache: "no-store",
    });

    const resData = await response.json();

    if (!response.ok) {
      return { error: resData.message || "Gagal mengambil profil" };
    }

    return { data: resData.data || resData };
  } catch (error) {
    return { error: "Koneksi ke server terputus." };
  }
}