from dataclasses import dataclass
from pathlib import Path
from typing import List

from nao_core.commands.sync import remove_unused_databases


@dataclass
class DBConfig:
    type: str
    project_id: str | None = None
    path: str | None = None
    database: str | None = None


def test_remove_unused_databases(tmp_path: Path):
    db_root = tmp_path / "databases"
    db_root.mkdir()

    create_db_dir(db_root, "bigquery", "project1")
    create_db_dir(db_root, "postgres", "appdb")

    databases: List[DBConfig] = [
        DBConfig(type="bigquery", project_id="project1"),
    ]

    remove_unused_databases(databases, db_root)

    remaining = {p.name for p in db_root.iterdir()}
    assert remaining == {"type=bigquery"}
    assert not (db_root / "type=postgres").exists()


def create_db_dir(base: Path, type_name: str, db_name: str):
    db_dir = base / f"type={type_name}" / f"database={db_name}"
    db_dir.mkdir(parents=True)
    (db_dir / "schema.md").write_text("dummy")
    return db_dir
