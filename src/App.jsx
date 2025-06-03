import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
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
      <div className="container">
        <div className="welcome-box">
          <h2>Welcome, {user.email}</h2>
          <button className="btn btn-logout" onClick={handleLogout} disabled={loading}>
            Logout
          </button>
        </div>
      </div>
    );

  return (
    <div className="container">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2 className="form-title">Login to MoneyMap</h2>

        <input
          type="email"
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <input
          type="password"
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Log In
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSignup}
            disabled={loading}
          >
            Sign Up
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
