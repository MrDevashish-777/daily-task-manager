import { useState, useEffect } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Auth from './components/Auth'
import TaskManager from './components/TaskManager'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './App.css'

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme} 
      className="btn btn-secondary btn-sm"
      style={{ marginRight: '1rem' }}
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading...
    </div>
  );

  return (
    <div className="App">
      <header className="header">
        <h1>Internship Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
          {user && (
            <div className="user-info">
              <span>{user.email}</span>
              <button onClick={handleSignOut} className="btn btn-secondary btn-sm" style={{ marginLeft: '1rem' }}>Sign Out</button>
            </div>
          )}
        </div>
      </header>
      <main className="app-container">
        {user ? <TaskManager /> : <Auth />}
      </main>
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
