import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { Toaster } from 'react-hot-toast'
import { Sun, Moon, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'

import Auth from './components/Auth'
import TaskManager from './components/TaskManager'
import Dashboard from './components/Dashboard'
import Calendar from './components/Calendar'
import Projects from './components/Projects'
import Sidebar from './components/Sidebar'
import { ThemeProvider, useTheme } from './context/ThemeContext'

import './App.css'
import './styles/modern.css'

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <motion.button 
      onClick={toggleTheme} 
      className="btn btn-secondary btn-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      {isDarkMode ? 'Light' : 'Dark'}
    </motion.button>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  // Fetch tasks when user is authenticated
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) return (
    <div className="loading-screen">
      <motion.div
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        ⚡
      </motion.div>
      <p>Loading TaskFlow Pro...</p>
    </div>
  );

  if (!user) {
    return (
      <div className="auth-container">
        <Auth />
        <Toaster position="top-right" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} user={user} />;
      case 'tasks':
        return <TaskManager />;
      case 'calendar':
        return <Calendar tasks={tasks} />;
      case 'projects':
        return <Projects tasks={tasks} />;
      case 'team':
        return <div className="coming-soon"><h2>Team Management</h2><p>Coming Soon...</p></div>;
      case 'timetrack':
        return <div className="coming-soon"><h2>Time Tracking</h2><p>Coming Soon...</p></div>;
      case 'analytics':
        return <div className="coming-soon"><h2>Advanced Analytics</h2><p>Coming Soon...</p></div>;
      case 'settings':
        return <div className="coming-soon"><h2>Settings</h2><p>Coming Soon...</p></div>;
      default:
        return <Dashboard tasks={tasks} user={user} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <h1>TaskFlow Pro</h1>
          </div>
          
          <div className="header-right">
            <ThemeToggle />
            
            <div className="user-menu">
              <div className="user-info">
                <User size={16} />
                <span>{user.email?.split('@')[0]}</span>
              </div>
              
              <motion.button 
                onClick={handleSignOut} 
                className="btn btn-secondary btn-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                Sign Out
              </motion.button>
            </div>
          </div>
        </header>
        
        <main className="content-area">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--surface-color)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        }}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App
