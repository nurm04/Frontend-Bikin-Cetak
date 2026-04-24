const BASE_URL = "https://bikincetak-api.up.railway.app/v1";

// Interface untuk Register
export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
  number: string;
}

export interface AuthResponse {
  message: string;
  status?: string;
  token?: string;
  data?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();
  if (!response.ok) throw new Error(data.message || "Gagal mendaftar");
  return data;
}

export async function loginUser(payload: Pick<RegisterPayload, 'email' | 'password'>): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: AuthResponse = await response.json();
  if (!response.ok) throw new Error(data.message || "Email atau password salah");
  return data;
}