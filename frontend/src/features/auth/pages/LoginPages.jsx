import { SignInButton } from '@clerk/react'; // Tombol instan bawaan Clerk

export function LoginPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'inline-block', padding: '40px', border: '1px solid #ccc', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2>Sistem Informasi Layanan Kota</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Silakan masuk menggunakan akun Google resmi Anda</p>
        
        {/* Menggunakan komponen tombol pop-up Google bawaan Clerk */}
        <SignInButton mode="modal">
          <button style={{ backgroundColor: '#4285F4', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://w3.org">
              <path d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-2.67 2.69-6.61 2.69-10.62z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.55-1.84.87-3.05.87-2.34 0-4.33-1.58-5.03-3.71H.95v2.33A9 9 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.97 10.72a5.41 5.41 0 0 1 0-3.44V4.95H.95a9 9 0 0 0 0 8.1l3.02-2.33z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.1A9 9 0 0 0 .95 4.95l3.02 2.33c.7-2.13 2.69-3.7 5.03-3.7z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
