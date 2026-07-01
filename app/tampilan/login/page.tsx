"use client";

import { useState, FormEvent } from "react";
import { forgotPassword } from "@/app/service/auth";
import { validateRegister } from "@/app/api/security/security";

type ToastType = "success" | "error" | "loading";

interface ToastState {
  show: boolean;
  type: ToastType | null;
  title: string;
  message: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isForgotMode, setIsForgotMode] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: null,
    title: "",
    message: "",
  });

  const showToast = (type: ToastType, title: string, message: string): void => {
    setToast({ show: true, type, title, message });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleForgotPassword = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgotPassword(email);
      showToast(
        "success",
        "Berhasil",
        "Link reset telah dikirim ke email Anda",
      );
      setIsForgotMode(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengirim link reset";
      showToast("error", "Gagal", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const validation = validateRegister(username, password);
    if (!validation.success) {
      showToast("error", "Input Tidak Valid", validation.message);
      return;
    }

    setIsLoading(true);
    showToast("loading", "Authenticating...", "Mohon tunggu sebentar");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: { message?: string } = await res.json();

      if (res.ok) {
        showToast("success", "Success", "Login berhasil!");
      } else {
        showToast(
          "error",
          "Login Gagal",
          data.message || "Username atau password salah",
        );
      }
    } catch (err: unknown) {
      showToast("error", "Error", "Terjadi kesalahan koneksi ke server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="cyber-card p-8 w-full max-w-md fade-up">
        <h1 className="cyber-title text-3xl text-center mb-8 font-bold">
          {isForgotMode ? "RESET PASSWORD" : "LOGIN"}
        </h1>

        {isForgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 opacity-80">
                Masukkan Email
              </label>
              <input
                type="email"
                className="cyber-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="cyber-btn w-full"
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "KIRIM LINK RESET"}
            </button>
            <button
              type="button"
              onClick={() => setIsForgotMode(false)}
              className="text-xs opacity-60 w-full underline"
            >
              Kembali ke Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 opacity-80">Username</label>
              <input
                type="text"
                className="cyber-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-80">Password</label>
              <input
                type="password"
                className="cyber-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setIsForgotMode(true)}
              className="text-xs opacity-60 underline"
            >
              Lupa password?
            </button>

            <button
              type="submit"
              className="cyber-btn w-full"
              disabled={isLoading}
            >
              {isLoading ? "PROCESSSING..." : "MASUK"}
            </button>
          </form>
        )}
      </div>

      {toast.show && (
        <div className="cyber-toast-overlay">
          <div className={`cyber-toast ${toast.type || ""}`}>
            {toast.type === "loading" && <div className="cyber-spinner"></div>}
            <div className="cyber-toast-title">{toast.title}</div>
            <div className="cyber-toast-message">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
