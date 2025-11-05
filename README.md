# SystemStudio

<div align="center">

![SystemStudio](public/systemstudio.png)

**A collaborative platform for practicing and mastering system design**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

</div>

## 🎯 Overview

SystemStudio is an open-source platform designed to help developers practice and master system design skills. Whether you're preparing for technical interviews, building distributed systems, or simply want to learn from the community, SystemStudio provides a comprehensive environment to create, share, and discuss system design solutions.

### Key Features

- **📚 Challenge Library**: Browse and solve system design challenges across different difficulty levels (Easy, Medium, Hard)
- **✏️ Interactive Solution Editor**: Create solutions with:
  - Rich text editor powered by Tiptap for detailed explanations
  - Integrated Excalidraw canvas for system architecture diagrams
  - Auto-save functionality to never lose your work
- **💬 Community Engagement**:
  - Comment on solutions to ask questions and provide feedback
  - Vote on challenges, solutions, and comments
  - View community activity and recent submissions
- **🏆 Leaderboard**: Track your progress and compete with other designers
  - Points system: 10 points per solution, 3 points per comment, 1 point per upvote received
- **📊 User Statistics**: Track your solutions, comments, and voting activity

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Diagramming**: [Excalidraw](https://excalidraw.com/)
- **Rich Text**: [Tiptap](https://tiptap.dev/)
- **Animations**: [Anime.js](https://animejs.com/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) latest
- [PostgreSQL](https://www.postgresql.org/download/) 14+ (or use a cloud provider like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/))
- [Git](https://git-scm.com/)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/olucasandrade/systemstudio.git
cd systemstudio
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

Using bun:
```bash
bun install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/systemstudio?schema=public"

# Clerk Authentication (get these from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/challenges
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/challenges

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Documentation URL (for help links)
NEXT_PUBLIC_DOCS_URL=https://docs.systemstudio.com
NEXT_PUBLIC_WEB_URL=https://systemstudio.com
```

### 4. Set up the database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
# or
bunx prisma generate
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
systemstudio/
├── app/                          # Next.js app directory
│   ├── (authenticated)/          # Authenticated routes
│   │   ├── challenges/          # Challenge pages
│   │   ├── community/           # Community page
│   │   ├── leaderboard/         # Leaderboard page
│   │   ├── search/              # Search page
│   │   ├── components/          # Reusable components
│   │   └── hooks/               # React hooks
│   ├── (unauthenticated)/       # Public routes
│   │   └── sign-in/             # Sign-in page
│   ├── api/                     # API routes
│   ├── auth/                    # Authentication setup
│   ├── database/                # Database utilities
│   ├── design-system/            # UI components and theme
│   └── seo/                     # SEO utilities
├── prisma/                      # Prisma schema and migrations
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
└── generated/                   # Generated Prisma client
```

## 🗄️ Database Schema

The application uses the following main models:

- **Challenge**: System design challenges with title, description, difficulty, and tags
- **Solution**: User solutions to challenges with descriptions and diagram data
- **Comment**: Comments on solutions
- **Vote**: Upvotes/downvotes on challenges, solutions, and comments
- **UserStats**: User statistics including score, solution count, and voting activity

See `prisma/schema.prisma` for the complete schema definition.

## 🤝 Contributing

We welcome contributions from the community! Whether it's bug fixes, new features, documentation improvements, or design enhancements, your help makes SystemStudio better for everyone.

### How to Contribute

1. **Fork the repository** and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**:
   - Follow the existing code style and conventions
   - Write clear commit messages
   - Add comments for complex logic
   - Ensure your code is properly formatted
   - Implement unit or integration tests for everything (I know I'm not the best example, but I intend to ensure that every feature is covered as soon as possible)

3. **Test your changes**:
   - Test locally to ensure everything works
   - Check for linting errors: `npm run lint`
   - Verify the build succeeds: `npm run build`

4. **Submit a Pull Request**:
   - Provide a clear description of your changes
   - Reference any related issues
   - Include screenshots for UI changes if applicable

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript/React patterns
- **Commits**: Use clear, descriptive commit messages
- **PRs**: Keep pull requests focused and reasonably sized
- **Issues**: Check existing issues before creating new ones
- **Documentation**: Update documentation for new features

### Areas for Contribution

- 🐛 **Bug Fixes**: Help us squash bugs
- ✨ **New Features**: Propose and implement new functionality
- 📝 **Documentation**: Improve guides, comments, and README
- 🎨 **UI/UX**: Enhance the user interface and experience
- 🧪 **Testing**: Add tests to improve code quality
- 🌐 **Internationalization**: Add support for more languages
- 🔧 **Performance**: Optimize queries, caching, and rendering

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices (hooks, functional components)
- Use meaningful variable and function names
- Keep components small and focused
- Extract reusable logic into custom hooks

### Database

- Use Prisma migrations for schema changes
- Always provide migration files with schema changes
- Test migrations on a local database

### API Routes

- Use Next.js App Router API routes
- Implement proper error handling
- Return consistent response formats
- Add appropriate HTTP status codes

### UI Components

- Use shadcn/ui components from `app/design-system/components/ui`
- Follow the existing design system patterns
- Ensure responsive design for mobile devices
- Support both light and dark themes

## 🐛 Reporting Bugs

If you find a bug, please open an issue with:

- **Clear description** of the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, Node version, browser)

## 💡 Feature Requests

Have an idea for a new feature? We'd love to hear it! Open an issue with:

- **Feature description** and use case
- **Proposed implementation** (if you have ideas)
- **Benefits** to the community

## 📚 Documentation

- **API Documentation**: See `/app/api` for available endpoints
- **Component Documentation**: Check component files in `app/design-system/components`
- **Database Schema**: See `prisma/schema.prisma`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Clerk](https://clerk.com/) for authentication
- [Prisma](https://www.prisma.io/) for database management
- [Excalidraw](https://excalidraw.com/) for diagramming
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [NextForge](https://www.next-forge.com/) for the template that inspired me
- All contributors and users of SystemStudio

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/olucasandrade/systemstudio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/olucasandrade/systemstudio/discussions)

## 🌟 Star History

If you find SystemStudio helpful, please consider giving it a star ⭐ on GitHub!

---

<div align="center">

Made with ❤️ by [olucasandrade](olucasandrade.com)

[Contributors](https://github.com/olucasandrade/systemstudio/graphs/contributors)

</div>
