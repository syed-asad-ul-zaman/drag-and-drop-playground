# Drag-and-Drop Playground

A modern web application for creating interactive UIs with draggable text, image, and shape elements. Built for designers and developers to prototype interfaces.

## Features
- **Element Types**: 
  - Text (customizable font, size, bold/italic/underline)
  - Images (dynamic URL loading)
  - Shapes (SVG paths with color/stroke controls)
- **Properties Panel**: Real-time editing of element dimensions/styles
- **Drag-and-Drop**: Intuitive element positioning
- **State Persistence**: Auto-save/load functionality
- **Responsive Design**: Works on desktop and tablets

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `jquery` | ^3.7.0 | DOM manipulation and event handling |
| `jquery-ui` | ^1.13.2 | Drag-and-drop interactions |
| `vite` | ^6.2.0 | Modern build tooling |
| `tailwindcss` | ^4.0.9 | Utility-first CSS styling |

**Why These Dependencies?**
- `jquery`: Simplifies cross-browser DOM operations
- `jquery-ui`: Provides production-ready drag-and-drop widgets
- `vite`: Enables fast development with HMR and optimized builds
- `tailwindcss`: Accelerates styling without writing custom CSS

## Setup Instructions

### Prerequisites
- Node.js v18+
- PNPM v9+

### Installation
```bash
# Clone repository
git clone https://github.com/syed-asad-ul-zaman/drag-and-drop-playground.git
cd drag-and-drop-playground

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```bash
├── public/          # Static assets
├── src/
│   ├── main.js      # Core application logic
│   └── style.css    # Tailwind directives
├── index.html       # Entry point
├── vite.config.js   # Build configuration
└── tailwind.config.js # Tailwind settings
```
