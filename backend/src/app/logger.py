import contextvars
import logging
import time
import uuid

from fastapi import FastAPI, Request

LOG_FORMAT = "%(asctime)s [%(levelname)s] [%(request_id)s] %(name)s: %(message)s"
APP_LOGGER_NAME = "article_manager"


request_id_var: contextvars.ContextVar[str] = contextvars.ContextVar(
    "request_id", default="-"
)


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.request_id = request_id_var.get()
        return True


def configure_logging() -> logging.Logger:
    logging.basicConfig(
        level=logging.INFO,
        format=LOG_FORMAT,
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    _request_id_filter = RequestIdFilter()
    for handler in logging.getLogger().handlers:
        handler.addFilter(_request_id_filter)
    return logging.getLogger(APP_LOGGER_NAME)


def register_logging(app: FastAPI, logger: logging.Logger) -> None:

    @app.middleware("http")
    async def logging_middleware(request: Request, call_next):
        # --- before_request equivalent ---
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        token = request_id_var.set(request_id)

        try:
            start_time = time.perf_counter()

            logger.info("→ %s %s", request.method, request.url.path)

            # --- run route + exception handlers ---
            response = await call_next(request)

            # --- after_request equivalent ---
            duration_ms = (time.perf_counter() - start_time) * 1000
            response.headers["X-Request-ID"] = request_id
            logger.info(
                "← %s %s %d (%.1fms)",
                request.method,
                request.url.path,
                response.status_code,
                duration_ms,
            )
            return response
        finally:
            request_id_var.reset(token)
