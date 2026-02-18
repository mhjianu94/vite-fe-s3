# AI Assistant Instructions

This file contains important information about this project structure and conventions for AI assistants working on this codebase.

## ⚠️ Important: Keep This File Updated

**When making changes to the project structure, conventions, or workflows, you MUST update this instructions file accordingly.** This ensures future AI assistants have accurate information about the project.

Examples of changes that require updates:
- Adding or removing directories
- Changing package.json structure or scripts
- Modifying deployment workflows
- Updating path references or conventions
- Adding new dependencies or tools
- Changing CDK configuration or stack structure

**Always review and update the relevant sections of this file after making project changes.**

## Project Structure

This is a Vite + React frontend application deployed to AWS S3 + CloudFront using AWS CDK.

### Directory Layout

```
vite-fe-s3/
├── infrastructure/          # CDK infrastructure code (separate package.json)
│   ├── bin/
│   │   └── cdk.ts          # CDK app entry point
│   ├── lib/
│   │   └── frontend-stack.ts  # CloudFront + S3 stack definition
│   ├── package.json        # Infrastructure dependencies only
│   ├── cdk.json           # CDK configuration
│   └── tsconfig.cdk.json  # TypeScript config for CDK
├── src/                    # React application source code
├── dist/                   # Built frontend (generated, not committed)
├── package.json            # Frontend dependencies only
└── .github/workflows/      # GitHub Actions CI/CD
```

## Key Conventions

### 1. Separate Package Management
- **Frontend dependencies** are in root `package.json`
- **Infrastructure dependencies** are in `infrastructure/package.json`
- Always install dependencies in the correct location:
  - Frontend: `npm install` (root)
  - Infrastructure: `cd infrastructure && npm install`

### 2. CDK Commands
All CDK commands run from the infrastructure directory:
- `npm run cdk:synth` - Synthesizes CloudFormation (runs from root, executes in infrastructure)
- `npm run cdk:deploy` - Builds frontend first, then deploys infrastructure
- `npm run cdk:diff` - Shows infrastructure changes
- `npm run cdk:destroy` - Destroys the stack

### 3. Deployment Workflow
- Frontend must be built (`npm run build`) before deployment
- The `dist/` folder is deployed to S3
- CloudFront distribution is created with Origin Access Control (OAC)
- GitHub Actions workflow only triggers on commits with `[deploy]` in the message

### 4. Path References
- When working in `infrastructure/lib/frontend-stack.ts`, the `dist/` folder path is:
  - `path.resolve(process.cwd(), '..', 'dist')` (goes up from infrastructure to root)
- CDK runs from `infrastructure/` directory, so `process.cwd()` is `infrastructure/`

### 5. TypeScript Configuration
- Frontend uses `tsconfig.json` (ES modules, React)
- Infrastructure uses `infrastructure/tsconfig.cdk.json` (CommonJS, Node.js)
- CDK code is executed with `tsx` (handles ESM in package.json with `"type": "module"`)

## Important Files

### Infrastructure
- `infrastructure/bin/cdk.ts` - CDK app initialization
- `infrastructure/lib/frontend-stack.ts` - Main stack with S3 + CloudFront
- `infrastructure/cdk.json` - CDK configuration (app path, context)
- `infrastructure/tsconfig.cdk.json` - TypeScript config for CDK

### Frontend
- `src/` - React application source
- `vite.config.ts` - Vite configuration
- `package.json` - Frontend dependencies and scripts

### CI/CD
- `.github/workflows/deploy.yml` - GitHub Actions deployment workflow
  - Only triggers on `[deploy]` in commit message or manual dispatch
  - Installs both frontend and infrastructure dependencies
  - Builds frontend, then deploys infrastructure

## Common Tasks

### Adding a New Dependency
- **Frontend dependency**: Add to root `package.json`, run `npm install`
- **Infrastructure dependency**: Add to `infrastructure/package.json`, run `cd infrastructure && npm install`

### Modifying Infrastructure
- Edit files in `infrastructure/lib/`
- Test with `npm run cdk:synth` (from root)
- Deploy with `npm run cdk:deploy` (from root)

### Modifying Frontend
- Edit files in `src/`
- Test with `npm run dev`
- Build with `npm run build`

### Deployment
- Regular commit: `git commit -m "Update feature"` - No deployment
- Deploy commit: `git commit -m "[deploy] Update feature"` - Triggers deployment
- Manual: Use GitHub Actions "Run workflow" button

## Stack Outputs

After deployment, the stack outputs:
- `DistributionDomainName` - CloudFront URL (e.g., `d1234.cloudfront.net`)
- `DistributionId` - CloudFront distribution ID
- `BucketName` - S3 bucket name

Access the deployed site at: `https://<DistributionDomainName>`

## Notes

- The project uses `"type": "module"` in both package.json files (ESM)
- CDK uses `tsx` to execute TypeScript (handles ESM properly)
- CloudFront uses Origin Access Control (OAC), not the deprecated Origin Access Identity (OAI)
- S3 bucket is private, only accessible via CloudFront
- Stack name is `FrontendStack`
- Default region is `us-east-1` (can be overridden with `CDK_DEFAULT_REGION`)

## Troubleshooting

### CDK commands fail
- Ensure infrastructure dependencies are installed: `cd infrastructure && npm install`
- Check that `cdk.json` exists in `infrastructure/` directory

### Deployment fails - dist folder not found
- Build frontend first: `npm run build`
- Verify `dist/` folder exists in root directory

### TypeScript errors in infrastructure
- Check `infrastructure/tsconfig.cdk.json` includes correct paths
- Verify `infrastructure/package.json` has all required dependencies

### GitHub Actions fails
- Check that both `package.json` files have dependencies installed
- Verify AWS credentials are set in GitHub Secrets
- Ensure commit message contains `[deploy]` for automatic deployment

