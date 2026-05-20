import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../App';

const s = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card: { background: '#fff', padding: 40, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: 380 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 24, color: '#1e293b', textAlign: 'center' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: '#475569' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
  btn: { width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  err: { color: '#ef4444', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  link: { textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' },
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.card}>
        <div style={s.title}>Create Account</div>
        {error && <div style={s.err}>{error}</div>}
        <label style={s.label}>Full Name</label>
        <input style={s.input} placeholder="John Doe" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <label style={s.label}>Email</label>
        <input style={s.input} type="email" placeholder="you@example.com" value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <label style={s.label}>Password</label>
        <input style={s.input} type="password" placeholder="Min 6 characters" value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
        <div style={s.link}>
          Already have an account? <Link to="/login" style={{ color: '#3b82f6' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
