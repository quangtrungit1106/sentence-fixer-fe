import type { UserDto, UserResponseDto } from "../types/user";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/";

export async function fetchProfile(token: string): Promise<UserDto> {
  const res = await fetch(`${API_BASE}users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data: UserResponseDto = await res.json();
  if (data.statusCode !== 200) {
    throw new Error("Get profile failed");
  }
  return data.data; // Assuming the API returns an array of users, we take the first one
}
