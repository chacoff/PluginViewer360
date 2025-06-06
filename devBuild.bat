@echo off
setlocal enabledelayedexpansion

set "SOURCE_FOLDER=%~dp0"
set "TEMP_FOLDER=C:\TempCopy"

set "local=OMENL17"
set "host=%COMPUTERNAME%"

IF %host%==%local% (
    echo "Jaime's PC"
    set WSL_DEST=\\wsl.localhost\docker-desktop\mnt\docker-desktop-disk\data\docker\volumes\webodm_appmedia\_data\plugins\Viewer360
) ELSE (
    echo "Drone PC"
    set WSL_DEST=\\wsl.localhost\docker-desktop-data\data\docker\volumes\webodm_appmedia\_data\plugins\Viewer360
)

if exist "!TEMP_FOLDER!" rmdir /S /Q "!TEMP_FOLDER!"
mkdir "!TEMP_FOLDER!"
mkdir "!TEMP_FOLDER!\public"
mkdir "!TEMP_FOLDER!\templates"

rem copy "!SOURCE_FOLDER!public\panolens.min.js" "!TEMP_FOLDER!\public\"
rem copy "!SOURCE_FOLDER!public\three.min.js" "!TEMP_FOLDER!\public\"
rem copy "!SOURCE_FOLDER!public\viewer360.js" "!TEMP_FOLDER!\public\"
copy "!SOURCE_FOLDER!templates\viewer360.html" "!TEMP_FOLDER!\templates\"
rem copy "!SOURCE_FOLDER!__init__.py" "!TEMP_FOLDER!\"
copy "!SOURCE_FOLDER!manifest.json" "!TEMP_FOLDER!\"
copy "!SOURCE_FOLDER!plugin.py" "!TEMP_FOLDER!\"


pushd %WSL_DEST%

xcopy %TEMP_FOLDER% %WSL_DEST% /E/H/Y

rmdir /S /Q "!TEMP_FOLDER!"

popd 