# Release Plan — Primea (Alpha Scaffold)

This PR only adds publish scaffolding. No product code changes.

## Now
- Normalize `publishConfig` in every `package.json`.
  - Public packages:
    "publishConfig": {
      "access": "public",
      "registry": "https://registry.npmjs.org/",
      "tag": "primea-alpha"
    }
  - Private packages:
    "publishConfig": { "tag": "private-skip" }

## Later
- Keep names unchanged now; later publish under `@primea/*` from a dedicated `release/*` branch.
- Workspace-aware publish (pnpm/yarn) with `--tag primea-alpha`.

## Guardrails
- Private packages tagged `private-skip` to avoid accidental publish.
- Publish only from protected release branches.
