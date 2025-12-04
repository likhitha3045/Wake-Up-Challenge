# 🚀 Quick Command Reference

## Project Setup

### Install Everything
```bash
npm run install-all
```

### Setup Environment
```bash
cp .env.example .env
# Edit .env with your keys
```

---

## Smart Contracts

### Compile
```bash
npm run contracts:compile
```

### Test
```bash
npm run contracts:test
```

### Deploy to Sepolia
```bash
npm run contracts:deploy
```

### Verify on Etherscan
```bash
npx hardhat verify CONTRACT_ADDRESS --network sepolia
```

---

## Running the Application

### Start Everything (Recommended)
```bash
npm start
```

### Start Backend Only
```bash
npm run backend
```

### Start Frontend Only
```bash
npm run frontend
```

### Stop All Services
```bash
Ctrl + C  (in terminal)
```

---

## Frontend

### Build for Production
```bash
cd frontend
npm run build
cd ..
```

### Test Frontend
```bash
cd frontend
npm test
cd ..
```

---

## Utilities

### Check Dependency Updates
```bash
npm outdated
```

### Update Dependencies
```bash
npm update
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check for Vulnerabilities
```bash
npm audit
npm audit fix
```

---

## Network Commands

### Get Sepolia ETH Balance
```bash
# Using Web3.js
node -e "
const Web3 = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/YOUR_KEY');
web3.eth.getBalance('0xYOUR_ADDRESS').then(bal => {
  console.log('Balance:', web3.utils.fromWei(bal, 'ether'), 'ETH');
});
"
```

### Check Gas Price
```bash
# Using Etherscan API
curl "https://api-sepolia.etherscan.io/api?module=gastracker&action=gasoracle"
```

### Get Latest Block
```bash
# Using Web3.js
node -e "
const Web3 = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/YOUR_KEY');
web3.eth.getBlockNumber().then(block => console.log('Block:', block));
"
```

---

## Development

### Run Backend with Debug
```bash
DEBUG=* npm run backend
```

### Run Frontend with Debug
```bash
npm run frontend -- --debug
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

### Check Frontend Build
```bash
cd frontend
npm run build
# Check build/ folder
cd ..
```

---

## Database (When Using MongoDB)

### Start MongoDB
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo

# Or local
mongod
```

### Connect to MongoDB
```bash
mongo mongodb://localhost:27017/wakeup-challenge
```

### Backup Database
```bash
mongodump --uri "mongodb://localhost:27017/wakeup-challenge" --out ./backup
```

### Restore Database
```bash
mongorestore --uri "mongodb://localhost:27017" ./backup
```

---

## Docker (Optional)

### Build Docker Image
```bash
docker build -t wakeup-challenge .
```

### Run Docker Container
```bash
docker run -p 5000:5000 --env-file .env wakeup-challenge
```

### Stop Container
```bash
docker stop container_id
```

---

## Helpful Checks

### Verify Node Version
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
```

### Check If Ports Are Free
```bash
# macOS/Linux
lsof -i :5000  # Backend port
lsof -i :3000  # Frontend port

# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Verify MetaMask
```bash
# In browser console
window.ethereum !== undefined  # Should be true
```

### Check Contract Deployment
```bash
# Visit Sepolia Etherscan
https://sepolia.etherscan.io/address/0xYOUR_CONTRACT_ADDRESS
```

---

## Troubleshooting Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Kill Process on Port
```bash
# macOS/Linux
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:3000)

# Windows
taskkill /PID process_id /F
```

### Reset MetaMask
```bash
# In MetaMask settings:
# Settings → Advanced → Reset Account
```

### Check Logs
```bash
# Backend
tail -f backend/server.js

# Browser console (F12)
# Check for errors
```

---

## Environment Variable Management

### Add/Update Variables
```bash
# Edit .env file
nano .env  # macOS/Linux
notepad .env  # Windows
```

### View Current Variables
```bash
cat .env  # macOS/Linux
type .env  # Windows
```

### Export for Production
```bash
# Create .env.production
cp .env .env.production
# Then edit as needed
```

---

## Git Commands (Optional)

### Initialize Git (if not done)
```bash
git init
```

### Check Status
```bash
git status
```

### Add Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your message"
```

