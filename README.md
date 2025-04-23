# Lesson Management System Frontend

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.13-blue.svg)](https://ant.design/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-purple.svg)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-Latest-yellow.svg)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-6.21-red.svg)](https://reactrouter.com/)

A comprehensive frontend application for educational institutions to manage courses, students, coaches, campuses, and financial operations.

## System Overview

This frontend application provides a complete user interface for educational institutions to manage their operations, including:

- Multi-campus management
- Student enrollment and course tracking
- Coach management with certification tracking
- Course creation and scheduling
- Financial operations including payments and expenses
- Role-based access control
- Comprehensive reporting and analytics

## Key Features

### Dashboard
- Real-time overview of key metrics
- Today's class schedule
- Coach performance statistics
- Financial summaries
- Student attendance tracking

### Campus Management
- Create and manage multiple campuses
- Track campus status (Operating/Closed)
- Manage campus financial metrics
- Assign campus managers and contact information
- Campus comparison analytics

### Student Management
- Student enrollment and profile management
- Course assignment and tracking
- Payment processing and financial record keeping
- Attendance tracking and reporting

### Coach Management
- Comprehensive coach profiles
- Certificate and qualification tracking
- Financial details (salary, commission, performance bonuses)
- Coach availability and status tracking
- Performance metrics

### Course Management
- Course creation and management
- Course type categorization (Private, Group, Online)
- Course status tracking (Draft, Published, Suspended, Terminated)
- Coach assignment to courses
- Course pricing and hours tracking

### Schedule Management
- Visual calendar interface
- Class scheduling and management
- Coach assignment
- Conflict detection and resolution

### Financial Management
- Income and expense tracking
- Financial reporting and analytics
- Transaction history
- Payment processing

### User Management
- Role-based access control
- User status management
- Secure authentication
- Permission management

## Technology Stack

- **React 18**: Core UI library
- **TypeScript 5.3**: Type-safe JavaScript
- **Ant Design 5.13**: UI component library
- **Redux Toolkit 2.0**: State management
- **React Router 6.21**: Routing
- **Vite**: Build tool and development server
- **Axios**: HTTP client
- **ECharts**: Data visualization
- **Day.js**: Date manipulation

## Project Structure

```
lesson_web_front/
├── public/                # Static assets
├── src/
│   ├── api/               # API integration
│   │   ├── auth/          # Authentication API
│   │   ├── campus/        # Campus management API
│   │   ├── coach/         # Coach management API
│   │   ├── course/        # Course management API
│   │   ├── student/       # Student management API
│   │   └── ...
│   ├── assets/            # Static resources
│   │   ├── images/        # Image resources
│   │   ├── styles/        # Global styles
│   │   └── js/            # JavaScript utilities
│   ├── components/        # Reusable components
│   │   ├── Header.tsx     # Application header
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── MainContent.tsx # Main content container
│   │   └── ...
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   │   ├── dashboard/     # Dashboard page
│   │   ├── campus/        # Campus management
│   │   ├── coach/         # Coach management
│   │   ├── course/        # Course management
│   │   ├── student/       # Student management
│   │   ├── schedule/      # Schedule management
│   │   ├── statistics/    # Statistics and reports
│   │   ├── settings/      # System settings
│   │   └── ...
│   ├── redux/             # Redux state management
│   │   ├── slices/        # Redux slices
│   │   └── store.ts       # Redux store configuration
│   ├── router/            # Routing configuration
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Application entry point
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── index.html             # HTML entry point
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js 16+
- npm 8+ or yarn 1.22+

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/lesson_web_front.git

# Navigate to the project directory
cd lesson_web_front

# Install dependencies
npm install
# or
yarn
```

### Development
```bash
# Start the development server
npm run dev
# or
yarn dev
```

### Building for Production
```bash
# Build the application
npm run build
# or
yarn build
```

### Linting
```bash
# Run ESLint
npm run lint
# or
yarn lint
```

## API Integration

The application integrates with the Lesson Management System backend API. The API base URL can be configured in `src/api/config.ts`.

```typescript
// API base URL
export const API_HOST = 'http://lesson.devtesting.top';
```

## Authentication

The application uses JWT-based authentication. Tokens are stored in cookies and local storage for persistence.

## Deployment

The application can be deployed to any static hosting service. A GitHub Actions workflow is included for automated deployment.

```yaml
# .github/workflows/deploy_master.yml
name: deploy_master_web_front

on:
  push:
    branches:
      - master

jobs:
  dev-front-deploy:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Scp dist To HW Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HW_TEST_SERVER }}
          username: ${{ secrets.HW_SERVER_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: ${{ github.workspace }}/dist/*
          target: /root/lesson/lesson_web_front
          strip_components: 3
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
