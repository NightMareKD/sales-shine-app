# Sales_SHINE - Quick GitHub Setup for Mac Build

Write-Host "Sales_SHINE - GitHub Setup Helper" -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git is NOT installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Steps to build Mac installer without a Mac:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a GitHub account (if you don't have one):" -ForegroundColor Yellow
Write-Host "   https://github.com/signup" -ForegroundColor White
Write-Host ""
Write-Host "2. Create a new repository:" -ForegroundColor Yellow
Write-Host "   - Go to: https://github.com/new" -ForegroundColor White
Write-Host "   - Repository name: sales-shine-app" -ForegroundColor White
Write-Host "   - Make it Public (required for free Actions)" -ForegroundColor White
Write-Host "   - Don't initialize with README" -ForegroundColor White
Write-Host "   - Click 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "3. After creating repository, copy the repository URL" -ForegroundColor Yellow
Write-Host "   (It looks like: https://github.com/YOUR-USERNAME/sales-shine-app.git)" -ForegroundColor White
Write-Host ""

# Ask for repository URL
Write-Host "4. Enter your repository URL:" -ForegroundColor Yellow
$repoUrl = Read-Host "   Repository URL"

if ($repoUrl) {
    Write-Host ""
    Write-Host "Setting up Git repository..." -ForegroundColor Cyan
    
    # Initialize git if not already
    if (-not (Test-Path ".git")) {
        git init
        Write-Host "Git repository initialized" -ForegroundColor Green
    }
    
    # Add all files
    git add .
    Write-Host "Files staged for commit" -ForegroundColor Green
    
    # Commit
    git commit -m "Initial commit - Sales_SHINE app"
    Write-Host "Files committed" -ForegroundColor Green
    
    # Set main branch
    git branch -M main
    Write-Host "Main branch set" -ForegroundColor Green
    
    # Add remote
    git remote remove origin 2>$null
    git remote add origin $repoUrl
    Write-Host "Remote repository added" -ForegroundColor Green
    
    # Push to GitHub
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    Write-Host ""
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Go to your repository: $repoUrl" -ForegroundColor White
    Write-Host "2. Click the 'Actions' tab at the top" -ForegroundColor White
    Write-Host "3. Click 'Build Mac Installer' workflow" -ForegroundColor White
    Write-Host "4. Click 'Run workflow' button" -ForegroundColor White
    Write-Host "5. Wait 10 minutes for the build to complete" -ForegroundColor White
    Write-Host "6. Download the 'Sales_SHINE-Mac' artifact" -ForegroundColor White
    Write-Host "7. Extract the ZIP to get your .dmg file!" -ForegroundColor White
    Write-Host ""
    Write-Host "You'll have a Mac installer without owning a Mac!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "No repository URL provided. Manual setup:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Run these commands after creating your GitHub repository:" -ForegroundColor White
    Write-Host "  git init" -ForegroundColor Cyan
    Write-Host "  git add ." -ForegroundColor Cyan
    Write-Host "  git commit -m 'Initial commit'" -ForegroundColor Cyan
    Write-Host "  git branch -M main" -ForegroundColor Cyan
    Write-Host "  git remote add origin YOUR_REPO_URL" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "For detailed instructions, see: BUILD_MAC_GUIDE.md" -ForegroundColor Yellow
Write-Host ""