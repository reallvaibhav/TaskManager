import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const s = {
  nav: { background: '#1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  brand: { color: '#60a5fa', fontWeight: 700, fontSize: 20, textDecoration: 'none' },
  links: { display: 'flex', gap: 20, alignItems: 'center' },
  link: { color: '#cbd5e1', textDecoration: 'none', fontSize: 14 },
  user: { color: '#94a3b8', fontSize: 13 },
  btn: { background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13 },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>🗂 TaskManager</Link>
      <div style={s.links}>
        <Link to="/" style={s.link}>Dashboard</Link>
        <Link to="/projects" style={s.link}>Projects</Link>
        <span style={s.user}>Hi, {user?.name}</span>
        <button style={s.btn} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
