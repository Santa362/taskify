import React from 'react';
import { CalendarIcon, PencilIcon, TrashIcon, CheckIcon } from './Icons.jsx';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'completed';
  return (
    <li className={`task${done ? ' is-done' : ''}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
        className={`check${done ? ' checked' : ''}`}
        onClick={() => onToggle(task)}
      >
        {done && <CheckIcon width={14} height={14} strokeWidth={3} />}
      </button>

      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-date"><CalendarIcon width={13} height={13} /> {formatDate(task.createdAt)}</div>
      </div>

      <span className={`badge ${done ? 'badge-done' : 'badge-pending'}`}>{done ? 'Completed' : 'Pending'}</span>

      <button type="button" className="icon-btn edit" aria-label={`Edit "${task.title}"`} onClick={() => onEdit(task)}>
        <PencilIcon width={16} height={16} />
      </button>
      <button type="button" className="icon-btn delete" aria-label={`Delete "${task.title}"`} onClick={() => onDelete(task)}>
        <TrashIcon width={16} height={16} />
      </button>
    </li>
  );
}
