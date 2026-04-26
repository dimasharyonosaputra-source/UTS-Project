"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url = "https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token";
    const params = new URLSearchParams();
    params.append("client_id", "setoran-mobile-dev");
    params.append("client_secret", "aqJp3xnXKudgC7RMOshEQP7ZoVKWzoSl");
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);
    params.append("scope", "openid profile email");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error_description || "Login gagal. Periksa kembali username & password.");
      
      localStorage.setItem("token_hafalan", data.access_token);
      router.push("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: '#0a0a0a', color: 'white', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#171717', border: '1px solid #262626', padding: '2.5rem 2rem', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
        <Link href="/" style={{ color: '#3b82f6', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          ← Kembali
        </Link>
        
        <h1 style={{ fontSize: '1.875rem', fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em', margin: '0 0 0.5rem 0' }}>
          Login Dosen
        </h1>
        <p style={{ color: '#888', fontSize: '0.875rem', margin: '0 0 2rem 0' }}>Masukkan akun UIN Suska untuk mengakses data.</p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Email / Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="muhammad.fikri@uin-suska.ac.id"
              required
              style={{ width: '100%', backgroundColor: 'black', border: '1px solid #333', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', backgroundColor: 'black', border: '1px solid #333', borderRadius: '0.75rem', padding: '0.875rem 1rem', color: 'white', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '1rem', borderRadius: '0.75rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: loading ? 0.5 : 1, transition: '0.2s' }}
          >
            {loading ? "MEMUAT..." : "MASUK SEKARANG"}
          </button>
        </form>
      </div>
    </div>
  );
}