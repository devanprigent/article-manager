# Contributing

Any contribution is appreciated, no matter your experience level!

This project is open to improvements, additional tests, bug fixes, and new ideas. 

Keep contributions simple, clear, and well-documented.

---

## Getting started

### 1. Clone the repository

```
git clone <repo-url>
cd <repo-name>
```

### 2. Backend setup (Flask)

Create `backend/.env` from `backend/.env.example`:

```
SECRET_KEY=change-me
JWT_SECRET_KEY=change-me
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/article_manager
FRONTEND_ORIGIN=http://localhost:3000
```

Then launch the development server: 

```
cd backend
python -m venv venv

# On Windows
.\venv\Scripts\Activate.ps1

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python ./src/main.py
```

### 3. Frontend setup (React)

```
cd frontend
npm install
npm run start
```

---

## How to contribute

1. Fork the repository
2. Create a new branch:
```
git checkout -b feature/your-feature-name
```
3. Make your changes
4. Add or update tests if relevant
5. Commit with a clear message that follows the commitlint rules:

```
git commit -m "type(scope): short description of the change"
```

For example:

```
git commit -m "test(frontend): verify logout redirects to homepage"
```

6. Push and open a Pull Request

---

## Guidelines

- Keep changes **small and focused**
- Write **clear, readable code**
- Add tests for new features or bug fixes (Pytest for backend)
- Make sure existing tests pass before submitting

---

## Issues

- Use issues to report bugs or suggest improvements
- Be as clear and specific as possible (check existing issues for the expected format)

