import logging
import time
import uuid

from flask import Flask, has_request_context, request

LOG_FORMAT = "%(asctime)s [%(levelname)s] [%(request_id)s] %(name)s: %(message)s"
APP_LOGGER_NAME = "article_manager"


class RequestIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        if has_request_context():
            record.request_id = getattr(request, "request_id", "-")
        else:
            record.request_id = "-"
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


def register_logging(app: Flask, logger: logging.Logger) -> None:

    @app.before_request
    def _set_request_id():
        request.request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

    @app.after_request
    def _return_request_id(response):
        response.headers["X-Request-ID"] = request.request_id
        return response

    @app.before_request
    def _log_request_start():
        request.start_time = time.perf_counter()
        logger.info("→ %s %s", request.method, request.path)

    @app.after_request
    def _log_request_end(response):
        duration_ms = (time.perf_counter() - request.start_time) * 1000
        logger.info(
            "← %s %s %d (%.1fms)",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )
        return response
