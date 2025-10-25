# MoodMeter

A sophisticated mood tracking application built with React Router, TypeScript, and modern UI components.

## Features

- AI-powered mood analysis using Google Gemini
- Interactive charts and data visualizations
- Modern, responsive design with dark/light theme support
- Secure authentication system
- Built with React Router v7 for optimal performance
- Asset bundling and optimization
- Efficient data loading and mutations
- TypeScript for type safety
- TailwindCSS for styling
- [React Router documentation](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js (version 18.12 or higher)
- pnpm package manager

### Installing pnpm

pnpm is a fast, disk-efficient package manager. Choose one of the following installation methods:

**Using npm (if you already have Node.js):**

```bash
npm install -g pnpm
```

**Using standalone script (Windows):**

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

**Using Corepack (Node.js 16.13+):**

```bash
# Enable Corepack
corepack enable pnpm

# Optional: Pin a specific version
corepack use pnpm@latest
```

**Other installation methods:**

- **Homebrew (macOS):** `brew install pnpm`
- **Winget (Windows):** `winget install -e --id pnpm.pnpm`
- **Chocolatey (Windows):** `choco install pnpm`

For more installation options, visit the [pnpm installation guide](https://pnpm.io/installation).

### Installation

Install the project dependencies:

```bash
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
VITE_JWT_SECRET=e51f3c1f9ace48c218d2633ff70377a5a18b793799dae1cfa1499b0829f7dbd0
VITE_GOOGLE_API_KEY=your_google_gemini_api_key_here
```

**Important:** Replace the JWT secret with your own randomly generated 32-byte string for security.

### Development

Start the development server with hot module replacement:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm build
```

## Deployment

### Docker Deployment

Build and run the application using Docker:

```bash
# Build the Docker image
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to platforms that support Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Manual Deployment

For manual deployment of Node.js applications, the built-in server is production-ready.

Deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

The project is configured with [Tailwind CSS](https://tailwindcss.com/) for styling. Alternative CSS frameworks can be used as preferred.

---

Built with React Router.
