import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.exceptions import (
    AuthenticationError,
    ClientInputError,
    EntitiesNotFoundError,
    EntityDuplicatedError,
    InvalidCredentialsError,
    ParsingError,
)


def register_error_handlers(app: FastAPI, logger: logging.Logger) -> None:

    @app.exception_handler(EntityDuplicatedError)
    def handle_duplicated_error(request: Request, error: EntityDuplicatedError):
        logger.warning(
            "%s failed — duplicate %s for user_id=%s: %s",
            error.action,
            error.entity_name,
            error.user_id,
            error.entity_id,
        )
        return JSONResponse(
            status_code=409,
            content={"detail": str(error)},
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

    @app.exception_handler(EntitiesNotFoundError)
    def handle_entities_not_found_error(request: Request, error: EntitiesNotFoundError):
        logger.warning(
            "Entities not found on %s %s: missing_ids=%s",
            request.method,
            request.url.path,
            error.missing_ids,
        )
        return JSONResponse(
            status_code=404,
            content={"detail": str(error), "missing_ids": error.missing_ids},
        )

    @app.exception_handler(InvalidCredentialsError)
    def handle_credentials_error(request: Request, error: InvalidCredentialsError):
        logger.warning(
            "Authentication error on %s %s: %s",
            request.method,
            request.url.path,
            str(error),
        )
        return JSONResponse(
            status_code=401,
            content={"detail": str(error)},
        )

    @app.exception_handler(ClientInputError)
    def handle_invalid_input(request: Request, error: ClientInputError):
        logger.warning(
            "Invalid input on %s %s: %s",
            request.method,
            request.url.path,
            str(error),
        )
        return JSONResponse(
            status_code=400,
            content={"detail": str(error)},
        )

    @app.exception_handler(ParsingError)
    def handle_parsing_error(request: Request, error: ParsingError):
        logger.warning(
            "Error while parsing on %s %s: %s",
            request.method,
            request.url.path,
            str(error),
        )
        return JSONResponse(
            status_code=400,
            content={"detail": str(error)},
        )

    @app.exception_handler(AuthenticationError)
    def handle_token_error(request: Request, error: AuthenticationError):
        logger.warning(
            "Invalid token on %s %s: %s",
            request.method,
            request.url.path,
            str(error),
        )
        return JSONResponse(
            status_code=401,
            content={"detail": str(error)},
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
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )
