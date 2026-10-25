import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar({ isStaff, onToggle }) {
    const [collapsed, setCollapsed] = useState(false);
    const handleToggle = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        if (onToggle) {
        onToggle(newState); // Beritahu App.jsx bahwa ukuran sidebar berubah
        }
    };

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
        
        {/* Header: Logo & Toggle Button */}
        <div className={styles.sidebarHeader}>
            <Link to="/" className={styles.brandArea}>
            <img 
                src="/favicon.ico" 
                alt="GoCity Logo" 
                className={styles.brandLogo} 
                onError={(e) => { e.target.style.display = 'none'; }}
            />
            {!collapsed && <span className={styles.brandTitle}>GoCity</span>}
            </Link>
            <button 
                onClick={handleToggle}
                className={styles.toggleBtn}
                title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
            >
            <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`}></i>
            </button>
        </div>

        {/* Body: Menu Navigasi Kompleks */}
        <div className={styles.sidebarBody}>
            
            {/* Grup Menu Utama / Warga */}
            <div>
            {!collapsed && <div className={styles.menuGroupTitle}>Layanan Publik</div>}
            <div className={styles.menuList}>
                <NavLink 
                    to="/" 
                    end 
                    className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    title="Beranda"
                    >
                    <i className="fa-solid fa-home"></i>
                    <span>Beranda</span>
                </NavLink>
                <NavLink 
                to="/create-complaint" 
                end 
                className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                title="Buat Aduan"
                >
                <i className="fa-solid fa-circle-plus"></i>
                <span>Buat Aduan</span>
                </NavLink>
                <NavLink 
                to="/track" 
                className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                title="Lacak Tiket"
                >
                <i className="fa-solid fa-ticket"></i>
                <span>Lacak Tiket</span>
                </NavLink>
                <NavLink 
                to="/request-document" 
                className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                title="Ajukan Surat"
                >
                <i className="fa-solid fa-file-lines"></i>
                <span>Ajukan Surat</span>
                </NavLink>
            </div>
            </div>

            {/* Grup Menu Staf / Admin (Hanya tampil jika staf) */}
            {isStaff && (
            <div>
                {!collapsed && <div className={styles.menuGroupTitle}>Command Center</div>}
                <div className={styles.menuList}>
                <NavLink 
                    to="/staff-dashboard" 
                    className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    title="Dashboard Staf"
                >
                    <i className="fa-solid fa-chart-pie"></i>
                    <span>Dashboard Staf</span>
                </NavLink>
                <NavLink 
                    to="/complaint" 
                    className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    title="Manajemen Aduan"
                >
                    <i className="fa-solid fa-folder-open"></i>
                    <span>Manajemen Aduan</span>
                </NavLink>
                <NavLink 
                    to="/staff-documents" 
                    className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.menuItemActive : ''}`}
                    title="Arsip Surat"
                >
                    <i className="fa-solid fa-box-archive"></i>
                    <span>Arsip Surat</span>
                </NavLink>
                </div>
            </div>
            )}

            {/* Grup Menu Utilitas / Sistem */}
            <div>
            {!collapsed && <div className={styles.menuGroupTitle}>Sistem & Lainnya</div>}
            <div className={styles.menuList}>
                <a href="#map" className={styles.menuItem} title="Peta Kota">
                <i className="fa-solid fa-map-location-dot"></i>
                <span>Peta Sebaran</span>
                </a>
                <a href="#cctv" className={styles.menuItem} title="CCTV Live">
                <i className="fa-solid fa-video"></i>
                <span>CCTV Publik</span>
                </a>
            </div>
            </div>

        </div>

        {/* Footer Sidebar: Status Server / Informasi Singkat */}
        <div className={styles.sidebarFooter}>
            <div className={styles.systemStatusCard}>
            <div className={styles.statusIndicator}></div>
            {!collapsed && (
                <div>
                <div className={styles.statusText}>Server Connected</div>
                <div className={styles.statusSub}>API v2.4 Active</div>
                </div>
            )}
            </div>
        </div>

        </aside>
    );
}