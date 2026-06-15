import platform
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FRONTEND = ROOT / "frontend"


def main() -> int:
    if len(sys.argv) < 2:
        return 1

    cmd = ["npx", "commitlint", "--edit", sys.argv[1]]
    result = subprocess.run(
        cmd,
        cwd=FRONTEND,
        shell=platform.system() == "Windows",
        check=False,
    )
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
