import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/react';

export function useSyncUser() {
  const { getToken } = useAuth(); 
  const { user: clerkUser } = useUser();
  const clerkId = clerkUser?.id;
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function syncUser() {
      if (!clerkId) return;

      setLoading(true);
      try {
        const token = await getToken();

        const response = await fetch('/api/auth/sync', {
        // const response = await fetch('http://localhost:5000/api/auth/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const data = await response.json();

        if (data.success) {
          setDbUser(data.user);
        } else {
          setError(data.error || 'Gagal sinkronisasi data.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    syncUser();
  }, [clerkId, getToken]);

  return { dbUser, loading, error };
}
