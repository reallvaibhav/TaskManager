import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../App';

const btn = (bg) => ({
  background: bg, color: '#fff', border: 'none', padding: '9px 18px',
  borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
});
const input = {
  padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: 8,
  fontSize: 14, width: '100%', boxSizing: 'border-box', marginBottom: 10,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProjects = () => API.get('/projects').then(r => setProjects(r.data));

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async () => {
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await API.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating project');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>Projects</h1>
        <button style={btn('#3b82f6')} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: 16, color: '#1e293b' }}>Create Project</h3>
          <input style={input} placeholder="Project name *" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <input style={input} placeholder="Description (optional)" value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />
          <button style={btn('#10b981')} onClick={createProject} disabled={loading}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {projects.map(p => {
          const isAdmin = p.admin?._id === user?.id || p.admin?.id === user?.id;
          return (
            <Link to={`/projects/${p._id}`} key={p._id} style={{ textDecoration: 'none' }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'transform 0.15s', border: '1px solid #e2e8f0' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h3 style={{ fontWeight: 700, color: '#1e293b', fontSize: 16 }}>{p.name}</h3>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    background: isAdmin ? '#dbeafe' : '#f0fdf4', color: isAdmin ? '#1e40af' : '#166534' }}>
                    {isAdmin ? 'Admin' : 'Member'}
                  </span>
                </div>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12, minHeight: 20 }}>{p.description || 'No description'}</p>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  👥 {p.members?.length || 0} member{p.members?.length !== 1 ? 's' : ''}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
          <p>No projects yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}
