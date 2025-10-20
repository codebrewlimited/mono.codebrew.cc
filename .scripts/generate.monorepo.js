// generate-monorepo.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = path.join(__dirname, "../");
const projects = ["v1", "v2"];

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), {
    recursive: true,
  });
  fs.writeFileSync(filePath, content, "utf8");
}

console.log("Creating monorepo structure...");

writeFile(
  path.join(repoRoot, ".gitignore"),
  `
node_modules/
.vscode/
*.log
`
);

writeFile(
  path.join(repoRoot, "package.json"),
  JSON.stringify(
    {
      name: "mono.codebrew.cc",
      private: true,
      workspaces: ["v1", "v2"],
    },
    null,
    2
  )
);

projects.forEach((proj) => {
  const projRoot = path.join(repoRoot, proj);

  console.log(`Setting up project ${proj}...`);

  writeFile(
    path.join(projRoot, "package.json"),
    JSON.stringify(
      {
        name: proj,
        version: "1.0.0",
        private: true,
        scripts: {
          release: "standard-version --no-verify",
          "release:push":
            "npm run release && git push --follow-tags origin $(git rev-parse --abbrev-ref HEAD)",
        },
        devDependencies: {
          husky: "^10.0.0",
          "standard-version": "^10.0.0",
          "@commitlint/cli": "^17.0.0",
          "@commitlint/config-conventional": "^17.0.0",
        },
      },
      null,
      2
    )
  );

  writeFile(
    path.join(projRoot, "CHANGELOG.md"),
    "# Changelog\n\nAll notable changes to this project will be documented in this file."
  );

  writeFile(
    path.join(projRoot, "commitlint.config.cjs"),
    `
module.exports = {
  extends: ['@commitlint/config-conventional']
};
`
  );

  const huskyDir = path.join(projRoot, ".husky");
  fs.mkdirSync(huskyDir, {
    recursive: true,
  });
  writeFile(
    path.join(huskyDir, "pre-push"),
    `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Validating commit messages..."
npx commitlint --from=HEAD~1
`
  );
});

// Initialize husky in each project
// Initialize husky in each project
projects.forEach((proj) => {
  const projRoot = path.join(repoRoot, proj);
  execSync("npx husky install", {
    cwd: projRoot,
    stdio: "inherit",
  });

  // Create pre-push hook manually for Husky v10+
  const prePushPath = path.join(projRoot, ".husky", "pre-push");
  writeFile(
    prePushPath,
    `#!/usr/bin/env sh

echo "🔍 Validating commit messages..."
npx commitlint --from=HEAD~1
`
  );
  fs.chmodSync(prePushPath, 0o755);
});

console.log(
  'Monorepo generation complete. You can now zip the "my-monorepo" folder.'
);
