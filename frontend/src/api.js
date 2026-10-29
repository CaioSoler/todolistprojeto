const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, { method = 'GET', body } = {}) {
  // Content-Type só é enviado quando há corpo: o Fastify rejeita
  // requisições (ex.: DELETE) com "application/json" e corpo vazio.
  const options = { method };
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, options);
  } catch {
    throw new Error('Não foi possível conectar ao servidor.');
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Ocorreu um erro inesperado.');
  return data;
}

export const api = {
  list: ({ search, status }) => {
    const qs = new URLSearchParams({ search, status });
    return request(`/api/tasks?${qs}`);
  },
  create: (payload) => request('/api/tasks', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/tasks/${id}`, { method: 'PATCH', body: payload }),
  remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
};
