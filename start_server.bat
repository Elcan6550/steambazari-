@echo off
title SteamBazari Guard & 2FA Portali
cd /d "%~dp0"
echo ===================================================
echo     STEAMBAZARI GUARD & 2FA SERVERI ISHE DUSHUR
echo ===================================================
echo.
echo Brauzerinizde acin: http://localhost:3000
echo Admin Panel:        http://localhost:3000/admin
echo.
call npm.cmd run dev
pause
