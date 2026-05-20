import { useEffect, useState } from 'react';
import API from '../api';

const card = (bg, color) => ({
  background: bg, color, borderRadius: 12, padding: '24px 28px',
  flex: 1, minWidth: 140,
});
const num = { fontSize: 40, fontWeight: 800, margin: '8px 0 4px' };
const lbl = { fontSize: 13, opacity: 0.85, fontWeight: 500 };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get('/tasks/stats').then(r => setStats(r.data)).catch(() => {});
    API.get('/tasks').then(r => setTasks(r.data)).catch(() => {});
  }, []);

  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done');

  return (
    <div style={{ paddingBottom: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>Dashboard</h1>

      {/* Stat Cards */}
      {stats && (
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
          <div style={card('#3b82f6', '#fff')}>
            <div style={lbl}>Total Tasks</div>
            <div style={num}>{stats.total}</div>
          </div>
          <div style={card('#f59e0b', '#fff')}>
            <div style={lbl}>To Do</div>
            <div style={num}>{stats.todo}</div>
          </div>
          <div style={card('#8b5cf6', '#fff')}>
            <div style={lbl}>In Progress</div>
            <div style={num}>{stats.inProgress}</div>
          </div>
          <div style={card('#10b981', '#fff')}>
            <div style={lbl}>Done</div>
            <div style={num}>{stats.done}</div>
          </div>
          <div style={card('#ef4444', '#fff')}>
            <div style={lbl}>Overdue</div>
            <div style={num}>{stats.overdue}</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Tasks per user */}
        {stats && Object.keys(stats.perUser || {}).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flex: 1, minWidth: 260 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Tasks per User</h2>
            {Object.entries(stats.perUser).map(([name, count]) => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#475569' }}>{name}</span>
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>{count}</span>
              </div>
            ))}
          </div>
        )}

        {/* Overdue tasks list */}
        {overdueTasks.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flex: 1, minWidth: 260 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#ef4444' }}>⚠ Overdue Tasks</h2>
            {overdueTasks.map(t => (
              <div key={t._id} style={{ padding: '8px 0', borderBottom: '1px solid #fef2f2' }}>
                <div style={{ fontWeight: 600, color: '#1e293b' }}>{t.title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  {t.project?.name} · Due {new Date(t.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent tasks */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flex: 2, minWidth: 300 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>Recent Tasks</h2>
          {tasks.slice(0, 8).map(t => (
            <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.project?.name}</div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                background: t.status === 'Done' ? '#dcfce7' : t.status === 'In Progress' ? '#ede9fe' : '#fef9c3',
                color: t.status === 'Done' ? '#166534' : t.status === 'In Progress' ? '#5b21b6' : '#854d0e',
              }}>
                {t.status}
              </span>
            </div>
          ))}
          {tasks.length === 0 && <p style={{ color: '#94a3b8', fontSize: 14 }}>No tasks yet. Create a project to get started!</p>}
        </div>
      </div>
    </div>
  );
}
