import logging

from flask import Flask, jsonify, request
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException

from app.exceptions import EntitiesNotFoundError, EntityDuplicatedError


def register_error_handlers(app: Flask, logger: logging.Logger) -> None:

    @app.errorhandler(EntityDuplicatedError)
    def handle_duplicated_error(error: EntityDuplicatedError):
        logger.warning(
            "%s failed — duplicate %s for user_id=%d: %s",
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
