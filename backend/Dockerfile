FROM python:3.12-slim

WORKDIR /code

ENV POETRY_NO_INTERACTION=true \
    POETRY_VIRTUALENVS_IN_PROJECT=false \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR=/tmp/poetry_cache

RUN pip install poetry==2.4.1

COPY ./pyproject.toml ./
COPY ./poetry.lock ./

RUN poetry install --only main --no-root --no-directory && rm -rf $POETRY_CACHE_DIR

COPY ./src ./src
COPY ./alembic.ini ./alembic.ini
COPY ./asgi.py ./asgi.py
COPY ./migrations ./migrations

RUN poetry install --only-root

EXPOSE 5000

CMD ["uvicorn", "asgi:app", "--host", "0.0.0.0", "--port", "5000"]