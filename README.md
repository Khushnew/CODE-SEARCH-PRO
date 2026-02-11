# 🔍 CodeSearch Pro

A premium, production-ready coding interview preparation platform featuring a comprehensive database of 2,913 LeetCode problems with instant search, live code execution, and an Apple-inspired Swiss Minimalism design.

![CodeSearch Pro](https://via.placeholder.com/800x400?text=CodeSearch+Pro+Interface)

## ✨ Key Features

### 🗃️ Complete Problem Database
- **2,913 LeetCode problems** fully indexed and searchable
- Real problem data—no demo or placeholder content
- Searchable by title, topic, difficulty, or problem number
- Intelligent ranking algorithm for relevant results

### ⚡ Instant Search Experience
- **Google-style search** with intelligent autocomplete
- Real-time results as you type
- Fuzzy matching for typo tolerance
- Search history and suggestions

### 💻 Live Code Execution
- **Runnable code editor** supporting 8+ programming languages:
  - Python 3
  - JavaScript/TypeScript
  - Java
  - C++
  - Go
  - Rust
  - C#
  - Ruby
- Execute code directly in the browser
- Instant feedback with test case validation

### 🎨 Premium Design System
- **Swiss Minimalism** aesthetic inspired by Apple
- Monochromatic palette with electric blue accents (`#007AFF`)
- Clean typography with system font stack
- Generous whitespace and grid-based layouts
- Smooth micro-interactions and animations

## 🚀 How to Use

1. **Search Problems**: Type in the search bar to find problems by title, number, or topic
2. **Browse Results**: View ranked results with difficulty badges and topic tags
3. **Select Problem**: Click any problem to view full details
4. **Read Details**: Review description, examples, constraints, and hints
5. **Write Code**: Use the built-in editor to write your solution
6. **Run Code**: Execute your solution against test cases instantly
7. **Iterate**: Refine your approach with immediate feedback

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui with Radix primitives
- **Code Editor**: Monaco Editor (VS Code engine)
- **Code Execution**: WebAssembly / Docker sandbox
- **Search**: Fuse.js for fuzzy search + custom ranking
- **Animations**: Framer Motion
- **State**: Zustand for global state management

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/codesearch-pro.git

# Navigate to project
cd codesearch-pro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database seed (loads all 2,913 problems)
npm run db:seed

# Start development server
npm run dev
