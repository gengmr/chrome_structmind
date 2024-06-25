@echo off
:: 设置颜色和标题
color 0A
title Git Automation Script

:: 输出初始信息
echo ==================================================
echo               Git Automation Script
echo ==================================================
echo.

:: 定位到目标目录
echo [1/4] Navigating to directory: E:\chrome_structmind
cd /d E:\chrome_structmind
if %errorlevel% neq 0 (
    echo Error: Unable to navigate to directory.
    pause
    exit /b %errorlevel%
)
echo Successfully navigated to directory.
echo.

:: 执行 git add
echo [2/4] Adding changes to staging area...
git add .
if %errorlevel% neq 0 (
    echo Error: Git add failed.
    pause
    exit /b %errorlevel%
)
echo Changes added successfully.
echo.

:: 执行 git commit
echo [3/4] Committing changes...
git commit -m "update"
if %errorlevel% neq 0 (
    echo Error: Git commit failed.
    pause
    exit /b %errorlevel%
)
echo Changes committed successfully.
echo.

:: 执行 git push
echo [4/4] Pushing changes to remote repository...
git push
if %errorlevel% neq 0 (
    echo Error: Git push failed.
    pause
    exit /b %errorlevel%
)
echo Changes pushed successfully.
echo.

:: 输出完成信息
echo ==================================================
echo               All tasks completed successfully.
echo ==================================================
pause
