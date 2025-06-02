import { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient.js';
import Auth from './components/Auth.jsx';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      {!session ? (
        <Auth />
      ) : (
        <div>
          <h2>Welcome to MoneyMap</h2>
          <p>You're logged in!</p>
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
