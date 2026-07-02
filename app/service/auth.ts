import { validateRegister } from "@/app/api/security/security";

export const runtime = "edge";

import validator from "validator";

// Fungsi untuk request email lupa password
export const forgotPassword = async (email: string) => {
  // 1. Validasi Email di sisi client agar tidak ada payload berbahaya
  if (!validator.isEmail(email)) {
    throw new Error("Format email tidak valid");
  }

  const response = await fetch(
    "http://localhost:8080/forgot-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) throw new Error("Gagal mengirim link reset");
  return response.json();
};

// Fungsi untuk kirim password baru
export const resetPassword = async (token: string, new_password: string) => {
  // 2. Validasi password menggunakan security.ts yang sudah kamu buat
  // Ini akan memfilter karakter aneh seperti union, select, drop, dll
  const validation = validateRegister("dummyuser", new_password);

  if (!validation.success) {
    throw new Error(validation.message);
  }

  const response = await fetch(
    "http://localhost:8080/reset-password",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, new_password }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Gagal mereset password");
  }

  return response.json();
};
