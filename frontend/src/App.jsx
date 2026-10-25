import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-react';

import Navbar from './components/Navbar/Navbar'; 
import Sidebar from './components/Sidebar/Sidebar'; 
import ComplaintForm from './features/complaint/components/ComplaintForm';
import ComplaintList from './features/complaint/components/ComplaintList';
import StaffDashboard from './features/dashboard/StaffDashboard';
import ComplaintManagement from './features/complaint/pages/forstaf/ComplaintManagement';
import DocumentForm from './features/document/components/DocumentForm';
import DocumentManagement from './features/document/pages/forstaf/DocumentManagement';
import { LoginPage } from './features/auth/pages/LoginPages';
import Home from './features/home/Home';

export default function App() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  
  const [dbRole, setDbRole] = useState(null);
  const [checkingDb, setCheckingDb] = useState(true);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    async function getRoleFromDatabase() {
      if (!user) {
        setCheckingDb(false);
        return;
      }
      try {
        const token = await getToken();
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (result.success) {
          setDbRole(result.role); 
        }
      } catch (err) {
        console.error("Gagal ambil role dari DB:", err);
      } finally {
        setCheckingDb(false);
      }
    }

    if (isLoaded) {
      getRoleFromDatabase();
    }
  }, [user, isLoaded, getToken]);

  if (!isLoaded || checkingDb) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Memuat data dari database...</div>;
  }

  const isStaff = dbRole === 'staf' || dbRole === 'admin';

  return (
    <Router>
      <div>
        <SignedOut>
          <LoginPage />
        </SignedOut>

        <SignedIn>
          <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
            
            <Sidebar 
              isStaff={isStaff} 
              onToggle={(collapsed) => setIsSidebarCollapsed(collapsed)} 
            />

            <div style={{ 
              flex: 1, 
              marginLeft: isSidebarCollapsed ? '80px' : '260px', 
              display: 'flex', 
              flexDirection: 'column', 
              transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}>              
              <Navbar />
              <main style={{ padding: '30px', flex: 1 }}>
                <Routes>
                  <Route 
                    path="/" 
                    element={isStaff ? <Navigate to="/staff-dashboard" replace /> : <Home />} 
                  />
                  {!isStaff && (
                    <>
                      <Route path="/" element={<Home />} />
                      <Route path="/create-complaint" element={<ComplaintForm />} />
                      <Route path="/track" element={<ComplaintList />} />
                      <Route path="/request-document" element={<DocumentForm />} />
                    </>
                  )}

                  {/* Rute Khusus Staf / Admin */}
                  {isStaff && (
                    <>
                      <Route path="/staff-dashboard" element={<StaffDashboard />} />
                      <Route path="/complaint" element={<ComplaintManagement />} />
                      <Route path="/staff-documents" element={<DocumentManagement />} />
                    </>
                  )}
                  <Route 
                    path="*" 
                    element={<Navigate to={isStaff ? "/staff-dashboard" : "/"} replace />} 
                  />
                </Routes>
              </main>

            </div>
          </div>
        </SignedIn>
      </div>
    </Router>
  );
}