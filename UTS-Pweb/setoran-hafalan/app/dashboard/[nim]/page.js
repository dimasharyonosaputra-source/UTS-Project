"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DetailMahasiswa() {
  const { nim } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FUNGSI 1: MENGAMBIL DATA (GET)
  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token_hafalan");
    try {
      const res = await fetch(`https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${nim}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      setData(result.data);
    } catch (err) {
      alert("Gagal mengambil data detail mahasiswa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [nim]);

  // FUNGSI 2: MENAMBAH SETORAN (POST)
  const validasiHafalan = async (surah) => {
    const token = localStorage.getItem("token_hafalan");
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    
    try {
      const res = await fetch(`https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${nim}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_setoran: [
            { nama_komponen_setoran: surah.nama, id_komponen_setoran: surah.id }
          ],
          tgl_setoran: today
        })
      });
      if (res.ok) {
        fetchData(); // Refresh data setelah berhasil
      } else {
        alert("Gagal memvalidasi hafalan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  // FUNGSI 3: MENGHAPUS SETORAN (DELETE)
  const batalValidasi = async (surah) => {
    const konfirmasi = confirm(`Yakin ingin membatalkan validasi Surah ${surah.nama}?`);
    if (!konfirmasi) return;

    const token = localStorage.getItem("token_hafalan");
    try {
      const res = await fetch(`https://api.tif.uin-suska.ac.id/setoran-dev/v1/mahasiswa/setoran/${nim}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data_setoran: [
            { 
              id: surah.info_setoran.id, 
              id_komponen_setoran: surah.id, 
              nama_komponen_setoran: surah.nama 
            }
          ]
        })
      });
      if (res.ok) {
        fetchData(); // Refresh data setelah berhasil dihapus
      } else {
        alert("Gagal membatalkan hafalan.");
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Memuat Detail Mahasiswa...</div>;
  if (!data) return <div style={{ padding: '2rem', color: 'white' }}>Data tidak ditemukan.</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: 'white', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* HEADER DETAIL */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
        <button onClick={() => router.back()} style={{ backgroundColor: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6', padding: '0.5rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
          ← Kembali ke Dashboard
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{data.info.nama}</h1>
        <p style={{ color: '#888' }}>NIM: {data.info.nim} | Semester {data.info.semester}</p>
        <p style={{ color: '#3b82f6', fontWeight: 'bold', marginTop: '0.5rem' }}>
          Progres: {data.setoran.info_dasar.persentase_progres_setor}% ({data.setoran.info_dasar.total_sudah_setor} dari {data.setoran.info_dasar.total_wajib_setor} Surah)
        </p>
      </div>

      {/* DAFTAR SURAH */}
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Daftar Surah Wajib</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.setoran.detail.map((surah, index) => (
          <div key={index} style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            padding: '1rem', backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '0.5rem' 
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{surah.nama} <span style={{ color: '#888', fontSize: '0.9rem' }}>({surah.nama_arab})</span></h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#555', marginTop: '0.2rem' }}>Kategori: {surah.label}</p>
            </div>
            
            <div>
              {surah.sudah_setor ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#22c55e', fontSize: '0.9rem', fontWeight: 'bold' }}>✓ Lulus ({surah.info_setoran.tgl_setoran})</span>
                  <button 
                    onClick={() => batalValidasi(surah)}
                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => validasiHafalan(surah)}
                  style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  + Validasi Setoran
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}