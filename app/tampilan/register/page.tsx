"use client";

import { useEffect, useState } from "react";
import { validateRegister, sanitize } from "@/app/api/security/security";

type ToastType = "success" | "error" | "loading";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: ToastType;
    title: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;

    if (toast.type === "loading") return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanEmail = sanitize(email);

    const validation = validateRegister(username, password);

    if (!validation.success) {
      setToast({
        type: "error",
        title: "Register Gagal",
        message: validation.message,
      });
      return;
    }

    setLoading(true);

    setToast({
      type: "loading",
      title: "Memproses...",
      message: "Sedang membuat akun...",
    });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: validation.data.username,
          email: cleanEmail,
          password: validation.data.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          title: "Register Gagal",
          message: data.error || "Registrasi gagal",
        });
        return;
      }

      setToast({
        type: "success",
        title: "Berhasil",
        message: "Registrasi berhasil Cek E-mail.",
      });

      setUsername("");
      setEmail("");
      setPassword("");
    } catch {
      setToast({
        type: "error",
        title: "Server Error",
        message: "Tidak dapat terhubung ke server.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md space-y-6 p-8 cyber-card fade-up"
      >
        <h1 className="text-3xl font-bold text-center cyber-title">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="cyber-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="cyber-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="cyber-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full cyber-btn disabled:opacity-50"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </form>

      {toast && (
        <div className="cyber-toast-overlay">
          <div className={`cyber-toast ${toast.type}`}>
            {toast.type === "loading" && <div className="cyber-spinner" />}

            <h2 className="cyber-toast-title">{toast.title}</h2>

            <p className="cyber-toast-message">{toast.message}</p>

            {toast.type !== "loading" && (
              <button
                onClick={() => setToast(null)}
                className="mt-6 px-5 py-2 rounded-lg border border-cyan-400/30 bg-white/5 hover:bg-white/10 transition"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}