---

## Monitoring Commands

### Watch Logs
```bash
# Backend logs
npm run backend 2>&1 | tee backend.log

# Frontend logs
npm run frontend 2>&1 | tee frontend.log
```

### Monitor Network
```bash
# Watch Etherscan for your address
https://sepolia.etherscan.io/address/0xYOUR_WALLET

# Watch contract
https://sepolia.etherscan.io/address/0xYOUR_CONTRACT
```

### Performance Test
```bash
# Load test backend
npm install -g autocannon
autocannon http://localhost:5000
```

---

## Emergency Commands

### Force Stop Everything
```bash
# macOS/Linux
killall node

# Windows
taskkill /F /IM node.exe
```

### Restart Everything
```bash
# Stop all
npm run stop

# Clean reinstall
rm -rf node_modules
npm install
npm start
```

### Check System Resources
```bash
# macOS/Linux
top

# Windows
tasklist /v
```

---

## Useful Shortcuts

### Copy Contract Address to Clipboard
```bash
# macOS
grep "deployed to" deploy-output.txt | tail -1 | pbcopy

# Linux
grep "deployed to" deploy-output.txt | tail -1 | xclip

# Windows
for /f "tokens=*" %a in ('findstr /R "deployed to" deploy-output.txt') do @echo %a | clip
```

### Quick Test Transaction
```bash
# Create test file: test-tx.js
const Web3 = require('web3');
// ... test code ...
node test-tx.js
```

---

## Documentation Quick Links

| Command | View Documentation |
|---------|-------------------|
| `cat README.md` | Main guide |
| `cat QUICKSTART.md` | Fast start |
| `cat DEPLOYMENT.md` | Deployment |
| `cat CONFIG.md` | Configuration |
| `cat TROUBLESHOOTING.md` | Help |
| `cat PROJECT_SUMMARY.md` | Overview |
| `cat FILE_MANIFEST.md` | File list |

---

## One-Liners

### Deploy & Update Config
```bash
npm run contracts:deploy && echo "Deployment complete - update contract address in .env and frontend/src/config.js"
```

### Full Setup
```bash
npm run install-all && cp .env.example .env && echo "Setup complete - edit .env file"
```

### Test & Deploy
```bash
npm run contracts:test && npm run contracts:deploy
```

### Start Dev Environment
```bash
npm run backend & npm run frontend
```

---

## Smart Shortcuts

### Save These Aliases (Optional)

```bash
# Add to ~/.bashrc or ~/.zshrc

alias wakeup-start="npm start"
alias wakeup-backend="npm run backend"
alias wakeup-frontend="npm run frontend"
alias wakeup-deploy="npm run contracts:deploy"
alias wakeup-test="npm run contracts:test"
alias wakeup-compile="npm run contracts:compile"

# Then use:
wakeup-start
wakeup-deploy
wakeup-test
```

---

## Quick Status Check

```bash
#!/bin/bash
echo "📊 Wake-Up Challenge Status Check"
echo "=================================="
echo ""
echo "✓ Node version:"
node --version
echo ""
echo "✓ npm version:"
npm --version
echo ""
echo "✓ Port 5000 (Backend):"
lsof -i :5000 || echo "Available"
echo ""
echo "✓ Port 3000 (Frontend):"
lsof -i :3000 || echo "Available"
echo ""
echo "✓ MetaMask installed:"
[ -d "$HOME/.config/google-chrome/Default/Extensions" ] && echo "Yes (Chrome)" || echo "Check manually"
echo ""
echo "✓ Environment file:"
[ -f .env ] && echo "Exists" || echo "Create from .env.example"
echo ""
echo "=================================="
echo "Ready to start! Run: npm start"
```

---

**Save these commands for quick reference! 🎯**

Most used:
```bash
npm start              # Run everything
npm run contracts:test # Run tests
npm run contracts:deploy  # Deploy
npm run backend        # Backend only
npm run frontend       # Frontend only
```

---

**Need help? Run:** `cat QUICKSTART.md`
