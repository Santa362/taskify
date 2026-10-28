import React, { useEffect, useRef, useState } from 'react';
import { createTask, updateTask, errorMessage } from '../api.js';
import { CloseIcon } from './Icons.jsx';

// Used for both "Add Task" (task = null) and "Edit Task".
export default function TaskModal({ task, onClose, onSaved }) {
  const editing = Boolean(task);
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState(task?.status ?? 'pending');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setSaving(true);
    setError('');
    try {
      if (editing) await updateTask(task._id, { title, description, status });
      else await createTask({ title, description });
      onSaved(editing ? 'Task updated' : 'Task added');
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-head">
          <h2 id="modal-title">{editing ? 'Edit Task' : 'Add Task'}</h2>
          <button type="button" className="icon-btn plain" aria-label="Close" onClick={onClose}><CloseIcon width={18} height={18} /></button>
        </div>

        <label className="field">
          <span>Title</span>
          <input ref={titleRef} value={title} maxLength={100} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Complete MERN Stack Project" />
        </label>

        <label className="field">
          <span>Description <em>(optional)</em></span>
          <textarea rows={3} value={description} maxLength={500} onChange={(e) => setDescription(e.target.value)} placeholder="Add a few details" />
        </label>

        {editing && (
          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        )}

        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="modal-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={saving}>{saving ? 'Saving...' : editing ? 'Save changes' : 'Add Task'}</button>
        </div>
      </form>
    </div>
  );
}
