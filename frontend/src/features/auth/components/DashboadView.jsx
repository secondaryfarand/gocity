// import { useClerk } from '@clerk/clerk-react';
// import { useSyncUser } from '../hooks/useSyncUser';

// export function DashboardView() {
//   const { signOut } = useClerk();
//   const { dbUser, loading, error } = useSyncUser(); 

//   return (
//     <div style={{ padding: '30px', maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif', border: '1px solid #ddd', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
//       <h2>Selamat Datang di Portal Kota (Dashboard)</h2>
      
//       {loading && <p style={{ color: 'blue' }}>⏳ Menyinkronkan profil Anda dengan database lokal...</p>}
//       {error && <p style={{ color: 'red' }}>⚠️ Error: {error}</p>}

//       {dbUser && (
//         <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginTop: '20px', textAlign: 'left' }}>
//           <h4>🔒 Data Akun Terverifikasi Database Lokal:</h4>
//           <img src={dbUser.picture} alt="Profil" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }} />
//           <p><strong>Nama:</strong> {dbUser.name}</p>
//           <p><strong>Email:</strong> {dbUser.email}</p>
          
//           <p><strong>Role Akses:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{dbUser.role}</span></p>
//           <p><strong>Wilayah Kelolaan:</strong> {dbUser.wilayah}</p>
//           <p><strong>Instansi Dinas:</strong> {dbUser.instansi}</p>
//         </div>
//       )}

//       <button 
//         onClick={() => signOut()} 
//         style={{ marginTop: '20px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
//       >
//         Keluar Aplikasi (Sign Out)
//       </button>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import ComplaintForm from '../../complaint/components/ComplaintForm'; // Sesuaikan path foldernya
import ComplaintList from '../../complaint/components/ComplaintList'; // Sesuaikan path foldernya

export function DashboardView() {
  const { user } = useUser(); // Mengambil data user yang sedang login dari Clerk
  const [activeTab, setActiveTab] = useState('form'); // 'form' atau 'track'

  return (
    <div style={styles.container}>
      {/* Header Dashboard & User Profile */}
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>GoCity - Layanan Publik</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#666' }}>
            Selamat datang, <strong>{user?.fullName || user?.primaryEmailAddress?.emailAddress}</strong>!
          </p>
        </div>
        <div style={styles.navRight}>
          <button 
            onClick={() => setActiveTab('form')} 
            style={{ ...styles.tabButton, background: activeTab === 'form' ? '#007bff' : '#f1f3f5', color: activeTab === 'form' ? '#fff' : '#333' }}
          >
            Buat Aduan
          </button>
          <button 
            onClick={() => setActiveTab('track')} 
            style={{ ...styles.tabButton, background: activeTab === 'track' ? '#007bff' : '#f1f3f5', color: activeTab === 'track' ? '#fff' : '#333' }}
          >
            Lacak Tiket
          </button>
          {/* Tombol Profile & Logout bawaan Clerk */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Konten Utama Berdasarkan Tab yang Dipilih */}
      <main style={styles.main}>
        {activeTab === 'form' ? <ComplaintForm /> : <ComplaintList />}
      </main>
    </div>
  );
}

// Inline Styles Sederhana untuk Dashboard
const styles = {
  container: { minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Arial, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#fff', borderBottom: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  tabButton: { padding: '8px 14px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: '0.2s' },
  main: { padding: '20px' }
};