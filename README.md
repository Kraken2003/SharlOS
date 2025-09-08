# Sharl OS 

*A Matrix-inspired cyberpunk operating system and personal portfolio*

[![Matrix Theme](https://img.shields.io/badge/Theme-Matrix-black?style=for-the-badge&logo=matrix&logoColor=green)](https://kraken2003.github.io/SharlOS/)
[![React](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)

## 🎯 Overview

Sharl OS is an interactive, Matrix-themed personal portfolio that simulates a cyberpunk operating system. Choose your path - take the red pill to explore a fully functional terminal environment, or the blue pill to discover a sleek cyberpunk profile interface with games, music, and professional information.

## 🌟 Features

### 🏁 Matrix Entry Point
- **Interactive Choice Screen**: Choose between red pill (terminal experience) and blue pill (cyberpunk profile)
- **Dynamic Matrix Rain**: Authentic Matrix-style falling characters animation
- **Responsive Design**: Optimized for both desktop and mobile devices
- **URL Routing**: Direct links to `/redpill` and `/bluepill` paths

### 💻 Terminal Experience (Red Pill)
- **Full Terminal Emulator**: Navigate through a simulated file system
- **Command Line Interface**: Execute commands like `ls`, `cd`, `cat`, `help`
- **Music Player Integration**: Built-in audio controls with playlist management
- **Boot Sequence**: Authentic OS boot simulation with progress bars
- **Sound Effects**: Boot and shutdown audio for immersive experience
- **File System**: Browse directories, read files, and explore the system

### 🎮 Cyberpunk Profile (Blue Pill)
- **Professional Portfolio**: Detailed work experience and career timeline
- **Skills Dashboard**: Interactive skill bars and capabilities
- **Future Predictions**: AI and technology predictions with confidence ratings
- **Retro Games**: Play classic games like Tetris, Pong, and Space Invaders
- **Music Player**: iPod-inspired interface with curated playlist
- **Real-time Elements**: Live clock, status rotation, and glitch effects

### 🎵 Music Features
- **Curated Playlist**: 15+ tracks including:
  - *Cruel Angel Thesis* (Neon Genesis Evangelion)
  - *Hacking to the Gate* (Steins;Gate)
  - *Midnight City* - M83
  - *Feel Good Inc.* - Gorillaz
  - *Time* - Pink Floyd
  - And more cyberpunk classics
- **Album Art**: Visual album covers for each track
- **Cross-platform**: Available in both Terminal and Profile interfaces

### 🎯 Professional Highlights
- **AI/ML Engineering**: Specializing in on-device AI and multilingual solutions
- **Team Leadership**: Experience in leading AI engineering initiatives
- **Cloud Architecture**: Expertise in scalable cloud solutions
- **Current Role**: Co-Founder at SyntX by OrangeCat (Qualcomm ISV Partner)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Modern web browser with JavaScript enabled

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/Kraken2003/SharlOS.git

cd SharlOS

# Install dependencies
npm install

# Generate song manifest (for music features)
npm run generate-songs

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run generate-songs` | Generate song manifest from audio files |

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - Modern UI framework with hooks
- **TypeScript** - Type-safe JavaScript development
- **Vite 6.3.5** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible, customizable UI primitives
- **Lucide React** - Beautiful icon library
- **Custom CSS** - Matrix-themed animations and effects

### Key Libraries
- **React Router DOM** - Client-side routing
- **Recharts** - Data visualization for skill bars
- **Sonner** - Toast notifications
- **Next Themes** - Theme management (future-proofing)

## 📱 Experience Paths

### The Matrix Choice
```
🌐 / (or /SharlOS on GitHub Pages)
├── Choose your pill:
│   ├── 🔴 Red Pill → Terminal Experience
│   └── 🔵 Blue Pill → Cyberpunk Profile
```

### Terminal Commands
```bash
# Navigation
ls              # List directory contents
cd <directory>  # Change directory
pwd            # Print working directory

# File operations
cat <file>      # Display file contents
help           # Show available commands

# Music controls
play           # Play current song
pause          # Pause music
next           # Next track
prev           # Previous track
```

### Games Available
- **🧱 Tetris** - Classic block-stacking puzzle
- **🏓 Pong** - Retro paddle game
- **🚀 Space Invaders** - Classic arcade shooter

## 🎨 Design Philosophy

### Cyberpunk Aesthetics
- **Matrix-inspired**: Green-on-black color scheme with falling characters
- **Glitch Effects**: Dynamic text distortion and visual artifacts
- **Neon Glows**: Subtle lighting effects and borders
- **Retro Typography**: Monospace fonts for terminal authenticity

### User Experience
- **Immersive**: Full-screen experiences with no distractions
- **Interactive**: Clickable elements and keyboard shortcuts
- **Responsive**: Seamless experience across devices
- **Accessible**: Proper contrast ratios and keyboard navigation

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── Matrix.tsx          # Entry point with pill choice
│   ├── Terminal.tsx        # Red pill terminal experience
│   ├── CyberpunkProfile.tsx # Blue pill profile interface
│   ├── IPOD.tsx           # Music player component
│   └── games/             # Game components
├── songManifest.ts        # Auto-generated music playlist
└── styles/
    └── globals.css        # Global styles and animations
```

### Audio Assets
- Located in `public/audio/` directory
- Auto-generated manifest via `scripts/generateSongManifest.js`
- Supports MP3 audio files with JPG/PNG album art

## 🤝 Contributing

While this is primarily a personal portfolio project, suggestions and improvements are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Matrix** (1999) - Inspiration for the visual theme and red pill/blue pill concept
- **Cyberpunk Culture** - Aesthetic inspiration from cyberpunk media
- **Open Source Community** - React, Vite, and the amazing libraries used

## 📞 Contact

**Prithvi Chohan**
- **LinkedIn**: [https://www.linkedin.com/in/prithvichohan/](https://www.linkedin.com/in/prithvichohan/)
- **GitHub**: [@prithvi-chohan](https://github.com/Kraken2003)
- **Email**: [prithvi@orangecat.ai](prithvi@orangecat.ai)
---

*Remember, all I'm offering is the truth. Nothing more.* - Morpheus