import { useClerk } from '@clerk/react';
import { useSyncUser } from '../hooks/useSyncUser';

export function DashboardView() {
  const { signOut } = useClerk();
  const { dbUser, loading, error } = useSyncUser(); 

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h2>Selamat Datang di Portal Kota (Dashboard)</h2>
      
      {loading && <p style={{ color: 'blue' }}>⏳ Menyinkronkan profil Anda dengan database lokal...</p>}
      {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}

      {dbUser && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '20px', textAlign: 'left' }}>
          <h4>🔒 Data Akun Terverifikasi Database Lokal:</h4>
          <img src={dbUser.picture} alt="Profil" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} />
          <p><strong>Nama:</strong> {dbUser.name}</p>
          <p><strong>Email:</strong> {dbUser.email}</p>
          
          <p><strong>Role Akses:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{dbUser.role}</span></p>
          <p><strong>Wilayah Kelolaan:</strong> {dbUser.wilayah}</p>
          <p><strong>Instansi Dinas:</strong> {dbUser.instansi}</p>
        </div>
      )}

      <button 
        onClick={() => signOut()} 
        style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Keluar Aplikasi (Sign Out)
      </button>
    </div>
  );
}