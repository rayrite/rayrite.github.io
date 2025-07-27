
# ✨ Feature Overview

The Advanced Markdown Viewer includes a comprehensive set of features designed for modern documentation and content management.

## 🎯 Core Features

### 📂 File Management

- **Auto-discovery**: Scans `items/` folder using manifest file
- **Alphabetical sorting**: Files displayed in order
- **Multiple formats**: Support for `.md`, `.html`, `.htm` files
- **Manual upload**: Drag-and-drop or file input for local files

### 🔄 Viewing Modes

#### Replace Mode
- Single document view
- Click file to replace current content
- Ideal for focused reading
- Clean, distraction-free interface

#### Tab Mode
- Multi-document browsing
- Browser-style tabs with close buttons
- Switch between open documents
- Perfect for research and comparison

## 🎨 Visual Features

### 🌙 Theme System

The viewer includes comprehensive theming:

| Feature | Light Theme | Dark Theme |
|---------|-------------|------------|
| Background | `#f5f5f5` | `#0d1117` |
| Text | `#333333` | `#c9d1d9` |
| Sidebar | `#ffffff` | `#161b22` |
| Code blocks | `#f6f8fa` | `#161b22` |
| Links | `#0366d6` | `#58a6ff` |

### 📱 Responsive Layout

- **Desktop** (>768px): Side-by-side layout
- **Tablet** (≤768px): Collapsible sidebar
- **Mobile** (≤480px): Stacked vertical layout

## 🔧 Interactive Elements

### 💻 Code Block Controls

Each code block includes dual control panels (top and bottom):

- **Copy buttons**: One-click clipboard copy
- **Font controls**: Size adjustment (A+/A-)
- **Font family**: Dropdown selector
- **Line spacing**: Height adjustment
- **Visual feedback**: Copy confirmation

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + R` | Refresh file list |
| `Ctrl + 1` | Switch to Replace mode |
| `Ctrl + 2` | Switch to Tab mode |
| `Ctrl + W` | Close active tab |
| `Ctrl + T` | Toggle theme |

## 📊 Content Support

### Markdown Features

- **Headers**: H1-H6 with proper hierarchy
- **Typography**: Bold, italic, strikethrough
- **Lists**: Ordered and unordered
- **Links**: Internal and external
- **Images**: Auto-optimized and responsive
- **Tables**: Full styling with borders
- **Blockquotes**: Styled quotations
- **Code**: Inline and block formats

### Advanced Features

- **Math equations**: LaTeX via MathJax
- **Syntax highlighting**: 15+ languages via Prism.js
- **HTML content**: Mixed HTML/Markdown support
- **Custom styling**: CSS class support

## 🧮 Math Support

The viewer includes full LaTeX math support through MathJax:

### Inline Math
Use single dollar signs: `$E = mc^2$` renders as $E = mc^2$

### Display Math
Use double dollar signs:
```latex
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### Supported Features
- Greek letters: `\alpha`, `\beta`, `\gamma`
- Fractions: `\frac{a}{b}`
- Superscripts: `x^2`
- Subscripts: `x_1`
- Integrals: `\int`, `\sum`, `\prod`
- Matrices: `\begin{matrix}...\end{matrix}`

## 🖨️ Print Optimization

### Print Features
- **Clean layout**: Hides UI elements
- **Page breaks**: Prevents code block splitting
- **Typography**: Optimized font sizes
- **Spacing**: Proper margins and padding

### Print Styles
- Body text: 12pt
- Code blocks: 10pt
- Line height: 1.4
- Page margins: Browser default

## 🚀 Performance

### Loading Optimization
- **Lazy loading**: Components load on demand
- **CDN resources**: Fast global delivery
- **Caching**: Browser caches for repeat visits
- **Minimal bundle**: Single file deployment

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

**Experience all these features in action! 🎯**
