
# 🚀 Getting Started Guide

This guide will help you set up and use the Advanced Markdown Viewer effectively.

## 📁 Project Structure

Your GitHub Pages repository should have this structure:

```
your-repo/
├── index.html          # The markdown viewer
├── items/              # Your content folder
│   ├── manifest.json   # File listing
│   ├── README.md       # Your markdown files
│   ├── guide.md
│   └── docs/
│       └── advanced.md
```

## 📝 Creating Content

### Markdown Files

Create `.md` files with rich content:

- **Headers** using `#`, `##`, `###`
- **Bold** with `**text**` and *italic* with `*text*`
- **Links** with `[text](url)`
- **Images** with `![alt](url)`
- **Code** with backticks or code blocks
- **Lists** with `-` or `1.`
- **Tables** with pipe syntax
- **Math** with LaTeX notation

### HTML Files

You can also include `.html` files for custom content that needs specific styling or interactive elements.

## 🔧 Manifest Configuration

The `manifest.json` file tells the viewer which files to display:

```json
{
  "files": [
    "README.md",
    "getting-started.md",
    "docs/features.md",
    "examples/demo.html"
  ]
}
```

### Tips for Manifest

- **Order matters**: Files appear in the order listed
- **Alphabetical sorting**: The viewer sorts files alphabetically regardless of manifest order
- **Nested folders**: Use forward slashes for subfolders
- **File types**: Include both `.md` and `.html` files

## 🎨 Customization

### Themes

The viewer includes built-in light and dark themes. Users can toggle between them using:
- The sidebar toggle button
- Keyboard shortcut `Ctrl + T`

### Code Blocks

Interactive code blocks include controls for:
- **Font size**: Increase/decrease with A+/A- buttons
- **Font family**: Choose from monospace fonts
- **Line spacing**: Adjust line height
- **Copy function**: One-click copy to clipboard

## 📱 Responsive Design

The viewer automatically adapts to different screen sizes:

- **Desktop**: Full sidebar + content layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Stacked layout with drawer-style sidebar

## 🖨️ Printing

The viewer includes print optimization:
- UI elements are hidden during print
- Code blocks prevent page breaks
- Clean, professional output
- Proper typography scaling

## 🚀 Deployment

### GitHub Pages Setup

1. **Create repository** with your content
2. **Enable GitHub Pages** in repository settings
3. **Choose source**: Deploy from main branch
4. **Access your site**: `https://username.github.io/repository-name`

### Local Testing

Test locally by opening `index.html` in your browser. Note that file discovery requires a web server for full functionality.

## 🆘 Troubleshooting

### Files Not Loading

- Check `manifest.json` syntax
- Verify file paths are correct
- Ensure files exist in `items/` folder
- Check browser console for errors

### Math Not Rendering

- Verify LaTeX syntax: `$inline$` and `$$display$$`
- Check MathJax loading in browser console
- Ensure internet connection for CDN resources

### Syntax Highlighting Issues

- Check language specification in code blocks
- Verify Prism.js components are loading
- Use supported language names

---

**Happy writing! 📖✨**
