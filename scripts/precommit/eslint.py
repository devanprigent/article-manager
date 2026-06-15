import platform
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FRONTEND = ROOT / "frontend"


def _frontend_relative_paths(paths: list[str]) -> list[str]:
    relative_paths: list[str] = []
    for path in paths:
        file_path = Path(path)
        if file_path.is_absolute():
            try:
                relative_paths.append(str(file_path.relative_to(FRONTEND)))
            except ValueError:
                relative_paths.append(path)
            continue

        normalized = path.replace("\\", "/")
        if normalized.startswith("frontend/"):
            relative_paths.append(normalized.removeprefix("frontend/"))
        else:
            relative_paths.append(normalized)

    return relative_paths


def main() -> int:
    paths = _frontend_relative_paths(sys.argv[1:])
    if not paths:
        return 0

    cmd = ["npx", "eslint", "--fix", *paths]
    result = subprocess.run(
        cmd,
        cwd=FRONTEND,
        shell=platform.system() == "Windows",
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
