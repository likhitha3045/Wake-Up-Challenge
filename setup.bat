@echo off
REM Setup script for Wake-Up Challenge on Windows

echo.
echo Setting up Wake-Up Challenge DApp...
echo.

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Step 3: Creating environment file...
if not exist .env (
    copy .env.example .env
    echo Note: Please edit .env with your configuration
) else (
    echo .env already exists
)

echo.
echo Step 4: Compiling smart contracts...
call npm run contracts:compile

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env with your Sepolia RPC URL and private key
echo 2. Get test ETH from https://sepoliafaucet.com/
echo 3. Deploy: npm run contracts:deploy
echo 4. Run: npm start
echo.
pause
