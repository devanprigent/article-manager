import re
import socket
from ipaddress import ip_address
from typing import Any, Literal, NotRequired, TypedDict
from urllib.parse import urlsplit

import httpx2
from bs4 import BeautifulSoup
from bs4.element import Tag

from app.exceptions import UrlValidationError


class Candidate(TypedDict):
    name: str | Literal[True]
    location: NotRequired[Literal["content", "datetime", "structured_text", "text"]]
    kwargs: NotRequired[dict[str, Any]]


class ContentParser:
    BLOCK_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "blockquote", "li"}
    IGNORED_TAGS = {"script", "style", "nav", "footer", "aside"}

    @staticmethod
    def extract_structured_text(container: Tag | None) -> list[dict[str, str]]:
        blocks: list[dict[str, str]] = []

        if container is None:
            return blocks

        def walk(node: Tag) -> None:
            for child in node.children:
                if not isinstance(child, Tag):
                    continue

                if child.name in ContentParser.IGNORED_TAGS:
                    continue

                if child.name in ContentParser.BLOCK_TAGS:
                    text = MetadataParser.clean_text(child.get_text(" ", strip=True))
                    if text:
                        blocks.append({"tag": child.name, "text": text})
                    continue

                walk(child)

        walk(container)
        return blocks

    @staticmethod
    def get_content(
        candidates: list[Candidate], html_doc: BeautifulSoup | None
    ) -> list[dict[str, str]] | None:
        if not html_doc:
            return None
        for candidate in candidates:
            tag = html_doc.find(candidate["name"], **candidate.get("kwargs", {}))
            element = ContentParser.extract_structured_text(tag)
            if element:
                return element
        return None


class MetadataParser:
    def __init__(self, url: str):
        self.url = MetadataParser.sanitize_url(url)
        self.doc: BeautifulSoup | None = None
        self.title = ""
        self.author = ""
        self.date = ""
        self.content: list[dict] = []

    async def fetch(self):
        res = await MetadataParser.fetch_document(self.url)
        self.doc = res

    @staticmethod
    def sanitize_url(url):
        try:
            parsed_url = urlsplit(url)
            protocol = parsed_url.scheme
            if protocol not in ["http", "https"]:
                raise UrlValidationError(
                    "Invalid protocol - only http and https are permitted."
                )
            hostname = parsed_url.hostname
            if not hostname:
                raise UrlValidationError("Invalid URL.")
            port = parsed_url.port or (443 if parsed_url.scheme == "https" else 80)
            resolved_ips = socket.getaddrinfo(hostname, port)
            for result in resolved_ips:
                socket_address = result[4]
                resolved_ip = socket_address[0]
                addr = ip_address(resolved_ip)
                if not addr.is_global:
                    raise UrlValidationError(
                        "Invalid IP - the resolved IP has been rejected."
                    )
        except (ValueError, socket.gaierror) as e:
            raise UrlValidationError("Unable to resolve URL.") from e
        return url

    def parse(self):
        self.get_title()
        self.get_author()
        self.get_date()

    @staticmethod
    def get_attribute(
        candidates: list[Candidate], html_doc: BeautifulSoup | None
    ) -> str:
        if not html_doc:
            return ""
        for candidate in candidates:
            tag = html_doc.find(candidate["name"], **candidate.get("kwargs", {}))
            element = MetadataParser.extract_text(tag, candidate["location"])
            element = MetadataParser.clean_text(element)
            if element:
                return element
        return ""

    @staticmethod
    def extract_text(tag: Tag | None, location: str) -> str | None:
        if not tag:
            return ""
        if location == "content":
            content = tag.get("content")
            if content and isinstance(content, str):
                return content
            return ""
        if location == "datetime":
            datetime_value = tag.get("datetime")
            if datetime_value and isinstance(datetime_value, str):
                return datetime_value
            return ""
        return tag.get_text()

    @staticmethod
    def clean_text(text: str | None) -> str:
        if not text:
            return ""
        return text.strip()

    @staticmethod
    async def fetch_document(url: str):
        headers = {"User-Agent": "ArticleManager/1.0"}
        async with httpx2.AsyncClient() as client:
            response = await client.get(
                url, headers=headers, timeout=10, follow_redirects=False
            )
            if hasattr(response, "is_redirect") and response.is_redirect:
                raise UrlValidationError("Redirects are not allowed.")
        response.raise_for_status()
        return BeautifulSoup(response.text, "html.parser")

    def get_title(self) -> None:
        candidates: list[Candidate] = [
            {"name": "meta", "kwargs": {"property": "og:title"}, "location": "content"},
            {
                "name": "meta",
                "kwargs": {"attrs": {"name": "twitter:title"}},
                "location": "content",
            },
            {"name": "title", "location": "text"},
            {"name": "h1", "location": "text"},
        ]
        self.title = MetadataParser.get_attribute(candidates, self.doc)

    def get_author(self) -> None:
        candidates: list[Candidate] = [
            {
                "name": "meta",
                "kwargs": {"attrs": {"name": "author"}},
                "location": "content",
            },
            {
                "name": "meta",
                "kwargs": {"property": "article:author"},
                "location": "content",
            },
            {"name": True, "kwargs": {"attrs": {"rel": "author"}}, "location": "text"},
            {
                "name": True,
                "kwargs": {"attrs": {"class": "author"}},
                "location": "text",
            },
            {
                "name": True,
                "kwargs": {"attrs": {"class": "byline"}},
                "location": "text",
            },
        ]
        self.author = self.get_attribute(candidates, self.doc)

    def get_date(self) -> None:
        candidates: list[Candidate] = [
            {
                "name": "meta",
                "kwargs": {"property": "article:published_time"},
                "location": "content",
            },
            {
                "name": "meta",
                "kwargs": {"attrs": {"name": "date"}},
                "location": "content",
            },
            {
                "name": "meta",
                "kwargs": {"attrs": {"name": "pubdate"}},
                "location": "content",
            },
            {
                "name": "meta",
                "kwargs": {"attrs": {"name": "publish_date"}},
                "location": "content",
            },
            {
                "name": "meta",
                "kwargs": {"attrs": {"name": "publication_date"}},
                "location": "content",
            },
            {
                "name": "meta",
                "kwargs": {"attrs": {"itemprop": "datePublished"}},
                "location": "content",
            },
            {
                "name": "time",
                "kwargs": {"attrs": {"datetime": True}},
                "location": "datetime",
            },
            {"name": "time", "location": "text"},
        ]
        self.date = self.get_attribute(candidates, self.doc)

    def get_content(self) -> list[dict] | None:
        candidates: list[Candidate] = [
            {"name": "article"},
            {"name": "main"},
            {"name": True, "kwargs": {"attrs": {"class": "article-content"}}},
            {
                "name": True,
                "kwargs": {
                    "attrs": {"class": re.compile(r"(?:^|-)postcontent$|post-content")}
                },
            },
            {"name": True, "kwargs": {"attrs": {"class": "entry-content"}}},
            {"name": True, "kwargs": {"attrs": {"class": "content"}}},
            {"name": True, "kwargs": {"attrs": {"class": "article-body"}}},
            {"name": True, "kwargs": {"attrs": {"class": "post-body"}}},
            {"name": True, "kwargs": {"attrs": {"id": "article"}}},
            {"name": True, "kwargs": {"attrs": {"id": "content"}}},
            {"name": True, "kwargs": {"attrs": {"id": "main-content"}}},
        ]
        return ContentParser.get_content(candidates, self.doc)
