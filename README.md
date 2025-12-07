# Mono Project: v1 & Client 🚀

This repository contains a mono project with two workspaces:

- **v1** – A barebone TypeScript API for demo purposes 🏭
- **client** (formerly v2) – Future frontend or client workspace 💻

The project uses **CircleCI** for CI/CD, conditional builds, and deployments, with **AWS integration** ☁️ for secure SSH-based deployments.

---

## Repository Structure 📂

```
.
├── v1/           # Barebone TypeScript API
├── client/       # Client workspace (formerly v2)
├── package.json  # Root dependencies
└── .circleci/
    └── config.yml # CI/CD pipeline
```

---

## CircleCI Pipeline Overview 🔧

The CI/CD pipeline is defined in `.circleci/config.yml` and includes three main jobs:

1. **Detect Changes** 🔍 – Determines which workspaces have changes since the last commit.
2. **Build & Test** 🏗️ – Installs dependencies, builds, and tests only for affected workspaces.
3. **Release & Deploy** 🚀 – Conditionally bumps versions, pushes tags, and deploys changes to AWS EC2 instances.

### CI/CD Flow 🌊

```
detect-changes 🔍
       ↓
build-and-test 🏗️
       ↓
release-and-build 🚀
```

---

## Change Detection 📝

- Uses `git diff` to determine changed files.
- Excludes `CHANGELOG.md` from change detection.
- Always includes `package.json` to ensure versioning triggers if dependencies change.

Example output sets workspace variables:

```bash
V1_CHANGED=true
V2_CHANGED=false
```

These variables control which jobs run in subsequent steps.

---

## `$ARGS` / Workspace Variables ⚙️

| Variable     | Description                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------- |
| `V1_CHANGED` | `true` if changes detected in `v1/`; triggers v1 build, test, release                       |
| `V2_CHANGED` | `true` if changes detected in `client/` (formerly v2); triggers client build, test, release |

---

## Versioning 🏷️

- Managed via **`npm version`** in each workspace.
- Follows **conventional commits** (commit restrictions are enforced).
- Only the workspace with detected changes will have its version bumped.
- Tags are pushed automatically after version bumping.

---

## AWS Deployment ☁️

- Uses **SSH to EC2** for deployments.
- Security group ingress is dynamically added for the CircleCI runner IP and removed post-deploy.
- Deployment steps:

  1. Pull latest code from Git 📦
  2. Install dependencies (`npm ci`) 🛠️
  3. Build the project (`npm run build`) 🏗️
  4. Restart the app via `pm2` 🔄

- AWS CLI is installed on the CircleCI runner, and credentials are configured from environment variables.

---

## Running Locally 💻

### v1

```bash
cd v1
npm ci
npm run build
npm test
```

### client (v2)

```bash
cd client
npm ci
npm run build
npm test
```

---

## Notes 📝

- **Mono repo structure** allows separate builds and releases for `v1` and `client`.
- **Conditional builds** prevent unnecessary work if no changes are detected.
- Future plan: `v2` will be fully renamed to `client` across all CI/CD scripts.
- **AWS integration** ensures secure deployments without exposing SSH keys permanently.

---

## CircleCI Configuration Highlights ⚡

- Detect changes:

```yaml
CHANGED_FILES=$(git diff --name-only $BASE_BRANCH...HEAD | grep -v -E "CHANGELOG.md|package.json" || echo "")
if git diff --name-only $BASE_BRANCH...HEAD | grep -q "package.json"; then
CHANGED_FILES="$CHANGED_FILES"$'\n'"package.json"
fi
```

- Conditional builds & tests:

```yaml
if [ "$V1_CHANGED" = "true" ]; then
cd v1
npm ci
npm run build
fi
```

- Conditional release & AWS deployment:

```yaml
if [ "$V1_CHANGED" = "true" ]; then
npm run version:v1
ssh -o StrictHostKeyChecking=no $SSH_USER@$SSH_HOST 'cd /var/api/test.codebrew.cc && git reset --hard origin/main && cd v1 && npm i && npm run build && pm2 restart test.codebrew.cc/v1 --update-env || pm2 start dist/main.js --name v1'
fi
```

---

Happy coding! ✨
