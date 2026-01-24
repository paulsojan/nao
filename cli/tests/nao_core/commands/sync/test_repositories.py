from pathlib import Path

from nao_core.commands.sync import remove_unused_repos
from nao_core.config.repos import RepoConfig


def test_remove_unused_repos(tmp_path: Path):
    base_path = tmp_path / "repos"
    base_path.mkdir()

    create_repo_dir(base_path, "repo1")
    create_repo_dir(base_path, "repo2")
    create_repo_dir(base_path, "old_repo")

    config_repos = [
        RepoConfig(name="repo1", url="https://example.com/repo1.git"),
        RepoConfig(name="repo2", url="https://example.com/repo2.git"),
    ]

    remove_unused_repos(config_repos, base_path)

    remaining = {p.name for p in base_path.iterdir() if p.is_dir()}
    assert remaining == {"repo1", "repo2"}
    assert not (base_path / "old_repo").exists()


def create_repo_dir(base: Path, name: str) -> Path:
    repo = base / name
    repo.mkdir(parents=True)
    (repo / "README.md").write_text("dummy")
    return repo
