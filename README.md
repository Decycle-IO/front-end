# Decycle Homepage

## Prerequisites

- Node.js (v20 or higher recommended)
- npm

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

This will start the development server at [http://localhost:5173](http://localhost:5173).

## Building for Production

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

Changes pushed to the main branch are automatically deployed to the [decycle.io](https://decycle.io) website.

## Project Structure

```
homepage/
├── public/            # Static assets
├── src/
│   ├── assets/        # Project assets
│   ├── components/    # React components
│   │   ├── home/      # Home page specific components
│   │   ├── layout/    # Layout components
│   │   └── ui/        # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── services/      # Service integrations
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Application entry point
├── index.html         # HTML template
├── package.json       # Project dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Available Scripts

- `dev`: Start the development server
- `build`: Build the project for production
- `lint`: Run ESLint to check for code issues
- `preview`: Preview the production build locally
