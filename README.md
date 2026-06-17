# Article Manager
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000000)](https://react.dev/)
[![CI](https://github.com/devanprigent/article-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/devanprigent/article-manager/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)


Article Manager is an open-source read-it-later web application. 

I needed a simple way to track articles I read, add notes, and get basic insights on my reading habits. 

Existing tools felt too heavy or were missing features, so I built my own and I've been using it weekly ever since.

🔗 [Try it here!](https://article-manager.devanprigent.com/)


## Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="frontend/public/screenshots/light/articles.PNG" alt="Homepage" width="100%" />
      <br /><sub>Homepage</sub>
    </td>
    <td align="center" width="50%">
      <img src="frontend/public/screenshots/light/likes.PNG" alt="Liked articles" width="100%" />
      <br /><sub>Liked articles</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="frontend/public/screenshots/light/read-later.PNG" alt="Read Later articles" width="100%" />
      <br /><sub>Read Later articles</sub>
    </td>
    <td align="center" width="50%">
      <img src="frontend/public/screenshots/light/stats.PNG" alt="Statistics" width="100%" />
      <br /><sub>Statistics</sub>
    </td>
  </tr>
</table>

## Features

- Create, edit, delete, and list articles scoped to the current user.
- Automatically parse article metadata: title, author, year.
- Automatically parse article content and respect its structure.
- View an article's content directly from the app.
- Use filters to quickly find an article.
- Add custom tags and flags (consulted, liked, read-later) to organize your collection.
- View stats for top authors and articles read by month.
- Toggle light and dark themes.
- Cookie-based JWT authentication with CSRF protection.
- Optimized for large collections (pagination, server-side filtering).

## Architecture

The application is built with a Flask REST API, a PostgreSQL database and a React interface.

Authentication uses JWTs stored in httpOnly cookies, as well as CSRF tokens for authenticated requests.

The project includes automated checks for both frontend and backend code through GitHub Actions.


| Layer    | Technology      | Why?                                                                                          |
| -------- | ----------------|---------------------------------------------------------------------------------------------- |
| Frontend | React 18 | To have a dynamic UI and fast interactions when browsing and filtering articles                      |
| Backend  | Flask 3 | To have a lightweight API, easy to extend                                                             |
| Database | PostgreSQL | A relational database that works cleanly with SQLAlchemy and SQL                                   |
| Tooling  | Pytest, Playwright, Ruff, ESLint, Prettier, Vitest, pre-commit| Automated tests, linting, and formatting for fast feedback      |


## Technical Decisions
For the record, here's the justification for some technical decisions I made during the development:
- The app was first developed using Django and MySQL.
- Migrated from Django to Flask after realizing a simpler framework could work just fine with the features I wanted.
- Migrated from MySQL to PostgreSQL as the latter is extremely common on PaaS and was easier to deploy.
- Added an auth layer and per-user data isolation so users can only access and modify their own saved articles.
- The global state of the React interface was first managed through Redux. When I added TanStack Query to cache requests, I realized I could use it to manage most of the data globally and the remaining data (theme+connected status) could be managed through a simple context.
- Moved from storing tokens in localStorage (vulnerable to XSS attacks) to storing them in cookies with a CSRF protection.
- Deployed frontend on Vercel and backend on Render as the free tier was covering my needs and the setup was easy.
- Decided to handle backend cold starts with a simple `GET /health` endpoint on the server and add user feedback to avoid confusion.
- Added Alembic to handle schema migrations.
- Added pagination and server-side filtering to improve performance on large collections.
- Wrote Playwright tests to perform end-to-end checks on the main features and prevent regressions.

## Prerequisites

- Python 3.12 and [Poetry](https://python-poetry.org/docs/#installation)
- Node.js 22 and npm
- PostgreSQL database


## Getting Started

### Backend (`backend/`)

Install dependencies:

```bash
cd backend
poetry install
```

From the repository root, install Git hooks (run once per clone):

```bash
pre-commit install
pre-commit install --hook-type commit-msg
```

Create `backend/.env` from `backend/.env.example`:

```
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/article_manager
FRONTEND_ORIGIN=http://localhost:3000
```

Create the PostgreSQL database locally:

```bash
createdb article_manager
```

If `createdb` is not available, create it from `psql` instead:

```bash
psql -U postgres
CREATE DATABASE article_manager;
\q
```

Apply the existing database migrations:

```bash
poetry run flask --app src/main.py db upgrade
```

Start the Flask API:

```bash
poetry run python src/main.py
```


### Frontend (`frontend/`)

To run the frontend, execute the following commands:

```bash
cd frontend
npm install
npm run start
```

Then open your browser and go to `http://127.0.0.1:3000`. 

## Checks

Run backend checks:

```bash
poetry run ruff check .
poetry run pytest
```

Run frontend checks:

```bash
npm run lint
npm run build
```