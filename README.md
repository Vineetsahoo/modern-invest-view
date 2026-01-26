# Investment Portfolio Manager

A comprehensive stock portfolio management platform for tracking investments, analyzing performance, and managing your financial portfolio.

## Features

-  **Dashboard**: Real-time investment portfolio overview with detailed statistics
-  **Analytics**: Comprehensive charts and performance metrics
-  **Multi-Asset Support**: Manage stocks, mutual funds, REITs, NPS, FD/RD, SGB, and Demat accounts
-  **Secure Authentication**: Session-based authentication system
-  **Responsive Design**: Modern, mobile-friendly interface
-  **Beautiful UI**: Built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn or bun

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd modern-invest-view

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```sh
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── profile/        # Profile-related components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API services
└── utils/              # Helper utilities
```

## Configuration

No additional configuration required for local development.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## License

MIT License

## Support

For support, please open an issue in the GitHub repository.
