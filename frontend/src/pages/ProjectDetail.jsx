import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../App';

const btn = (bg, sm) => ({
  background: bg, color: '#fff', border: 'none',
  padding: sm ? '5px 12px' : '9px 16px',
  borderRadius: 8, cursor: 'pointer', fontSize: sm ? 12 : 13, fontWeight: 600,
});
const inp = {
  padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 8,
  fontSize: 13, boxSizing: 'border-box', width: '100%', marginBottom: 8,
};
const badge = (status) => {
  const map = { 'To Do': ['#fef9c3','#854d0e'], 'In Progress': ['#ede9fe','#5b21b6'], Done: ['#dcfce7','#166534'] };
  return { background: map[status][0], color: map[status][1], fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer' };
};
const pBadge = (p) => {
  const map = { Low: '#10b981', Medium: '#f59e0b', High: '#ef4444' };
  return { color: map[p], fontWeight: 700, fontSize: 12 };
};

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [filter, setFilter] = useState('All');

  const isAdmin = project?.admin?._id === user?.id || project?.admin?.id === user?.id;

  const fetchAll = async () => {
    const [pRes, tRes, uRes] = await Promise.all([
      API.get('/projects'),
      API.get(`/tasks?projectId=${id}`),
      API.get('/projects/users/all'),
    ]);
    setProject(pRes.data.find(p => p._id === id));
    setTasks(tRes.data);
    setAllUsers(uRes.data);
  };

  useEffect(() => { fetchAll(); }, [id]);

  const createTask = async () => {
    if (!taskForm.title.trim()) return alert('Title is required');
    try {
      await API.post('/tasks', { ...taskForm, project: id });
      setTaskForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      setShowTaskForm(false);
      fetchAll();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const updateStatus = async (taskId, newStatus) => {
    await API.put(`/tasks/${taskId}`, { status: newStatus });
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    await API.delete(`/tasks/${taskId}`);
    setTasks(prev => prev.filter(t => t._id !== taskId));
  };

  const addMember = async () => {
    if (!memberEmail.trim()) return;
    try {
      const { data } = await API.post(`/projects/${id}/members`, { email: memberEmail });
      setProject(data);
      setMemberEmail('');
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const removeMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await API.delete(`/projects/${id}/members/${memberId}`);
      setProject(prev => ({
        ...prev,
        members: prev.members.filter(m => m._id !== memberId)
      }));
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

  if (!project) return <div style={{ padding: 40, color: '#94a3b8' }}>Loading...</div>;

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b' }}>{project.name}</h1>
          <span style={{ fontSize: 12, background: isAdmin ? '#dbeafe' : '#f0fdf4', color: isAdmin ? '#1e40af' : '#166534', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
            {isAdmin ? 'Admin' : 'Member'}
          </span>
        </div>
        {project.description && <p style={{ color: '#64748b', fontSize: 14 }}>{project.description}</p>}
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Tasks Column */}
        <div style={{ flex: 3, minWidth: 300 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Tasks ({tasks.length})</h2>
            {isAdmin && (
              <button style={btn('#3b82f6')} onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? 'Cancel' : '+ Add Task'}
              </button>
            )}
          </div>

          {/* Task Filter */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['All', 'To Do', 'In Progress', 'Done'].map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  background: filter === s ? '#3b82f6' : '#fff', color: filter === s ? '#fff' : '#475569' }}>
                {s}
              </button>
            ))}
          </div>

          {/* Task Form */}
          {showTaskForm && isAdmin && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <h3 style={{ marginBottom: 12, fontSize: 15, color: '#1e293b' }}>New Task</h3>
              <input style={inp} placeholder="Title *" value={taskForm.title}
                onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
              <input style={inp} placeholder="Description" value={taskForm.description}
                onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Due Date</label>
                  <input type="date" style={inp} value={taskForm.dueDate}
                    onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Priority</label>
                  <select style={inp} value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Assign To</label>
                  <select style={inp} value={taskForm.assignedTo}
                    onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })}>
                    <option value="">Unassigned</option>
                    {project.members?.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button style={btn('#10b981')} onClick={createTask}>Create Task</button>
            </div>
          )}

          {/* Task Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredTasks.map(t => {
              const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done';
              const canUpdate = isAdmin || t.assignedTo?._id === user?.id;
              return (
                <div key={t._id} style={{ background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: isOverdue ? '1px solid #fecaca' : '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 15 }}>{t.title}</div>
                      {t.description && <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{t.description}</div>}
                    </div>
                    {isAdmin && (
                      <button onClick={() => deleteTask(t._id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>✕</button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
                    <span style={pBadge(t.priority)}>● {t.priority}</span>
                    {t.assignedTo && <span style={{ fontSize: 12, color: '#475569' }}>👤 {t.assignedTo.name}</span>}
                    {t.dueDate && <span style={{ fontSize: 12, color: isOverdue ? '#ef4444' : '#94a3b8' }}>
                      📅 {new Date(t.dueDate).toLocaleDateString()}{isOverdue ? ' ⚠ Overdue' : ''}
                    </span>}
                    {canUpdate ? (
                      <select value={t.status} onChange={e => updateStatus(t._id, e.target.value)}
                        style={{ ...badge(t.status), marginLeft: 'auto', outline: 'none', appearance: 'none', paddingRight: 8 }}>
                        <option>To Do</option><option>In Progress</option><option>Done</option>
                      </select>
                    ) : (
                      <span style={{ ...badge(t.status), marginLeft: 'auto' }}>{t.status}</span>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: 14 }}>
                No tasks{filter !== 'All' ? ` with status "${filter}"` : ''}.
              </div>
            )}
          </div>
        </div>

        {/* Members Column */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 16 }}>Members</h2>
          <div style={{ background: '#fff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
            {project.members?.map(m => {
              const mIsAdmin = m._id === project.admin?._id;
              return (
                <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{m.email}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: mIsAdmin ? '#dbeafe' : '#f1f5f9', color: mIsAdmin ? '#1e40af' : '#64748b' }}>
                      {mIsAdmin ? 'Admin' : 'Member'}
                    </span>
                    {isAdmin && !mIsAdmin && (
                      <button onClick={() => removeMember(m._id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, padding: '0 4px' }}>✕</button>
                    )}
                  </div>
                </div>
              );
            })}

            {isAdmin && (
              <div style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>Add Member</h4>
                <input style={{ ...inp, marginBottom: 8 }} placeholder="Email address"
                  value={memberEmail} onChange={e => setMemberEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addMember()} />
                <button style={btn('#3b82f6', true)} onClick={addMember}>Add</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
