import { useState, useEffect, useMemo } from 'react';
import { db, storage, auth } from '../../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion, AnimatePresence } from 'framer-motion';

const TaskManager = () => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('development');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');
  const [tags, setTags] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [view, setView] = useState('tasks'); // 'tasks' or 'dashboard'
  const [projects, setProjects] = useState([]);

  const categories = [
    'development', 'design', 'testing', 'deployment', 'maintenance',
    'meetings', 'documentation', 'research', 'bug-fixing', 'other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'urgent', label: 'Urgent', color: '#dc2626' }
  ];

  useEffect(() => {
    if (!auth.currentUser) return;

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskList);

      // Extract unique projects
      const uniqueProjects = [...new Set(taskList.map(t => t.project).filter(p => p))];
      setProjects(uniqueProjects);
    });

    return () => unsubscribe();
  }, []);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.tags?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.project?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesDate = !filterDate || task.taskDate === filterDate;

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [tasks, searchTerm, filterCategory, filterStatus, filterDate]);

  // Calculate statistics for dashboard
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(t => t.taskDate === today);
    const completedToday = todayTasks.filter(t => t.status === 'completed').length;
    const totalTimeToday = todayTasks.reduce((acc, t) => {
      if (t.startTime && t.endTime) {
        const start = new Date(`${t.taskDate}T${t.startTime}`);
        const end = new Date(`${t.taskDate}T${t.endTime}`);
        return acc + (end - start) / (1000 * 60 * 60); // hours
      }
      return acc;
    }, 0);

    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      todayTasks: todayTasks.length,
      completedToday,
      totalTimeToday: Math.round(totalTimeToday * 10) / 10
    };
  }, [tasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setLoading(true);

    try {
      let fileUrl = '';
      if (file) {
        const fileRef = storageRef(storage, `files/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      const newTask = {
        content: task.trim(),
        description: description.trim(),
        category,
        priority,
        project: project.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        startTime,
        endTime,
        taskDate,
        fileUrl,
        status: 'pending',
        createdAt: Date.now(),
        completedAt: null,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email
      };

      await addDoc(collection(db, 'tasks'), newTask);

      // Reset form
      setTask('');
      setDescription('');
      setCategory('development');
      setPriority('medium');
      setProject('');
      setTags('');
      setStartTime('');
      setEndTime('');
      setTaskDate(new Date().toISOString().split('T')[0]);
      setFile(null);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Error adding task: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? Date.now() : null
    });
  };

  const deleteTask = async (taskId) => {
      if(!window.confirm("Are you sure you want to delete this task?")) return;
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
  }

  return (
    <div className="task-manager">
      {/* Navigation */}
      <div className="view-toggle" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button
          onClick={() => setView('dashboard')}
          className={`btn ${view === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setView('tasks')}
          className={`btn ${view === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📝 Tasks
        </button>
      </div>

      {view === 'dashboard' ? (
        /* Dashboard View */
        <motion.div
          className="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stats-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div className="stat-card card">
              <h3>Total Tasks</h3>
              <p className="stat-number">{stats.totalTasks}</p>
            </div>
            <div className="stat-card card">
              <h3>Completed</h3>
              <p className="stat-number" style={{ color: 'var(--success-color)' }}>{stats.completedTasks}</p>
            </div>
            <div className="stat-card card">
              <h3>Pending</h3>
              <p className="stat-number" style={{ color: 'var(--secondary-color)' }}>{stats.pendingTasks}</p>
            </div>
            <div className="stat-card card">
              <h3>Today's Tasks</h3>
              <p className="stat-number">{stats.todayTasks}</p>
            </div>
            <div className="stat-card card">
              <h3>Completed Today</h3>
              <p className="stat-number" style={{ color: 'var(--success-color)' }}>{stats.completedToday}</p>
            </div>
            <div className="stat-card card">
              <h3>Hours Today</h3>
              <p className="stat-number">{stats.totalTimeToday}h</p>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="card">
            <h3>Recent Tasks</h3>
            <div className="recent-tasks">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="recent-task-item" style={{
                  padding: '0.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{task.content}</p>
                    <small style={{ color: 'var(--text-secondary)' }}>
                      👤 {task.userEmail} • {task.taskDate} • {task.category}
                    </small>
                  </div>
                  <span className={`status-badge ${task.status}`} style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius)',
                    fontSize: '0.75rem',
                    backgroundColor: task.status === 'completed' ? 'var(--success-color)' : 'var(--secondary-color)',
                    color: 'white'
                  }}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        /* Tasks View */
        <>
          {/* Add Task Form */}
          <motion.div
            className="card"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Add New Task</h2>
            <form onSubmit={handleAddTask} className="task-form">
              <div className="form-grid" style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Task Title *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="What did you work on?"
                      required
                    />
                  </div>
                  <div>
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={taskDate}
                      onChange={(e) => setTaskDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea
                    className="input-field"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the task..."
                    rows="3"
                  />
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Category</label>
                    <select
                      className="input-field"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Priority</label>
                    <select
                      className="input-field"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      {priorities.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Project</label>
                    <input
                      type="text"
                      className="input-field"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      placeholder="Project name"
                      list="projects"
                    />
                    <datalist id="projects">
                      {projects.map(p => <option key={p} value={p} />)}
                    </datalist>
                  </div>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="input-label">Start Time</label>
                    <input
                      type="time"
                      className="input-field"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">End Time</label>
                    <input
                      type="time"
                      className="input-field"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="react, api, bug-fix"
                  />
                </div>

                <div>
                  <label className="input-label">Attachment</label>
                  <input
                    id="fileInput"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ marginTop: '1rem' }}
              >
                {loading ? 'Adding...' : 'Add Task'}
              </motion.button>
            </form>
          </motion.div>

          {/* Filters and Search */}
          <div className="filters card" style={{ marginBottom: '2rem' }}>
            <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label className="input-label">Search</label>
                <input
                  type="text"
                  className="input-field"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                />
              </div>
              <div>
                <label className="input-label">Category</label>
                <select
                  className="input-field"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="input-label">Status</label>
                <select
                  className="input-field"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="input-label">Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <motion.div
            className="task-list"
            layout
          >
            <AnimatePresence>
              {filteredTasks.length === 0 && (
                <motion.div
                  className="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p>{searchTerm || filterCategory !== 'all' || filterStatus !== 'all' || filterDate ?
                    'No tasks match your filters.' : 'No tasks found. Start by adding your first task above!'}</p>
                </motion.div>
              )}
              {filteredTasks.map((t) => (
                <motion.div
                  key={t.id}
                  className={`task-item ${t.status === 'completed' ? 'completed' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="task-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <p className="task-text">{t.content}</p>
                      <span style={{
                        backgroundColor: priorities.find(p => p.value === t.priority)?.color || '#64748b',
                        color: 'white',
                        padding: '0.125rem 0.5rem',
                        borderRadius: 'var(--radius)',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {t.priority}
                      </span>
                    </div>

                    {t.description && (
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        {t.description}
                      </p>
                    )}

                    <div className="task-meta">
                      <span>👤 {t.userEmail}</span>
                      <span>{new Date(t.createdAt).toLocaleString()}</span>
                      <span>{t.taskDate}</span>
                      <span>{t.category}</span>
                      {t.project && <span>Project: {t.project}</span>}
                      {t.startTime && t.endTime && (
                        <span>{t.startTime} - {t.endTime}</span>
                      )}
                      {t.tags && t.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {t.tags.map((tag, index) => (
                            <span key={index} style={{
                              backgroundColor: 'var(--background-color)',
                              color: 'var(--text-secondary)',
                              padding: '0.125rem 0.25rem',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.75rem'
                            }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {t.fileUrl && (
                        <a href={t.fileUrl} target="_blank" rel="noopener noreferrer" className="attachment-link">
                          📎 Attachment
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <motion.button
                      onClick={() => toggleStatus(t.id, t.status)}
                      className={`btn btn-sm ${t.status === 'pending' ? 'btn-secondary' : 'btn-primary'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {t.status === 'pending' ? 'Mark Done' : 'Completed'}
                    </motion.button>
                    <motion.button
                      onClick={() => deleteTask(t.id)}
                      className="btn btn-danger btn-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TaskManager;
