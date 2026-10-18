import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Show, UserButton, useUser } from '@clerk/react';
import { LoginPage } from './features/auth/pages/LoginPages';
import ComplaintForm from './features/complaint/components/ComplaintForm';
import ComplaintList from './features/complaint/components/ComplaintList';
import StaffDashboard from './features/complaint/components/StaffDashboard'; // Komponen dashboard staf & peta
import './App.css';

export default function App() {
  return (
    <Router>
      <div>
        {/* 🔓 KONDISI A: Jika user BELUM login */}
        <Show when="signed-out">
          <LoginPage />
        </Show>

        {/* 🔒 KONDISI B: Jika user SUDAH login */}
        <Show when="signed-in">
          {/* Navbar Navigasi Utama */}
          <nav style={navStyles.nav}>
            <h3 style={{ margin: 0, color: '#007bff' }}>GoCity - Layanan Publik</h3>
            <div style={navStyles.links}>
              <Link to="/" style={navStyles.link}>Buat Aduan</Link>
              <Link to="/track" style={navStyles.link}>Lacak Tiket</Link>
              <Link to="/staff-dashboard" style={navStyles.linkStaff}>Dashboard Staf</Link>
            </div>
            <UserButton afterSignOutUrl="/" />
          </nav>

          {/* Pengaturan Halaman (Routes) */}
          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<ComplaintForm />} />
              <Route path="/track" element={<ComplaintList />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
            </Routes>
          </div>
        </Show>
      </div>
    </Router>
  );
}

const navStyles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#fff', borderBottom: '1px solid #ddd', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '14px' },
  linkStaff: { textDecoration: 'none', color: '#fff', background: '#28a745', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }
};


// import { useEffect, useState } from 'react'

// import { Show } from '@clerk/react'; // Komponen kontrol kondisi login Clerk
// import { LoginPage } from './features/auth/pages/LoginPages';
// import { DashboardView } from './features/auth/components/DashboadView';
// import './App.css';

// function App() {
//   return (
//     <>
//       {/* 🔓 KONDISI A: Jika user BELUM login, paksa tampilkan halaman Login */}
//       <Show when="signed-out">
//         <LoginPage />
//       </Show>

//       {/* 🔒 KONDISI B: Jika user SUDAH login, buka gerbang Dashboard & Sinkronisasi DB */}
//       <Show when="signed-in">
//         <DashboardView />
//       </Show>
//     </>
//   );
// }

// export default App;



