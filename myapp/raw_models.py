from datetime import date

class RMovie:
    name = None # type : str
    opened_at = None # type: date

    # tuple : (id, name)
    genres = None # type: list

    # tuple: (id, name)
    actors = None # type: list

    thumb_url = None # type: str
    description = None # type: str


class RMovieUserComment:
    id = None # type: int
    movie_id = None # type: int
    score = None # type: int
    body = None # type: str

    is_spoiler = None # type: bool