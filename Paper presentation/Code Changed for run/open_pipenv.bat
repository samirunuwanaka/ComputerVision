@echo off
cd /d "%~dp0"

:: If arguments are passed directly, run them using pipenv run python
if not "%~1"=="" (
    if /i "%~1"=="python" (
        echo Running in Pipenv: %*
        pipenv run %*
        goto end
    )
    echo Running in Pipenv: python %*
    pipenv run python %*
    goto end
)

:menu
cls
echo =======================================================
echo           Stratified Domain Adaptation (StrDA)
echo =======================================================
echo Select a script to run in Pipenv environment:
echo.
echo   [1] Supervised Learning (supervised_learning.py)
echo   [2] Stage 1 - HDGE (stage1_HDGE.py)
echo   [3] Stage 1 - DD (stage1_DD.py)
echo   [4] Stage 2 - StrDA (stage2_StrDA.py)
echo   [5] Testing (test.py)
echo   [6] Download Datasets (download_dataset.py)
echo   [7] Open Pipenv Interactive Shell
echo   [8] Exit
echo.

set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto run_supervised
if "%choice%"=="2" goto run_stage1_hdge
if "%choice%"=="3" goto run_stage1_dd
if "%choice%"=="4" goto run_stage2_strda
if "%choice%"=="5" goto run_test
if "%choice%"=="6" goto run_download
if "%choice%"=="7" goto run_shell
if "%choice%"=="8" goto end

echo.
echo Invalid selection. Please try again.
pause
goto menu

:run_supervised
echo.
echo Running Supervised Learning...
pipenv run python supervised_learning.py --model TRBA --aug
goto end

:run_stage1_hdge
echo.
echo Running Stage 1 HDGE...
pipenv run python stage1_HDGE.py --select_data select_data.npy --num_subsets 5 --beta 0.7 --train
goto end

:run_stage1_dd
echo.
echo Running Stage 1 DD...
pipenv run python stage1_DD.py --select_data select_data.npy --num_subsets 5 --discriminator CRNN --train --aug
goto end

:run_stage2_strda
echo.
echo Running Stage 2 StrDA...
pipenv run python stage2_StrDA.py --saved_model trained_model/TRBA.pth --model TRBA --num_subsets 5 --method HDGE --beta 0.7 --aug
goto end

:run_test
echo.
echo Running Evaluation / Test...
pipenv run python test.py --saved_model trained_model/TRBA.pth --model TRBA
goto end

:run_download
echo.
echo Starting Dataset Downloader...
pipenv run python download_dataset.py
goto end

:run_shell
echo.
echo Opening Pipenv Shell...
pipenv shell
goto end

:end
echo.
pause


