"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="fade-up cyber-card w-full max-w-md p-10 text-center">
        <h1 className="cyber-title text-4xl font-bold mb-8 tracking-widest">
          CYBER_AUTH
        </h1>
        
        <div className="flex flex-col gap-4">
          <Link href="/tampilan/login" className="cyber-btn block w-full text-center">
            LOGIN
          </Link>
          
          <Link href="/tampilan/register" className="cyber-btn block w-full text-center !bg-none !bg-slate-800 border border-cyan-500/50">
            REGISTER
          </Link>

          <div className="my-4 text-slate-500 text-sm">OR CONNECT WITH</div>

          
          <a 
            href="/api/login-google" 
            className="cyber-btn !bg-white !text-black hover:!shadow-[0_0_20px_white] w-full block text-center"
          >
            GOOGLE ACCOUNT
          </a>
        </div>
      </div>
    </main>
  );
}