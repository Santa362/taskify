import React, { useCallback, useEffect, useState } from 'react';
import { getTasks, createTask, toggleTask, deleteTask, errorMessage } from '../api.js';
import TaskItem from '../components/TaskItem.jsx';
import { PlusIcon } from '../components/Icons.jsx';

const EMPTY_TEXT = {
  all: 'No tasks yet. Add your first task above.',
  pending: 'No pending tasks. Nice work!',
  completed: 'No completed tasks yet.',
};

// filter is 'all' | 'pending' | 'completed'. `version` changes whenever data changes elsewhere (e.g. the modal).
export default function TasksPage({ filter, version, onChanged, onEdit, notify }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [addError, setAddError] = useState('');

  const load = useCallback(async () => {
    try {
      setTasks(await getTasks(filter));
      setLoadError('');
    } catch (err) {
      setLoadError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { setLoading(true); load(); }, [load, version]);

  const quickAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) { setAddError('Please enter a task title'); return; }
    try {
      await createTask({ title: newTitle });
      setNewTitle('');
      setAddError('');
      notify('Task added');
      onChanged();
    } catch (err) {
      setAddError(errorMessage(err));
    }
  };

  const onToggle = async (task) => {
    try { await toggleTask(task._id); onChanged(); }
    catch (err) { notify(errorMessage(err), 'error'); }
  };

  const onDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try { await deleteTask(task._id); notify('Task deleted'); onChanged(); }
    catch (err) { notify(errorMessage(err), 'error'); }
  };

  return (
    <>
      <form className="quick-add card" onSubmit={quickAdd}>
        <input
          value={newTitle}
          maxLength={100}
          onChange={(e) => { setNewTitle(e.target.value); setAddError(''); }}
          placeholder="Enter a new task..."
          aria-label="New task title"
        />
        <button type="submit" className="btn primary"><PlusIcon width={16} height={16} /> Add Task</button>
      </form>
      {addError && <div className="form-error inline" role="alert">{addError}</div>}

      {loadError ? (
        <div className="card state error-state" role="alert">
          <p>{loadError}</p>
          <button type="button" className="btn primary" onClick={() => { setLoading(true); load(); }}>Try again</button>
        </div>
      ) : loading && tasks.length === 0 ? (
        <div className="card state">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="card state">{EMPTY_TEXT[filter]}</div>
      ) : (
        <ul className="task-list">
          {tasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </>
  );
}
