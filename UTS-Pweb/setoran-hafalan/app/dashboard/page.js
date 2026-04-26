"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [dataDosen, setDataDosen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token_hafalan");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("https://api.tif.uin-suska.ac.id/setoran-dev/v1/dosen/pa-saya", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Gagal mengambil data");
        setDataDosen(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token_hafalan");
    router.push("/login");
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>Memuat Data Mahasiswa...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>{error} <br/><button onClick={handleLogout}>Login Ulang</button></div>;

  const filteredMahasiswa = dataDosen?.info_mahasiswa_pa?.daftar_mahasiswa.filter((mhs) => {
    const keyword = searchTerm.toLowerCase();
    return mhs.nama.toLowerCase().includes(keyword) || mhs.nim.includes(keyword);
  }) || [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6', margin: 0, fontStyle: 'italic' }}>DASHBOARD PA</h1>
          <h2 style={{ fontSize: '1.2rem', margin: '0.5rem 0 0 0' }}>{dataDosen?.nama}</h2>
          <p style={{ color: '#888', margin: 0, fontSize: '0.9rem' }}>NIP: {dataDosen?.nip} | {dataDosen?.email}</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
          LOGOUT
        </button>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Daftar Mahasiswa ({filteredMahasiswa.length})</h3>
        <input 
          type="text" 
          placeholder="Cari Nama atau NIM..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '0.75rem 1rem', width: '100%', maxWidth: '300px', borderRadius: '2rem', 
            backgroundColor: '#171717', border: '1px solid #333', color: 'white', outline: 'none' 
          }}
        />
      </div>

      {/* GRID MAHASISWA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredMahasiswa.map((mhs, index) => (
          <div key={index} style={{ backgroundColor: '#171717', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #262626' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{mhs.nama}</h4>
                <p style={{ color: '#3b82f6', margin: 0, fontSize: '0.9rem', fontFamily: 'monospace' }}>{mhs.nim}</p>
              </div>
              <span style={{ backgroundColor: '#262626', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 'bold' }}>
                Akt {mhs.angkatan}
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Semester</span> <strong>{mhs.semester}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Setoran</span> <strong>{mhs.info_setoran.total_sudah_setor} / {mhs.info_setoran.total_wajib_setor}</strong>
              </div>
            </div>
            
            {/* PROGRESS BAR */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                <span style={{ color: '#888' }}>Progres Hafalan</span>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{mhs.info_setoran.persentase_progres_setor}%</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#262626', borderRadius: '1rem', height: '8px' }}>
                <div style={{ 
                  backgroundColor: '#3b82f6', height: '100%', borderRadius: '1rem', 
                  width: `${mhs.info_setoran.persentase_progres_setor}%` 
                }}></div>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/dashboard/${mhs.nim}`)}
              style={{ 
                width: '100%', marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#262626', 
                color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' 
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#3b82f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#262626'}
            >
              Lihat Detail Setoran
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}