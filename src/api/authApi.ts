import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}` + `auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!data.statusCode || data.statusCode !== 200) {
    throw new Error(data.message || "Login failed");
  }
  return data.data as LoginResponse;
}

export async function registerUser(
  userData: RegisterRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}` + `auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!data.statusCode || data.statusCode !== 200) {
    throw new Error(data.message || "Register failed");
  }
  return data.data as LoginResponse;
}
