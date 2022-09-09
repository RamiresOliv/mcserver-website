@echo off

echo Starting...
md "GitHelper_Assets" > nul
cls
echo Starting...
md "GitHelper_Assets/Bin" > nul
cls
echo Starting...
md "GitHelper_Assets/Bin/DATA" > nul
cls
echo Starting...
md "GitHelper_Assets/Bin/Script" > nul
cls
echo Starting...
if exist GitHelper_Assets/Bin/DATA/FirstTime_SAVE.dat ( cls ) else (
    echo.>> ".gitignore"
    echo /GitHelper_Assets>> ".gitignore"
    echo SAVED_VALUE = true>> "GitHelper_Assets/Bin/DATA/FirstTime_SAVE.dat"
    cls
)
echo downloading main file...
echo "https://raw.githubusercontent.com/RamiresOliv/MinecraftServerMenu/master/Git_Helper/GitHelper.cmd"
bitsadmin.exe /transfer "Main_GitHelper.bat" "https://raw.githubusercontent.com/RamiresOliv/MinecraftServerMenu/master/Git_Helper/GitHelper.cmd" "%cd%/GitHelper_Assets/Bin/Script/Main_GitHelper.bat" > nul
echo Opening...
timeout 1 > nul
echo Openned
@echo on
call "%cd%/GitHelper_Assets/Bin/Script/Main_GitHelper.bat"
del /Q /F "GitHelper_Assets/Bin/Script"
@echo off