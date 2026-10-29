import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from './api.js';
import { useDebounce } from './hooks/useDebounce.js';
import Sidebar from './components/Sidebar.jsx';
import TaskItem from './components/TaskItem.jsx';
import TaskModal from './components/TaskModal.jsx';
import { MoonIcon, SunIcon, PlusIcon, ClipboardIcon } from './components/Icons.jsx';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [totals, setTotals] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);
  const [status, setStatus] = useState('all');

  const [modal, setModal] = useState({ open: false, task: null });
  const [collapsed, setCollapsed] = useState(window.innerWidth < 760);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Evita que uma resposta antiga sobrescreva uma mais recente (race condition na busca)
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const current = ++requestId.current;
    try {
      const data = await api.list({ search: debouncedSearch.trim(), status });
      if (current !== requestId.current) return;
      setTasks(data.tasks.map((t) => ({ ...t, completed: !!t.completed })));
      setTotals({ total: data.total, completed: data.completed });
      setError('');
    } catch (err) {
      if (current === requestId.current) setError(err.message);
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [debouncedSearch, status]);

  useEffect(() => { load(); }, [load]);

  async function run(action) {
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const handleToggle = (task) => run(() => api.update(task.id, { completed: !task.completed }));

  const handleDelete = (task) => {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    run(() => api.remove(task.id));
  };

  // Lança erro para o modal exibir; recarrega a lista em caso de sucesso
  async function handleSave(payload) {
    if (modal.task) await api.update(modal.task.id, payload);
    else await api.create(payload);
    await load();
  }

  const tasksLeft = totals.total - totals.completed;
  const searching = debouncedSearch.trim() !== '';

  return (
    <div className="app">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="main">
        <button
          className="icon-btn theme-toggle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          aria-label="Alternar tema claro/escuro"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <main className="content">
          <h1>My Tasks</h1>

          <div className="toolbar">
            <input
              className="search"
              type="search"
              placeholder="Type your task here..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Buscar tarefas"
            />
            <button className="btn" onClick={() => setModal({ open: true, task: null })}>
              <PlusIcon width={13} height={13} strokeWidth={3} /> Add
            </button>
          </div>

          <div className="meta">
            <div className="filters" role="tablist" aria-label="Filtrar tarefas">
              {FILTERS.map((f, i) => (
                <span key={f.value}>
                  {i > 0 && <span className="filters__sep"> | </span>}
                  <button
                    role="tab"
                    aria-selected={status === f.value}
                    className={`filters__btn ${status === f.value ? 'is-active' : ''}`}
                    onClick={() => setStatus(f.value)}
                  >
                    {f.label}
                  </button>
                </span>
              ))}
            </div>
            <span className="counters">
              {tasksLeft} {tasksLeft === 1 ? 'task' : 'tasks'} left · {totals.completed}/{totals.total} completed
            </span>
          </div>

          {error && <div className="alert" role="alert">{error}</div>}

          {loading ? (
            <p className="empty">Loading...</p>
          ) : tasks.length === 0 ? (
            <div className="empty">
              <ClipboardIcon />
              <p>
                {searching
                  ? 'No tasks match your search.'
                  : status === 'completed'
                    ? 'You have no completed tasks.'
                    : 'You have no pending tasks.'}
              </p>
            </div>
          ) : (
            <ul className="list">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggle}
                  onEdit={(t) => setModal({ open: true, task: t })}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </main>

        <footer className="footer">© {new Date().getFullYear()}</footer>
      </div>

      <button
        className="fab"
        onClick={() => setModal({ open: true, task: null })}
        aria-label="Criar nova tarefa"
      >
        <PlusIcon width={22} height={22} strokeWidth={2.5} />
      </button>

      {modal.open && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          onClose={() => setModal({ open: false, task: null })}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
