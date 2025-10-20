
#!/usr/bin/env bash
set -euo pipefail

echo "Bootstrapping monorepo..."
ROOT_DIR="$(cd "$(dirname "$0")" && cd ../ && pwd)"

for P in v1 v2; do
  echo "Installing deps in $P..."
  (cd "$ROOT_DIR/$P" && npm ci || npm i)
  echo "Installing husky in $P..."
  (cd "$ROOT_DIR/$P" && npx husky install || true)
done

echo "Bootstrap complete. Run 'cd v1 && npm run release:pr' to create a release PR for v1 (requires RELEASE_PLEASE_TOKEN)."
