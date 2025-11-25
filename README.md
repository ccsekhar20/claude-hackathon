# Task Manager Web App

A modern, beautiful task management web application built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- ✨ Modern, responsive UI with gradient backgrounds
- ✅ Add, complete, and delete tasks
- 📊 Task completion tracking
- 🎨 Beautiful design with smooth animations
- ⚡ Fast development with Vite
- 🔒 Type-safe with TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskItem.tsx
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Customization

Feel free to customize the app to your needs:
- Modify colors in `tailwind.config.js`
- Add new features to components
- Extend the Task interface in `App.tsx`
- Add routing, state management, or API integration

## License

MIT

