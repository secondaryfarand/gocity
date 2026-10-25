import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { UserButton, useUser, useAuth } from '@clerk/clerk-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State untuk hamburger menu di mobile
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    async function checkUserRole() {
      if (!user) return;
      try {
        const token = await getToken();
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.success && (result.role === 'staf' || result.role === 'admin')) {
          setIsStaff(true);
        } else {
          setIsStaff(false);
        }
      } catch (err) {
        console.error('Gagal memuat role dari DB:', err);
      } finally {
        setLoading(false);
      }
    }

    checkUserRole();
  }, [user, getToken]);

  // Event listener untuk menutup menu ketika klik di luar navbar
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <div className={styles.loadingNav}>Memuat navigasi...</div>;

  return (
    <nav className={styles.navContainer} ref={navRef}>
      {/* Kiri: Hamburger Icon & Logo GoCity */}
      <div className={styles.navLeft}>
        <button 
          className={styles.hamburgerBtn} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <Link to="/" className={styles.brandContainer} onClick={() => setMenuOpen(false)}>
          <img 
            src="/favicon.ico" 
            alt="GoCity Logo" 
            className={styles.brandLogo} 
            onError={(e) => { e.target.style.display = 'none'; }} 
          />
          <span className={styles.brandText}>GoCity</span>
        </Link>
      </div>

      {/* Menu Navigasi (Tengah di Desktop, Sidebar Kiri di Mobile) */}
      <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
        {!isStaff ? (
          <>
            <NavLink 
              to="/" 
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-home"></i> Beranda
            </NavLink>
            <NavLink 
              to="/create-complaint" 
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-circle-plus"></i> Buat Aduan
            </NavLink>
            <NavLink 
              to="/track" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-ticket"></i> Lacak Tiket
            </NavLink>
            <NavLink 
              to="/request-document" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-file-lines"></i> Ajukan Surat
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/staff-dashboard" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-chart-pie"></i> Dashboard Staf
            </NavLink>
            <NavLink 
              to="/complaint" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-folder-open"></i> Manajemen Aduan
            </NavLink>
            <NavLink 
              to="/staff-documents" 
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => isActive ? `${styles.link} ${styles.linkActive}` : styles.link}
            >
              <i className="fa-solid fa-box-archive"></i> Arsip Surat
            </NavLink>
          </>
        )}
      </div>

      {/* Kanan: Badge Keterangan Role + User Profile */}
      <div className={styles.navRight}>
        <span className={`${styles.roleBadge} ${isStaff ? styles.roleBadgeStaff : ''}`}>
          <i className={`fa-solid ${isStaff ? 'fa-shield-halved' : 'fa-user'}`}></i>
          {isStaff ? 'Portal Staf' : 'Warga'}
        </span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}