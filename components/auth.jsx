import { useState } from 'react';
import { supabase } from '../../SupabaseClient';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (type) => {
    const { error } =
      type === 'LOGIN'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) setMessage(error.message);
    else setMessage(`${type === 'LOGIN' ? 'Logged in' : 'Signed up'} successfully.`);
  };

  return (
    <div className="auth-box">
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => handleLogin('LOGIN')}>Log In</button>
      <button onClick={() => handleLogin('SIGNUP')}>Sign Up</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Auth;
