
# 📚 Advanced Markdown Viewer

Welcome to the **Advanced Markdown Viewer** - a powerful, GitHub Pages-compatible markdown viewer with comprehensive features!

## 🚀 Features

- **📂 File Discovery**: Automatically scans `items/` folder for markdown and HTML files
- **🔄 Dual View Modes**: Switch between Replace mode and Tab mode
- **🎨 Syntax Highlighting**: Support for 15+ programming languages
- **🧮 Math Equations**: Full LaTeX/MathJax support
- **📊 Rich Tables**: Beautiful table rendering with styling
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive**: Works perfectly on all devices
- **🖨️ Print Ready**: Optimized layouts for printing

## 🏁 Quick Start

1. Create an `items/` folder in your repository
2. Add your markdown and HTML files
3. Create a `manifest.json` file listing all files
4. Deploy to GitHub Pages!

## 🎯 Usage

### Replace Mode
Click any file in the sidebar to replace the current view. Perfect for single-document reading.

### Tab Mode  
Click files to open them in browser-style tabs. Great for comparing multiple documents.

## ⌨️ Keyboard Shortcuts

- `Ctrl + R` - Refresh file list
- `Ctrl + 1` - Switch to Replace mode
- `Ctrl + 2` - Switch to Tab mode
- `Ctrl + W` - Close current tab (Tab mode)
- `Ctrl + T` - Toggle dark/light theme

## 🔧 Configuration

The viewer uses a `manifest.json` file to discover files:

```json
{
  "files": [
    "README.md",
    "docs/guide.md",
    "examples/demo.html"
  ]
}
```

## 💡 Tips

- Files are displayed alphabetically in the sidebar
- Code blocks include interactive controls for font size, family, and line spacing
- Math equations use LaTeX syntax: `$inline$` and `$$display$$`
- Images are automatically optimized and responsive
- Print mode hides UI elements for clean document printing

---

**Built with ❤️ for GitHub Pages hosting**
