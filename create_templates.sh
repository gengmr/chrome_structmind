@echo off
setlocal enabledelayedexpansion

:: 指定目标目录
set "root_dir=.\Templates"
:: 指定输出文件
set "output_file=templates.json"

echo { > %output_file%
call :process_directory "%root_dir%" ""
echo } >> %output_file%

echo Done. Output saved to %output_file%
exit /b

:process_directory
set "dir=%~1"
set "prefix=%~2"
for /d %%D in ("%dir%\*") do (
    set "name=%%~nxD"
    set "escaped_name=!name:"=\"!"
    if "%prefix%"=="" (
        echo   "!escaped_name!": { >> %output_file%
    ) else (
        echo   "%prefix%!escaped_name!": { >> %output_file%
    )
    call :process_directory "%%~D" "%prefix%!escaped_name!/"
    echo   }, >> %output_file%
)
for %%F in ("%dir%\*.json") do (
    set "name=%%~nF"
    set "escaped_name=!name:"=\"!"
    set /p content=<"%%F"
    if "%prefix%"=="" (
        echo   "!escaped_name!": !content! >> %output_file%
    ) else (
        echo   "%prefix%!escaped_name!": !content! >> %output_file%
    )
)
exit /b
