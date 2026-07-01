"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/api/forgot-password/route";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await resetPassword(token, password);
      alert("Password berhasil diperbarui!");
      window.location.href = "/tampilan/login"; // Arahkan kembali ke login
    }catch (err: unknown) {
  if (err instanceof Error) {
    alert(err.message);
  } else {
    alert("Terjadi kesalahan yang tidak diketahui");
  }
}finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cyber-card p-8 w-full max-w-md">
      <h1 className="text-2xl mb-4">Set Password Baru</h1>
      <input
        type="password"
        className="cyber-input w-full mb-4"
        placeholder="Password Baru"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="cyber-btn w-full" disabled={isLoading}>
        {isLoading ? "UPDATING..." : "SIMPAN PASSWORD"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen items-center justify-center">
        <ResetForm />
      </div>
    </Suspense>
  );
}