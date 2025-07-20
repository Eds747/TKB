@echo off

rem Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

rem Copy files to deployment directory
echo Copying files...
copy /Y web.config "%DEPLOYMENT_TARGET%\"
copy /Y main.py "%DEPLOYMENT_TARGET%\"

echo Deployment complete!
