import React, { useEffect, useState } from "react";
import { fetchProfile } from "../api/userApi";
import type { UserDto } from "../types/user";
import Navbar from "../components/Navbar";

const MyProfile: React.FC = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const token = localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await fetchProfile(token);
        setUser(userData);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };

    loadProfile();
  }, [token]);

  if (!user) return <div className="p-6">Đang tải thông tin cá nhân...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 p-4 bg-gray-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">👤 Thông tin cá nhân</h2>
      <p className="text-lg mb-2">
        <strong>Họ tên:</strong> {user.fullName}
      </p>
      <p className="text-lg mb-2">
        <strong>Email:</strong> {user.email}
      </p>
    </div>
    </>
    
  );
};

export default MyProfile;
