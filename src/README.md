# EventWork - Freelance Event Professional Platform

A modern platform connecting event professionals with clients, built with React, TypeScript, and Supabase.

## 🚀 Features

- **Authentication & Authorization**
  - Email/password authentication
  - Role-based access (Client/Vendor)
  - Secure session management

- **Job Marketplace**
  - Post and browse event-related jobs
  - Advanced search and filtering
  - Proposal submission system

- **Real-time Messaging**
  - Direct messaging between clients and vendors
  - Real-time notifications
  - Message history

- **Payment System**
  - Secure payment processing
  - Transaction history
  - Payment status tracking

- **User Profiles**
  - Professional profiles
  - Portfolio showcase
  - Skills and experience listing

## 🛠️ Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - React Router
  - Lucide Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security

## 🏗️ Project Structure

```
src/
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard views
│   ├── jobs/          # Job-related components
│   ├── layout/        # Layout components
│   ├── messaging/     # Messaging components
│   ├── profile/       # Profile components
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── lib/               # Utility functions and hooks
│   ├── api/          # API functions
│   ├── hooks/        # Custom React hooks
│   └── validation/   # Form validation schemas
└── types/            # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git

### Setup Instructions

1. **Fork the Repository**
   - Visit the repository on GitHub
   - Click the "Fork" button in the top right
   - Clone your forked repository:
     ```bash
     git clone https://github.com/your-username/event-work.git
     cd event-work
     ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🤝 Contributing

1. **Create a Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Changes**
   - Write your code
   - Follow the existing code style
   - Add comments where necessary

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

4. **Push to GitHub**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Describe your changes
   - Submit the pull request

## 📝 Git Best Practices

1. **Commit Messages**
   - Use present tense ("Add feature" not "Added feature")
   - Be descriptive but concise
   - Reference issues when relevant

2. **Branching**
   - `main` - production-ready code
   - `develop` - development branch
   - `feature/*` - new features
   - `fix/*` - bug fixes
   - `release/*` - release preparation

3. **Pull Requests**
   - Keep changes focused and atomic
   - Include tests if applicable
   - Update documentation
   - Add screenshots for UI changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
