# React + Vite Starter Template

A modern React application built with Vite, TypeScript, and configured for deployment on AWS S3 + CloudFront using CDK.

## Overview

This template provides a clean, production-ready React application setup with Vite for fast development and optimized builds. It's ideal for developers looking to quickly start a new frontend project with AWS infrastructure as code.

## Features

- **React 18** - Latest React with modern hooks and features
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe development
- **ESLint** - Code quality and consistency
- **AWS CDK** - Infrastructure as code for S3 + CloudFront deployment

## Getting Started

### Prerequisites

- Node.js >= 20.20.0
- npm >= 10.8.0

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run cdk:deploy` - Build and deploy to AWS S3 + CloudFront
- `npm run cdk:synth` - Synthesize CloudFormation template
- `npm run cdk:diff` - Compare deployed stack with current state
- `npm run cdk:destroy` - Destroy the AWS stack

## Project Structure

```
.
├── src/              # Source files
│   ├── App.tsx      # Main App component
│   ├── main.tsx     # Application entry point
│   └── ...
├── public/          # Static assets
├── index.html       # HTML template
├── vite.config.ts   # Vite configuration
└── tsconfig.json    # TypeScript configuration
```

## Deployment

This project is configured for AWS S3 + CloudFront deployment using AWS CDK. The deployment process:

### Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js >= 20.0.0
- npm >= 10.0.0

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Bootstrap CDK** (first time only, per AWS account/region):
   ```bash
   npx cdk bootstrap
   ```

### Deploy

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to AWS:**
   ```bash
   npm run cdk:deploy
   ```

The CDK stack will:
- Create an S3 bucket for hosting static files
- Create a CloudFront distribution with Origin Access Control (OAC)
- Deploy the `dist/` directory to S3
- Configure SPA routing (404/403 → index.html)
- Output the CloudFront distribution domain name

After deployment, you'll see the CloudFront distribution URL in the outputs, which you can use to access your application.

### GitHub Actions Deployment (CI/CD)

This project includes a GitHub Actions workflow for automated deployment. The workflow automatically builds and deploys your application when you push to the `main` or `master` branch.

**Setup:**

1. **Configure GitHub Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the required secrets (see `.github/workflows/README.md` for detailed instructions)

2. **Push to main/master:**
   - The workflow will automatically trigger on push
   - Or manually trigger from the Actions tab

**Required Secrets:**
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `AWS_ACCOUNT_ID`: Your AWS account ID
- `AWS_REGION`: Your AWS region (e.g., `us-east-1`)

For detailed setup instructions, see [`.github/workflows/README.md`](.github/workflows/README.md).

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
