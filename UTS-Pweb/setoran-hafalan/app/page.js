import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', backgroundColor: '#0a0a0a', fontFamily: 'sans-serif', color: 'white', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.5rem', letterSpacing: '-0.05em', textTransform: 'uppercase', fontStyle: 'italic', margin: '0 0 1rem 0' }}>
        Setoran Hafalan
      </h1>
      <p style={{ color: '#888', marginBottom: '3rem', fontWeight: 'bold', letterSpacing: '0.1em', fontSize: '0.75rem', textTransform: 'uppercase' }}>
        Teknik Informatika - UIN Suska Riau
      </p>
      
      <Link 
        href="/login" 
        style={{ 
          backgroundColor: '#2563eb', color: 'white', padding: '1rem 2.5rem', 
          borderRadius: '9999px', fontWeight: 'bold', textDecoration: 'none', 
          boxShadow: '0 0 20px rgba(37,99,235,0.4)', transition: '0.3s'
        }}
      >
        MASUK SEBAGAI DOSEN
      </Link>
    </div>
  );
}