import { useEffect, useState } from 'react';
import { supabase } from '../../SupabaseClient';

function Dashboard({ session }) {
  const [entries, setEntries] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [duedate, setDueDate] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', session.user.id);

    if (!error && data) {
      setEntries(data);
      const total = data.reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
      setBalance(total);
    }
  };

  const addEntry = async () => {
    if (!desc || isNaN(amount)) return;
    const { error } = await supabase.from('entries').insert([
      {
        user_id: session.user.id,
        desc,
        amount: parseFloat(amount),
        duedate: duedate || new Date().toISOString().split('T')[0],
      },
    ]);
    if (!error) {
      setDesc('');
      setAmount('');
      setDueDate('');
      fetchEntries();
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      <nav>
        <button onClick={logout}>Log Out</button>
      </nav>
      <h3>Finance Dashboard</h3>
      <p>
        Balance: <span className={balance < 0 ? 'negative' : 'positive'}>${balance.toFixed(2)}</span>
      </p>
      <input placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
      <input placeholder="Amount" value={amount} type="number" onChange={e => setAmount(e.target.value)} />
      <input type="date" value={duedate} onChange={e => setDueDate(e.target.value)} />
      <button onClick={addEntry}>Add Entry</button>

      <div id="entries">
        {entries.map(entry => (
          <div key={entry.id} className={`entry ${entry.amount < 0 ? 'negative' : 'positive'}`}>
            {entry.duedate} - {entry.desc}: ${parseFloat(entry.amount).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
