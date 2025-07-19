@echo off
cd /d "%~dp0.."

set TIMESTAMP=%DATE% %TIME%
set MESSAGE=Auto-commit on %TIMESTAMP%

echo [INFO] Starting Git automation at %TIMESTAMP% >> scripts\git_auto_log.txt

git add . >> scripts\git_auto_log.txt 2>&1
git commit -m "%MESSAGE%" >> scripts\git_auto_log.txt 2>&1
git push origin main >> scripts\git_auto_log.txt 2>&1

echo [INFO] Finished Git automation at %TIMESTAMP% >> scripts\git_auto_log.txt
echo ---------------------------------------- >> scripts\git_auto_log.txt
