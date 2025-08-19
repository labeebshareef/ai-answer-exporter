# AI Answer Exporter

A Chrome Extension built with WXT that exports AI responses from ChatGPT, Claude.ai, and Perplexity.ai as PDF or print with preserved formatting.

## Features

- 🎯 **Universal Support**: Works on ChatGPT, Claude.ai, and Perplexity.ai
- 📄 **PDF Export**: Download AI responses as properly formatted PDFs
- 🖨️ **Print Function**: Open browser print dialog with formatted content
- ⚙️ **Customizable Settings**: Font family, size, page format, margins, and themes
- 🎨 **Preserved Formatting**: Maintains code blocks, lists, tables, headings, and styling
- 🌙 **Dark Mode**: Export in light or dark themes

## Installation

### Development

1. Clone the repository:
```bash
git clone https://github.com/labeebshareef/ai-answer-exporter.git
cd ai-answer-exporter
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `.output/chrome-mv3` directory

### Production

Download from the Chrome Web Store (coming soon!)

## Usage

1. **Visit AI Websites**: Go to ChatGPT, Claude.ai, or Perplexity.ai
2. **Find Export Buttons**: Look for "📄 Download PDF" and "🖨️ Print" buttons below AI responses
3. **Customize Settings**: Click the extension icon and select "⚙️ Open Settings" to customize export options
4. **Export**: Click the buttons to export with your preferred formatting

## Settings

Access the settings page to customize:

- **Font Family**: Arial, Times New Roman, Roboto, Helvetica, Georgia, Courier New
- **Font Size**: Small (12px), Medium (14px), Large (16px)
- **Page Format**: A4, Letter, Legal
- **Margins**: Narrow, Normal, Wide
- **Theme**: Light or Dark mode export

## Technical Details

### Tech Stack

- **WXT**: Modern Chrome Extension framework
- **React**: UI components for popup and options page
- **TailwindCSS**: Styling and responsive design
- **TypeScript**: Type-safe development
- **html2pdf.js**: PDF generation library
- **Manifest V3**: Latest Chrome Extension standard

### Architecture

```
src/
├── content-scripts/     # DOM injection logic
├── background/          # Service worker for settings
├── popup/              # Extension popup UI
├── options/            # Settings page UI
├── utils/              # Shared utilities
└── types/              # TypeScript definitions
```

### Key Components

- **Content Script**: Detects AI responses and injects export buttons
- **Background Script**: Manages settings and extension lifecycle
- **Settings Manager**: Handles persistent storage with Chrome Storage API
- **Export Manager**: PDF generation and print functionality
- **Website Detector**: Identifies and locates AI responses on different platforms

## Development

### Commands

```bash
npm run dev          # Development mode with hot reload
npm run build        # Production build
npm run zip          # Create distribution package
npm run compile      # TypeScript compilation check
```

### Browser Support

- Chrome (Manifest V3)
- Firefox support via `npm run dev:firefox`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the wiki for detailed guides
- **Discussion**: Join discussions in GitHub Discussions

---

Made with ❤️ for the AI community