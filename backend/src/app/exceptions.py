class EntityDuplicatedError(Exception):
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


class EntitiesNotFoundError(ValueError):
    """Raised when one or more ids do not exist for the given model."""

    def __init__(self, missing_ids: list[int], message: str):
        self.missing_ids = missing_ids
        super().__init__(message)


class InvalidCredentialsError(ValueError):
    pass


class ParsingError(Exception):
    pass


class ClientInputError(ValueError):
    pass
