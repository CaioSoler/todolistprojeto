# To-Do List — Frontend (React + Vite)

## Como rodar
1. Suba o backend (MySQL com `schema.sql` já executado) em `http://localhost:3333`.
2. Neste diretório:
   ```bash
   npm install
   npm run dev
   ```
3. Abra http://localhost:5173 (porta exigida pelo `CORS_ORIGIN` do backend).

Para apontar para outro backend, crie um `.env` com `VITE_API_URL=http://seu-host:3333`.
