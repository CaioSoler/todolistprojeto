import { useEffect, useRef, useState } from 'react';

// task = null  -> "Create Task"  |  task = {...} -> "Edit Task"
export default function TaskModal({ task, onClose, onSubmit }) {
  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueDate, setDueDate] = useState(task?.due_date?.slice(0, 10) ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('O nome da tarefa é obrigatório.');
      return;
    }
    setSaving(true);
    try {
      // dueDate vazio -> null (cria sem prazo / remove o prazo na edição)
      await onSubmit({ title: title.trim(), dueDate: dueDate || null });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{isEdit ? 'Edit Task' : 'Create Task'}</h2>

        <label className="field">
          <span>Task name</span>
          <input
            ref={inputRef}
            type="text"
            value={title}
            maxLength={255}
            placeholder="Type your task here..."
            onChange={(e) => { setTitle(e.target.value); setError(''); }}
          />
        </label>

        <label className="field">
          <span>Due date (optional)</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </div>
  );
}
