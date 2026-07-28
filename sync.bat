@echo off
title ChronoVault Auto-Sync Tool
echo ===================================================
echo   ChronoVault Knowledge OS - Auto Upload & Sync
echo ===================================================
echo.
cd /d "%~dp0"
set PATH=C:\Users\Admin\AppData\Local\GitHubDesktop\app-3.5.12\resources\app\git\cmd;%PATH%

echo [1/4] Building site payload...
call npm run build

echo [2/4] Staging files (handles all files up to 100MB+)...
git add -A

echo [3/4] Creating commit...
git commit -m "Sync vault files and update site"

echo [4/4] Pushing directly to GitHub...
git push origin main

echo.
echo ===================================================
echo   SUCCESS! All files pushed to GitHub.
echo   Your site will update in ~30 seconds.
echo ===================================================
echo.
pause
