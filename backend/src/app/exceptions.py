class AppError(Exception):
    """Base class for errors translated into an HTTP response by the app."""

    status_code = 400
    log_label = "Client error"

    def log_detail(self) -> str:
        return str(self)

    def response_extra(self) -> dict:
        return {}


class EntityDuplicatedError(AppError):
    status_code = 409
    log_label = "Duplicate entity"

    def __init__(
        self, action: str, user_id: int | None, entity_name: str, entity_id: int | str
    ):
        self.action = action
        self.user_id = user_id
        self.entity_name = entity_name
        self.entity_id = entity_id
        super().__init__(
            f"{action} failed — duplicate {entity_name.lower()}: {entity_id!r}"
        )

    def log_detail(self) -> str:
        return f"{self} (user_id={self.user_id})"


class EntitiesNotFoundError(AppError):
    """Raised when one or more ids do not exist for the given model."""

    status_code = 404
    log_label = "Entities not found"

    def __init__(self, missing_ids: list[int], message: str):
        self.missing_ids = missing_ids
        super().__init__(message)

    def log_detail(self) -> str:
        return f"missing_ids={self.missing_ids}"

    def response_extra(self) -> dict:
        return {"missing_ids": self.missing_ids}


class InvalidCredentialsError(AppError):
    status_code = 401
    log_label = "Authentication error"


class EntityInUseError(AppError):
    status_code = 400
    log_label = "Entity cannot be deleted"


class ClientInputError(AppError):
    status_code = 400
    log_label = "Invalid input"


class AuthenticationError(AppError):
    status_code = 401
    log_label = "Invalid token"


class ParsingError(AppError):
    status_code = 400
    log_label = "Error while parsing"


class UrlValidationError(ParsingError):
    pass


class MetadataParsingError(ParsingError):
    pass
