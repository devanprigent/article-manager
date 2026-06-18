import logging

from flask import Flask, jsonify, request
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException

from app.exceptions import (
    ClientInputError,
    EntitiesNotFoundError,
    EntityDuplicatedError,
    InvalidCredentialsError,
    ParsingError,
)


def register_error_handlers(app: Flask, logger: logging.Logger) -> None:

    @app.errorhandler(EntityDuplicatedError)
    def handle_duplicated_error(error: EntityDuplicatedError):
        logger.warning(
            "%s failed — duplicate %s for user_id=%s: %s",
            error.action,
            error.entity_name,
            error.user_id,
            error.entity_id,
        )
        return jsonify({"error": str(error)}), 409

    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        logger.warning(
            "Validation error on %s %s: %s",
            request.method,
            request.path,
            error.errors(),
        )
        return jsonify({"error": error.errors()}), 422

    @app.errorhandler(EntitiesNotFoundError)
    def handle_entities_not_found_error(error: EntitiesNotFoundError):
        logger.warning(
            "Entities not found on %s %s: missing_ids=%s",
            request.method,
            request.path,
            error.missing_ids,
        )
        return jsonify({"error": str(error), "missing_ids": error.missing_ids}), 404

    @app.errorhandler(InvalidCredentialsError)
    def handle_credentials_error(error: InvalidCredentialsError):
        logger.warning(
            "Authentication error on %s %s: %s",
            request.method,
            request.path,
            str(error),
        )
        return jsonify({"error": str(error)}), 401

    @app.errorhandler(ClientInputError)
    def handle_invalid_input(error: ClientInputError):
        logger.warning(
            "Invalid input on %s %s: %s",
            request.method,
            request.path,
            str(error),
        )
        return jsonify({"error": str(error)}), 400

    @app.errorhandler(ParsingError)
    def handle_parsing_error(error: ParsingError):
        logger.warning(
            "Error while parsing on %s %s: %s",
            request.method,
            request.path,
            str(error),
        )
        return jsonify({"error": str(error)}), 400

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        logger.warning(
            "HTTP %d on %s %s: %s",
            error.code,
            request.method,
            request.path,
            error.description,
        )
        return jsonify({"error": error.description}), error.code

    @app.errorhandler(Exception)
    def handle_unexpected(error):
        logger.exception("Unhandled error on %s %s", request.method, request.path)
        return jsonify({"error": "Internal server error"}), 500
