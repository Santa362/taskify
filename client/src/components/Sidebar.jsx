import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, ClockIcon, CheckCircleIcon, PlusCircleIcon, ClipboardIcon } from './Icons.jsx';

export default function Sidebar({ stats, onAdd }) {
  const link = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-logo"><ClipboardIcon width={22} height={22} /></span>
        <div>
          <div className="brand-name">Taskify</div>
          <div className="brand-tag">Manage your tasks</div>
        </div>
      </div>

      <nav className="nav" aria-label="Main">
        <NavLink to="/" end className={link}><HomeIcon /> All Tasks</NavLink>
        <NavLink to="/pending" className={link}><ClockIcon /> Pending</NavLink>
        <NavLink to="/completed" className={link}><CheckCircleIcon /> Completed</NavLink>
        <button type="button" className="nav-item" onClick={onAdd}><PlusCircleIcon /> Add Task</button>
      </nav>

      <div className="stats">
        <div className="stats-title">Stats</div>
        <div className="stat-card">
          <span className="stat-icon blue"><ClipboardIcon width={18} height={18} /></span>
          <div><div className="stat-label">Total Tasks</div><div className="stat-value" data-testid="stat-total">{stats.total}</div></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon orange"><ClockIcon /></span>
          <div><div className="stat-label">Pending</div><div className="stat-value" data-testid="stat-pending">{stats.pending}</div></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon green"><CheckCircleIcon /></span>
          <div><div className="stat-label">Completed</div><div className="stat-value" data-testid="stat-completed">{stats.completed}</div></div>
        </div>
      </div>
    </aside>
  );
}
