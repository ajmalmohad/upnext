# WIP Tracker - Refactored Architecture

A modern, well-structured WIP (Work In Progress) tracking application built with React, TypeScript, and Radix UI.

## 🏗️ Architecture Overview

The application has been completely refactored to separate concerns and improve maintainability:

### 📁 Project Structure

```
src/
├── hooks/
│   └── useWipTracker.ts          # Core business logic and state management
├── utils/
│   └── formatters.ts             # Utility functions for formatting and styling
├── components/
│   ├── ui/                       # Reusable UI components built with Radix UI
│   │   ├── Modal.tsx
│   │   ├── Tabs.tsx
│   │   ├── CollapsibleSection.tsx
│   │   └── animations.css
│   ├── CommandBar.tsx            # Command input modal
│   ├── UpdateModal.tsx           # Update progress modal
│   ├── WipCard.tsx              # Individual WIP item component
│   └── Sidebar.tsx              # Focus sidebar component
├── App.tsx                      # Main application component
└── index.ts                     # Barrel exports
```

## 🚀 Key Improvements

### 1. **Separation of Concerns**
- **Hooks**: Business logic isolated in `useWipTracker` hook
- **Utils**: Pure utility functions for formatting and styling
- **UI Components**: Reusable, composable components
- **Feature Components**: Domain-specific components

### 2. **Modern UI with Radix UI**
- **Accessible**: Built-in accessibility features
- **Composable**: Headless components that can be styled
- **Performant**: Optimized for performance
- **TypeScript**: Full TypeScript support

### 3. **Better Developer Experience**
- **Type Safety**: Full TypeScript coverage
- **Barrel Exports**: Clean import/export structure
- **Consistent Styling**: Unified dark mode support
- **Animation Support**: Smooth transitions and animations

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Headless UI components
- **Vite** - Build tool
- **Lucide React** - Icons

## 🧩 Core Components

### `useWipTracker` Hook
Central state management for all WIP-related operations:
- WIP CRUD operations
- State derived calculations
- Timeline management
- Command parsing

### UI Components (Radix-based)
- **Modal**: Accessible dialog component
- **Tabs**: Tab navigation with proper ARIA support
- **CollapsibleSection**: Expandable content areas

### Feature Components
- **CommandBar**: Quick WIP creation with command syntax
- **UpdateModal**: Progress update interface
- **WipCard**: Rich WIP display with inline actions
- **Sidebar**: Focus area with priority and stale WIP alerts

## 🎯 Features

- **Command Syntax**: Quick WIP creation with `#tags`, `~2h` estimates, `w8` weights
- **Keyboard Shortcuts**: ⌘K to open command bar, Escape to close modals
- **Dark Mode**: Full dark mode support throughout
- **Responsive**: Mobile-friendly design
- **Focus Mode**: Sidebar showing high-priority and stale WIPs
- **Timeline**: Track progress updates with timestamps

## 🏃‍♂️ Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🎨 Customization

The new architecture makes customization easier:

1. **Styling**: Modify Tailwind classes or add CSS variables
2. **Logic**: Extend the `useWipTracker` hook
3. **UI**: Compose new components using Radix primitives
4. **Features**: Add new feature components following the established patterns

## 📋 Command Syntax

- `Fix login bug #frontend ~2h w8` - Create WIP with tag, estimate, and weight
- `#backend` - Add backend tag
- `~3h` - Set 3-hour estimate
- `w7` - Set weight/priority to 7 (1-10 scale)

## 🎪 Demo Features

Try these features in the application:
- Press ⌘K to open the command bar
- Use the command syntax to create WIPs quickly
- Toggle the sidebar to see focus mode
- Expand WIP timeline sections
- Update WIP progress and status

The refactored architecture provides a solid foundation for future enhancements while maintaining excellent developer experience and user interface quality.
