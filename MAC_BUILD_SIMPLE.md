# 🍎 Build Mac Installer - Super Simple Guide

## You Have 2 Options:

---

## ⭐ OPTION 1: GitHub Actions (RECOMMENDED - No Mac Needed!)

### What You Need:
- GitHub account (free)
- 10 minutes of time
- Internet connection

### Steps:

#### 1️⃣ Create GitHub Account
- Go to: https://github.com/signup
- Sign up (it's free!)

#### 2️⃣ Create New Repository
- Go to: https://github.com/new
- Repository name: `sales-shine-app`
- ✅ Make it **Public** (required for free builds)
- ❌ Don't check "Add README"
- Click **"Create repository"**

#### 3️⃣ Upload Your Code
- Open PowerShell in your `Sales_App` folder
- Run: `.\setup-github.ps1`
- Follow the prompts
- Enter your repository URL when asked

**OR manually:**
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sales-shine-app.git
git push -u origin main
```

#### 4️⃣ Build the Mac Installer
- Go to your GitHub repository page
- Click **"Actions"** tab (at the top)
- Click **"Build Mac Installer"** on the left
- Click green **"Run workflow"** button
- Click green **"Run workflow"** in the dropdown
- ⏱️ Wait ~10 minutes

#### 5️⃣ Download Your Mac Installer
- After build completes (green checkmark ✅)
- Click on the workflow run
- Scroll to bottom → "Artifacts"
- Download **"Sales_SHINE-Mac"**
- Extract the ZIP file
- Inside you'll find: `Sales_SHINE-1.0.0.dmg` 🎉

---

## 💻 OPTION 2: Build on a Mac Computer

### What You Need:
- Access to a Mac computer
- Node.js installed on Mac

### Steps:

#### 1️⃣ Copy Project to Mac
- Transfer your `Sales_App` folder to Mac (USB, cloud, etc.)

#### 2️⃣ Install Node.js on Mac
- Download from: https://nodejs.org
- Install the `.pkg` file

#### 3️⃣ Open Terminal on Mac
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

#### 4️⃣ Navigate to Your Project
```bash
cd ~/Desktop/Sales_App
```

#### 5️⃣ Install Dependencies
```bash
npm install
```

#### 6️⃣ Build Mac Installer
```bash
npm run build:mac
```

#### 7️⃣ Get Your Installer
- Look in: `dist/Sales_SHINE-1.0.0.dmg`
- That's your Mac installer! 🎉

---

## 📦 What You'll Get

**File:** `Sales_SHINE-1.0.0.dmg`
- Standard Mac installer format
- ~150-200 MB size
- Works on macOS 10.13+

---

## 🎯 Which Option Should I Choose?

| If you... | Choose... |
|-----------|----------|
| Don't have a Mac | GitHub Actions (Option 1) |
| Have a Mac | Mac Computer (Option 2) |
| Want automation | GitHub Actions (Option 1) |
| Want it NOW | Mac Computer (Option 2) |

**Most people choose: GitHub Actions** ⭐

---

## ❓ Need Help?

### GitHub Actions Not Working?
- Make sure repository is **Public** (not Private)
- Check you have `.github/workflows/build-mac.yml` file
- Look at Actions logs for error details

### Can't Push to GitHub?
- Make sure Git is installed: `git --version`
- Check repository URL is correct
- You may need to login: `git config --global user.email "you@example.com"`

### Mac Build Fails?
- Make sure you're on macOS 10.13 or newer
- Install Xcode Command Line Tools: `xcode-select --install`

---

## 🚀 Quick Start (Fastest Way)

1. Run PowerShell as Administrator
2. Navigate to your project:
   ```powershell
   cd C:\Users\idsdk\Desktop\Sales_App
   ```
3. Run the setup script:
   ```powershell
   .\setup-github.ps1
   ```
4. Follow the prompts
5. Go to GitHub → Actions → Run workflow
6. Wait 10 minutes
7. Download your Mac installer!

**That's it!** 🎊
