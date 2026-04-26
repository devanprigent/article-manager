class EntitiesNotFoundError(ValueError):
    """Raised when one or more ids do not exist for the given model."""

    def __init__(self, missing_ids: list[int], message: str):
        self.missing_ids = missing_ids
        super().__init__(message)
