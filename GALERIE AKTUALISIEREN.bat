@echo off
chcp 65001 >nul
echo ================================================
echo   GALERIE AKTUALISIEREN - Tischlerei Auer
echo ================================================
echo.
echo Lese Bilder aus dem galerie/ Ordner...
echo.
cd /d "%~dp0"
node galerie-aktualisieren.js
