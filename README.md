# React + Vite Starter Template

A modern React application built with Vite, TypeScript, and configured for deployment on AWS Amplify Hosting.

## Overview

This template provides a clean, production-ready React application setup with Vite for fast development and optimized builds. It's ideal for developers looking to quickly start a new frontend project.

## Features

- **React 18** - Latest React with modern hooks and features
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe development
- **ESLint** - Code quality and consistency
- **AWS Amplify Hosting Ready** - Pre-configured for deployment

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

This project is configured for AWS Amplify Hosting. The build process:

1. Installs dependencies
2. Builds the React app using Vite
3. Deploys the `dist/` directory to Amplify Hosting

Push to your connected Git repository and Amplify will automatically build and deploy.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
