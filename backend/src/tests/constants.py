from pathlib import Path

INVALID_ARTICLE_CASES = [
    (
        {
            "url": "https://example.com/article-2",
            "year": 2026,
            "summary": "Short summary",
            "consulted": False,
            "read_later": False,
            "liked": False,
            "tags": ["Literature"],
            "author": "Test",
        },
        422,
        [["title"]],
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-3",
            "year": 2026,
            "summary": "Short summary",
            "tags": ["Politics"],
            "author": "Test 2",
        },
        422,
        [["consulted"], ["read_later"], ["liked"]],
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-4",
            "year": 2026,
            "summary": "Short summary",
            "consulted": False,
            "read_later": False,
            "liked": False,
            "tags": [""],
            "author": "Test 3",
        },
        422,
        [["tags", 0]],
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-5",
            "year": 2026,
            "summary": "Short summary",
            "consulted": False,
            "read_later": False,
            "liked": False,
            "tags": ["War", ""],
            "author": "Test 4",
        },
        422,
        [["tags", 1]],
    ),
    (
        {
            "title": "My article",
            "url": "https://example.com/article-6",
            "year": 2026,
            "summary": "Short summary",
            "consulted": False,
            "read_later": False,
            "liked": False,
            "tags": ["Science"],
            "author": "",
        },
        422,
        [["author"]],
    ),
]

DEFAULT_PARSER_HTML = """
<html>
  <head><title>Test Article</title></head>
  <body><article><p>Test content</p></article></body>
</html>
"""

FIXTURES_DIR = Path(__file__).parent / "fixtures" / "parser"
