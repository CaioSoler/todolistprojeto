import { PencilIcon, TrashIcon, CheckIcon } from './Icons.jsx';
import { formatDate, isOverdue } from '../dates.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = !!task.completed;
  const overdue = isOverdue(task);

  return (
    <li className="task">
      <label className="check">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle(task)}
          aria-label={`Marcar "${task.title}" como ${done ? 'pendente' : 'concluída'}`}
        />
        <span className="check__box"><CheckIcon /></span>
      </label>

      <div className="task__body">
        <span className={`task__title ${done ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`}>
          {task.title}
        </span>
        {task.due_date && (
          <span className={`task__date ${overdue ? 'is-overdue' : ''}`}>
            {formatDate(task.due_date)}
          </span>
        )}
        {overdue && <span className="badge">Em atraso</span>}
      </div>

      <div className="task__actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label={`Editar "${task.title}"`}>
          <PencilIcon />
        </button>
        <button className="icon-btn" onClick={() => onDelete(task)} aria-label={`Excluir "${task.title}"`}>
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
