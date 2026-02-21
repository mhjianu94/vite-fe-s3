# Infrastructure

CDK, deployment, and AWS-related conventions. For frontend structure and coding practices, see [PRACTICES.md](PRACTICES.md).

## Package Management (Infrastructure)

- **Infrastructure dependencies** are in `infrastructure/package.json`
- Install: `cd infrastructure && npm install`
- Frontend dependencies are in root `package.json` (see [PRACTICES.md](PRACTICES.md))

## CDK Commands

All CDK commands run from the infrastructure directory (root scripts execute there):

- `npm run cdk:synth` - Synthesizes CloudFormation (from root, runs in infrastructure)
- `npm run cdk:deploy` - Builds frontend first, then deploys infrastructure
- `npm run cdk:diff` - Shows infrastructure changes
- `npm run cdk:destroy` - Destroys the stack

## Deployment Workflow

- Frontend must be built (`npm run build`) before deployment
- The `dist/` folder is deployed to S3
- CloudFront distribution is created with Origin Access Control (OAC)
- GitHub Actions: see [PRACTICES.md](PRACTICES.md) for trigger rules

## Path References

- In `infrastructure/lib/frontend-stack.ts`, the `dist/` folder path is:
  - `path.resolve(process.cwd(), '..', 'dist')` (go up from infrastructure to root)
- CDK runs from `infrastructure/`, so `process.cwd()` is `infrastructure/`

## TypeScript (Infrastructure)

- Infrastructure uses `infrastructure/tsconfig.cdk.json` (CommonJS, Node.js)
- CDK app is executed with `tsx` (handles ESM in package.json with `"type": "module"`)

## Important Files

- `infrastructure/bin/cdk.ts` - CDK app entry point
- `infrastructure/lib/frontend-stack.ts` - Main stack (CloudFront + S3)
- `infrastructure/cdk.json` - CDK configuration (app path, context)
- `infrastructure/tsconfig.cdk.json` - TypeScript config for CDK

## Common Tasks

### Modifying Infrastructure

- Edit files in `infrastructure/lib/`
- Test: `npm run cdk:synth` (from root)
- Deploy: `npm run cdk:deploy` (from root)

### Deployment

- Regular commit: `git commit -m "Update feature"` - No deployment
- Deploy commit: `git commit -m "[deploy] Update feature"` - Triggers deployment
- Manual: Use GitHub Actions "Run workflow" button

## Stack Outputs

After deployment:

- `DistributionDomainName` - CloudFront URL (e.g. `d1234.cloudfront.net`)
- `DistributionId` - CloudFront distribution ID
- `BucketName` - S3 bucket name

Access the deployed site at: `https://<DistributionDomainName>`

## Notes

- Both package.json files use `"type": "module"` (ESM)
- CDK is run with `tsx` to execute TypeScript
- CloudFront uses Origin Access Control (OAC), not Origin Access Identity (OAI)
- S3 bucket is private; only CloudFront can access it
- Stack name: `FrontendStack`
- Default region: `us-east-1` (override with `CDK_DEFAULT_REGION`)

## Troubleshooting

### CDK commands fail

- Install infra deps: `cd infrastructure && npm install`
- Ensure `cdk.json` exists in `infrastructure/`

### Deployment fails - dist folder not found

- Build frontend first: `npm run build`
- Confirm `dist/` exists in project root

### TypeScript errors in infrastructure

- Check `infrastructure/tsconfig.cdk.json` and included paths
- Confirm `infrastructure/package.json` has required dependencies

### GitHub Actions fails

- Ensure both root and infrastructure dependencies are installed in the workflow
- Verify AWS credentials in GitHub Secrets
- For automatic runs, commit message must contain `[deploy]`
