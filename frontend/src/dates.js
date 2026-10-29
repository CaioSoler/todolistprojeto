// due_date chega do backend como string 'YYYY-MM-DD' (dateStrings: true),
// então comparamos strings em vez de Date para evitar problemas de fuso.
export function todayString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export function isOverdue(task) {
  return !task.completed && !!task.due_date && task.due_date.slice(0, 10) < todayString();
}
