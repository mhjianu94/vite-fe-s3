# AI Assistant Instructions

This file is the entry point for project structure and conventions. Content is split into:

- **[INFRASTRUCTURE.md](INFRASTRUCTURE.md)** – CDK, deployment, stack outputs, infra troubleshooting
- **[PRACTICES.md](PRACTICES.md)** – Frontend structure, coding rules, folder layout, auth, CI/CD trigger

## Keep This File and Related Docs Updated

When you change the project structure, conventions, or workflows, update the relevant instructions:

- **This file (INSTRUCTIONS.md)** – Overview and directory layout below
- **[INFRASTRUCTURE.md](INFRASTRUCTURE.md)** – Infra paths, CDK, deployment, stack outputs, infra troubleshooting
- **[PRACTICES.md](PRACTICES.md)** – Frontend rules, folder layout, important frontend files, auth

Examples of changes that require updates:

- Adding or removing directories
- Changing package.json structure or scripts
- Modifying deployment workflows
- Updating path references or conventions
- Adding new dependencies or tools
- Changing CDK configuration or stack structure

**When making changes, also keep the README in sync:**

- Update the **Directory Layout** in this file (see below) to reflect new or removed folders.
- Update the **Project Structure** section in [README.md](../../README.md) (the tree) so it matches the real layout.
- Keep README.md updated in general (scripts, deployment steps, features).

## Project Structure

Vite + React frontend, deployed to AWS S3 + CloudFront via CDK.

### Directory Layout

```
vite-fe-s3/
├── infrastructure/          # CDK infrastructure code (separate package.json)
│   ├── bin/
│   │   └── cdk.ts          # CDK app entry point
│   ├── lib/
│   │   └── frontend-stack.ts  # CloudFront + S3 stack definition
│   ├── package.json        # Infrastructure dependencies only
│   ├── cdk.json            # CDK configuration
│   └── tsconfig.cdk.json   # TypeScript config for CDK
├── src/                    # React application source code
├── dist/                   # Built frontend (generated, not committed)
├── package.json            # Frontend dependencies only
└── .github/workflows/      # GitHub Actions CI/CD
```

For infra details see [INFRASTRUCTURE.md](INFRASTRUCTURE.md). For frontend layout and practices see [PRACTICES.md](PRACTICES.md).
