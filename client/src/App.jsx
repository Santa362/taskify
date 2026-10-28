import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import TaskModal from './components/TaskModal.jsx';
import TasksPage from './pages/TasksPage.jsx';
import { SunIcon, MoonIcon } from './components/Icons.jsx';
import { getStats } from './api.js';

const TITLES = { '/': 'All Tasks', '/pending': 'Pending Tasks', '/completed': 'Completed Tasks' };

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('taskify-theme') || 'light'; } catch { return 'light'; }
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('taskify-theme', theme); } catch { /* ignore */ }
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))];
}

export default function App() {
  const { pathname } = useLocation();
  const [theme, toggleTheme] = useTheme();
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [version, setVersion] = useState(0);        // bump to make pages and stats reload
  const [modal, setModal] = useState(null);         // null | { task: null | task }
  const [toast, setToast] = useState(null);

  const bump = useCallback(() => setVersion((v) => v + 1), []);
  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    getStats().then(setStats).catch(() => { /* the task list shows the connection error */ });
  }, [version]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const closeModal = useCallback(() => setModal(null), []);
  const saved = (message) => { setModal(null); notify(message); bump(); };

  const page = (filter) => (
    <TasksPage
      filter={filter}
      version={version}
      onChanged={bump}
      onEdit={(task) => setModal({ task })}
      notify={notify}
    />
  );

  return (
    <div className="app">
      <Sidebar stats={stats} onAdd={() => setModal({ task: null })} />

      <div className="main">
        <header className="topbar">
          <h1>{TITLES[pathname] || 'All Tasks'}</h1>
          <div className="topbar-right">
            <button type="button" className="icon-btn plain" onClick={toggleTheme}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
              {theme === 'light' ? <SunIcon /> : <MoonIcon />}
            </button>
            <div className="user"><span className="avatar">U</span> User</div>
          </div>
        </header>

        <div className="content">
          <Routes>
            <Route path="/" element={page('all')} />
            <Route path="/pending" element={page('pending')} />
            <Route path="/completed" element={page('completed')} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <footer className="footer">&copy; {new Date().getFullYear()} Taskify. All rights reserved.</footer>
      </div>

      {modal && <TaskModal task={modal.task} onClose={closeModal} onSaved={saved} />}
      {toast && <div key={toast.id} className={`toast ${toast.type}`} role="status">{toast.message}</div>}
    </div>
  );
}
