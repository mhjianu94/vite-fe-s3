# GitHub Actions Workflows

## Deployment Workflows

This repository includes two deployment workflows:

### 1. Automatic Deployment (`deploy.yml`)

The `deploy.yml` workflow automatically builds and deploys your application to AWS S3 + CloudFront when you push to the `main` or `master` branch. It can also be triggered manually.

### 2. Manual Deployment (`deploy-manual.yml`)

The `deploy-manual.yml` workflow is **manual-only** and provides additional options:
- **Environment selection**: Choose between `production` or `staging`
- **Skip build option**: Optionally skip the build step if you want to deploy an existing `dist` folder
- **Deployment summary**: Provides a detailed summary in the GitHub Actions UI

To use the manual workflow:
1. Go to **Actions** tab in GitHub
2. Select **"Deploy to AWS (Manual)"** from the workflow list
3. Click **"Run workflow"**
4. Choose your options and click **"Run workflow"**

### Setup Instructions

#### Using Access Keys (Current Configuration)

1. **Create IAM User:**
   - Go to AWS IAM Console → Users → Create user
   - Create an IAM user with programmatic access
   - Attach policies: `AdministratorAccess` (or more restrictive policies for CDK, S3, CloudFront, IAM)
   - Save the Access Key ID and Secret Access Key (you'll only see the secret once!)

2. **Configure GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `AWS_ACCESS_KEY_ID`: Your AWS access key ID
     - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
     - `AWS_ACCOUNT_ID`: Your AWS account ID
     - `AWS_REGION`: Your AWS region (e.g., `us-east-1`)

#### Alternative: Using OIDC (More Secure)

If you prefer to use OIDC instead of access keys:

1. **Create an IAM Role for GitHub Actions:**
   - Go to AWS IAM Console
   - Create a new role with trust policy allowing GitHub to assume it (see trust policy below)
   - Attach policies: `AdministratorAccess` (or more restrictive policies for CDK, S3, CloudFront, IAM)
   - Note the Role ARN

2. **Update the workflow file:**
   - In `.github/workflows/deploy.yml`, change the "Configure AWS credentials" step to:
     ```yaml
     - name: Configure AWS credentials
       uses: aws-actions/configure-aws-credentials@v4
       with:
         role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
         aws-region: ${{ secrets.AWS_REGION }}
     ```
   - Add `id-token: write` to the permissions section

3. **Configure GitHub Secrets:**
   - Add secrets:
     - `AWS_ROLE_ARN`: The ARN of the IAM role created above
     - `AWS_ACCOUNT_ID`: Your AWS account ID
     - `AWS_REGION`: Your AWS region

### IAM Role Trust Policy (for OIDC)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME:*"
        }
      }
    }
  ]
}
```

### Required GitHub Secrets

**For Access Keys (Current Setup):**
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_ACCOUNT_ID`: Your AWS account ID
- `AWS_REGION`: Your AWS region (e.g., `us-east-1`)

**For OIDC (Alternative):**
- `AWS_ROLE_ARN`: The ARN of the IAM role
- `AWS_ACCOUNT_ID`: Your AWS account ID
- `AWS_REGION`: Your AWS region

### Workflow Triggers

**`deploy.yml`:**
- **Automatic**: Pushes to `main` or `master` branch
- **Manual**: Can be triggered from the Actions tab in GitHub

**`deploy-manual.yml`:**
- **Manual only**: Must be triggered from the Actions tab
- **Options available**: Environment selection and skip build option

### What the Workflow Does

1. Checks out your code
2. Sets up Node.js
3. Installs dependencies
4. Builds your Vite application
5. Configures AWS credentials
6. Bootstraps CDK (if needed)
7. Synthesizes CDK template
8. Deploys to AWS
9. Outputs the CloudFront distribution URL

