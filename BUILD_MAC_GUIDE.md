# Sales_SHINE - Building Mac Installer Guide

## 📋 Prerequisites for Mac Build

Since Mac installers can only be built on macOS, you have three options:

### Option 1: Build on a Mac Computer ✅ (Recommended)

#### Requirements:
- Mac computer (macOS 10.13 or later)
- Node.js installed
- Internet connection

#### Steps:

1. **Transfer Project to Mac**
   - Copy the entire `Sales_App` folder to your Mac
   - Or use Git to clone the repository

2. **Open Terminal on Mac**
   - Press `Cmd + Space`
   - Type "Terminal" and press Enter

3. **Navigate to Project**
   ```bash
   cd ~/Desktop/Sales_App
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Build the Mac Installer**
   ```bash
   npm run build:mac
   ```

6. **Find Your Installer**
   - Location: `dist/Sales_SHINE-1.0.0.dmg`
   - This is your Mac installer!

---

### Option 2: Use GitHub Actions 🤖 (No Mac Needed!)

#### Setup:

1. **Create a GitHub Repository**
   - Go to https://github.com
   - Create new repository (e.g., "sales-shine-app")

2. **Push Your Code**
   ```powershell
   # In your project folder on Windows
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/sales-shine-app.git
   git push -u origin main
   ```

3. **Trigger the Build**
   - Go to your GitHub repository
   - Click "Actions" tab
   - Click "Build Mac Installer"
   - Click "Run workflow"
   - Wait 5-10 minutes

4. **Download Mac Installer**
   - After build completes, click on the workflow run
   - Download the "Sales_SHINE-Mac" artifact
   - Extract the ZIP to get your `.dmg` file

---

### Option 3: Cloud Mac Service 💻

Use services like:
- **MacStadium** (paid)
- **AWS EC2 Mac instances** (paid)
- **MacinCloud** (paid)

---

## 📦 What You'll Get

### Mac Installer File:
- **File**: `Sales_SHINE-1.0.0.dmg`
- **Size**: ~150-200 MB
- **Type**: Disk Image (standard Mac installer)

### How Mac Users Install:
1. Double-click the `.dmg` file
2. Drag "Sales_SHINE" to Applications folder
3. Launch from Applications or Launchpad
4. First time: Right-click → Open (to bypass Gatekeeper)

---

## 🔧 Troubleshooting

### "npm: command not found" on Mac
```bash
# Install Node.js from https://nodejs.org
# Or use Homebrew:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

### Python/Build Tools Error on Mac
```bash
xcode-select --install
```

### GitHub Actions Build Fails
- Check that all files are committed
- Ensure `package.json` is correct
- Check Actions logs for specific errors

---

## 📝 Build Scripts in package.json

Current scripts available:
```json
"build:win": "webpack --mode production && electron-builder --win"
"build:mac": "webpack --mode production && electron-builder --mac"
```

---

## 🎯 Comparison

| Method | Cost | Time | Mac Needed | Ease |
|--------|------|------|------------|------|
| Mac Computer | Free | 5 min | Yes | Easy |
| GitHub Actions | Free | 10 min | No | Medium |
| Cloud Mac | $20-50/mo | 5 min | No | Medium |

---

## ✅ Recommended Approach

**For most users**: Use **GitHub Actions** (Option 2)
- No Mac computer needed
- Free for public repositories
- Automated builds
- Professional CI/CD setup

---

## 🚀 Quick Start with GitHub Actions

1. Create GitHub account (if you don't have one)
2. Create new repository
3. Push your code:
   ```powershell
   git init
   git add .
   git commit -m "Add Sales_SHINE app"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
4. Go to Actions → Build Mac Installer → Run workflow
5. Download the artifact after 10 minutes

Done! You now have a Mac installer without touching a Mac! 🎉
