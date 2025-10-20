
# Monorepo (v1 & v2) — CircleCI + release-please scaffold

This generated scaffold includes:
- v1/ and v2/ projects (independent package.json + CHANGELOG.md)
- Commit message enforcement via Husky + Commitlint (pre-push)
- CircleCI config that runs `release-please` for each package on `master`

IMPORTANT NOTES:
- `release-please` primarily targets GitHub. For Bitbucket repositories you will need to:
  - Provide an appropriate token (Bitbucket app password) as `RELEASE_PLEASE_TOKEN` in CircleCI project settings.
  - Ensure the release-please CLI supports your provider and adjust commands accordingly.
  - You can also run release-please to create PRs, then merge them to trigger final releases.

- This scaffold enforces Conventional Commits locally (commitlint). CI runs release-please to create release PRs.
- To enable automatic commits/tags from CI, supply a token with push/tag rights and configure release-please accordingly.
