import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.exceptions import AppError


def register_error_handlers(app: FastAPI, logger: logging.Logger) -> None:

    @app.exception_handler(AppError)
    def handle_app_error(request: Request, error: AppError):
        logger.warning(
            "%s on %s %s: %s",
            error.log_label,
            request.method,
            request.url.path,
            error.log_detail(),
        )
        return JSONResponse(
            status_code=error.status_code,
            content={"detail": str(error), **error.response_extra()},
        )

    @app.exception_handler(ValidationError)
    def handle_validation_error(request: Request, error: ValidationError):
        logger.warning(
            "Validation error on %s %s: %s",
            request.method,
            request.url.path,
            error.errors(),
        )
        return JSONResponse(
            status_code=422,
            content={"detail": error.errors()},
        )

    @app.exception_handler(HTTPException)
    def handle_http_exception(request: Request, error: HTTPException):
        logger.warning(
            "HTTP %d on %s %s: %s",
            error.status_code,
            request.method,
            request.url.path,
            error.detail,
        )
        return JSONResponse(
            status_code=error.status_code,
            content={"detail": error.detail},
        )

    @app.exception_handler(Exception)
    def handle_unexpected(request: Request, error):
        logger.exception("Unhandled error on %s %s",
                         request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )
