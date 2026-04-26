# Article Manager
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000000)](https://react.dev/)
[![CI](https://github.com/devanprigent/article-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/devanprigent/article-manager/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Web app to save, organize, and revisit articles. Create an account, manage a personal article library, mark articles as read or favorite, and track reading trends.

## Screenshots

![Homepage](frontend/docs/img/homepage.PNG)
----
![Favorites](frontend/docs/img/favorites.PNG)
----
![Statistics](frontend/docs/img/stats.PNG)

## Stack


| Layer    | Technology                                                                                                      |
| -------- | --------------------------------------------------------------------------------------------------------------- |
| Frontend | React 18, Vite, TypeScript, React Router, TanStack Query, MUI X Data Grid, Tailwind, Bootstrap, Recharts, Axios |
| Backend  | Flask 3, Flask-JWT-Extended, Flask-SQLAlchemy, Pydantic, flask-cors                                            |
| Database | PostgreSQL                                                                                                      |
| Tooling  | Pytest, Ruff, ESLint, Prettier, Vitest, Husky                                                                  |


The API exposes JWT-protected resources at `/articles`, `/authors`, `/authors/top`, and `/tags`, plus auth routes under `/auth`.

## Features

- Register, login, and logout with JWT authentication.
- Create, edit, delete, and list articles scoped to the current user.
- Track article metadata: title, author, URL, year, summary, tags, read status, read-again status, and favorites.
- Browse favorites separately from the main article table.
- View stats for top authors and articles read by month.
- Toggle light and dark themes.

## Prerequisites

- Python 3.12 and pip
- Node.js 22 and npm
- PostgreSQL database

## Getting Started

### Backend (`backend/`)

Create a virtual environment and install dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example`:

```
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/article_manager
FRONTEND_ORIGIN=http://localhost:3000
```

Start the Flask API:

```bash
python src/main.py
```

The backend creates the SQLAlchemy tables on startup. By default, Flask serves the API on `http://127.0.0.1:5000`.



### Frontend (`frontend/`)

To run the frontend, execute the following commands:

```bash
cd frontend
npm install
npm run dev
```

Then open your browser and go to `http://127.0.0.1:5000`. 

## Checks

Run backend checks:

```bash
ruff check .
pytest
```

Run frontend checks:

```bash
npm run lint
npm run build
```

