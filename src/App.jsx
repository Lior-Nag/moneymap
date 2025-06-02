import { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Check active session on load
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSignup() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Signup successful! Check your email to confirm.');
    setLoading(false);
  }

  async function handleLogin() {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Login successful!');
    setLoading(false);
  }

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  if (user)
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome, {user.email}</h2>
        <button onClick={handleLogout} disabled={loading}>
          Logout
        </button>
      </div>
    );

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Signup</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: 10 }}
      />
      <button onClick={handleLogin} disabled={loading} style={{ marginRight: 10 }}>
        Log In
      </button>
      <button onClick={handleSignup} disabled={loading}>
        Sign Up
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
