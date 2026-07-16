# Full-Stack Task Manager

> Repository: `chore-chart` · https://github.com/bugship/chore-chart

Full-stack task manager with JWT authentication. React + Vite frontend, Express + MongoDB backend, Docker Compose for local full-stack runs.

## Features

- Register / login with JWT
- Create, complete, update, and delete tasks
- Filter by status (all / active / completed)
- Priority levels (Low, Medium, High)
- Tailwind CSS UI
- Dockerized frontend, backend, and MongoDB

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React 19, React Router, Tailwind CSS 4, Vite |
| Backend | Express 5, MongoDB, Mongoose, JWT, bcryptjs |
| Ops | Docker Compose |

## Structure

```
chore-chart/
├── task-management-backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── seed.js
│   └── Dockerfile
├── task-management-frontend/
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/tasks` | Yes | List (`?status=`) |
| POST | `/api/tasks` | Yes | Create |
| PUT | `/api/tasks/:id` | Yes | Update |
| DELETE | `/api/tasks/:id` | Yes | Delete |

## Run with Docker

```bash
git clone https://github.com/bugship/chore-chart.git
cd chore-chart
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Local development

```bash
# Backend
cd task-management-backend
cp .env.example .env
npm install
npm run dev
# optional: npm run seed

# Frontend
cd ../task-management-frontend
cp .env.example .env
npm install
npm run dev
```

## License

MIT
