import { useState } from 'react';
import { supabase } from '../SupabaseClient.js';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(type) {
    const fn = type === 'signup' ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { error } = await fn({ email, password });
    if (error) alert(error.message);
    else alert('Check your email for confirmation if signing up.');
  }

  return (
    <div>
      <h2>Login or Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={() => handleLogin('login')}>Log In</button>
      <button onClick={() => handleLogin('signup')}>Sign Up</button>
    </div>
  );
}
