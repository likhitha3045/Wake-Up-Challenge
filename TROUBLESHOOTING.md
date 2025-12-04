# 🔧 Troubleshooting Guide

## Table of Contents
1. [Installation Issues](#installation-issues)
2. [Deployment Issues](#deployment-issues)
3. [Runtime Issues](#runtime-issues)
4. [Smart Contract Issues](#smart-contract-issues)
5. [Frontend Issues](#frontend-issues)
6. [MetaMask Issues](#metamask-issues)
7. [Network Issues](#network-issues)
8. [Performance Issues](#performance-issues)

---

## Installation Issues

### ❌ npm install fails

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
npm install --legacy-peer-deps
# or
npm install --force
```

### ❌ Node version mismatch

**Error**: `ERR! notsup WARN using --force I sure hope you know what you are doing`

**Solution**:
```bash
node --version  # Should be 16+
nvm install 18  # Use NVM to install correct version
nvm use 18
npm install
```

### ❌ Permission denied

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# macOS/Linux
sudo chown -R $(whoami) /usr/local/lib/node_modules

# or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### ❌ Package not found

**Error**: `npm ERR! 404 Not Found`

**Solution**:
```bash
npm cache clean --force
npm install
```

---

## Deployment Issues

### ❌ Contract won't deploy

**Error**: `Error: insufficient funds for gas`

**Cause**: Not enough Sepolia ETH

**Solution**:
```bash
# Get more test ETH
# Go to https://sepoliafaucet.com/
# Request 0.5 ETH again

# Check balance
ethers.provider.getBalance(yourAddress)
```

### ❌ Invalid RPC URL

**Error**: `Invalid JSON-RPC response`

**Cause**: Wrong Infura key or endpoint

**Solution**:
```bash
# Check your .env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Verify connection
curl https://sepolia.infura.io/v3/YOUR_KEY \
  -X POST \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### ❌ Private key error

**Error**: `Invalid key format`

**Cause**: Private key not in correct format

**Solution**:
```bash
# Private key should start with 0x
# .env should have:
PRIVATE_KEY=0xabcd1234...

# NOT
PRIVATE_KEY=abcd1234...  # Missing 0x
```

### ❌ Contract verification fails

**Error**: `Etherscan verification failed`

**Solution**:
```bash
# This is non-critical, contract still works
# Manually verify on Etherscan:
# 1. Go to https://sepolia.etherscan.io/
# 2. Paste contract address
# 3. Click "Verify and Publish"
# 4. Paste source code

# Or retry:
npx hardhat verify CONTRACT_ADDRESS --network sepolia
```

### ❌ Out of gas

**Error**: `Error: out of gas`

**Cause**: Gas limit too low

**Solution**:
```bash
# In hardhat.config.js, increase gas limit:
gas: 8000000,

# Or in contract:
function deploymentOptimizations() {
  // Use more gas-efficient code
}
```

---

## Runtime Issues

### ❌ Backend won't start

**Error**: `EADDRINUSE: address already in use :::5000`

**Cause**: Port 5000 already in use

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 PID  # macOS/Linux
taskkill /PID PID /F  # Windows

# Or use different port
BACKEND_PORT=5001 npm run backend
```

### ❌ Frontend won't start

**Error**: `Something is already running on port 3000`

**Cause**: Port 3000 already in use

**Solution**:
```bash
# Kill port 3000
kill -9 $(lsof -t -i:3000)

# Or use PORT env var
PORT=3001 npm run frontend
```

### ❌ Backend crashes on start

**Error**: `Cannot find module` or `SyntaxError`

**Solution**:
```bash
# Check for syntax errors
node -c backend/server.js

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check console for error location
npm run backend -- --debug
```

### ❌ API returns 404

**Error**: `Cannot POST /api/challenge/create`

**Cause**: Route not defined or path wrong

**Solution**:
```bash
# Check route definition in backend/routes/challenge.js
# Verify path matches exactly
# Check capitalization

# Common issues:
/api/challenge/create    # Check this works
/api/Challenge/create    # Wrong - capital C
/api/challenges/create   # Wrong - plural
```

---

## Smart Contract Issues

### ❌ Contract reverts with "Only oracle can call"

**Error**: `VM Exception: Only oracle can call`

**Cause**: Oracle address not set correctly

**Solution**:
```solidity
// In your contract interaction:
// Make sure you're calling from owner/oracle account

// Or set oracle address:
wakeUpChallenge.setOracleAddress(yourAddress);
```

### ❌ CreateChallenge fails

**Error**: `Error: Incorrect deposit amount`

**Cause**: msg.value doesn't match depositAmount parameter

**Solution**:
```javascript
const depositEth = 0.1;
const depositWei = web3.utils.toWei(depositEth.toString(), 'ether');

// Ensure msg.value matches
await web3.eth.sendTransaction({
  from: account,
  to: contractAddress,
  value: depositWei,  // Must match parameter
  data: contract.methods.createChallenge(depositWei, wakeUpTime, duration).encodeABI()
});
```

### ❌ Gas estimate too high

**Error**: `Error: gas required exceeds allowance`

**Cause**: Gas limit estimation wrong

**Solution**:
```javascript
try {
  const estimate = await web3.eth.estimateGas({...});
  const withBuffer = Math.ceil(estimate * 1.3); // 30% buffer
  // Use withBuffer for gas limit
} catch (e) {
  // Use fixed amount if estimation fails
  const fixedGas = 300000;
}
```

### ❌ Contract read functions return wrong data

**Cause**: Reading stale data or wrong contract instance

**Solution**:
```javascript
// Ensure correct contract address
console.log(contract.address); // Verify this

// Create new contract instance if needed
contract = new web3.eth.Contract(ABI, correctAddress);

// Use .call() for read-only functions
const data = await contract.methods.getChallenge(id).call();
```

---

## Frontend Issues

### ❌ Web3 not initialized

**Error**: `Cannot read property 'utils' of null`

**Cause**: Web3 initialization failed or not awaited

**Solution**:
```javascript
// Ensure initWeb3 is called first
async function init() {
  await initWeb3();  // Add await
  // Then use web3
}

// Check window.ethereum exists
if (!window.ethereum) {
  alert('Install MetaMask');
}
```

### ❌ Contract ABI error

**Error**: `Invalid JSON-RPC response`

**Cause**: Wrong contract address or ABI format

**Solution**:
```javascript
// Verify contract address is correct
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
console.log(CONTRACT_ADDRESS); // Should be 0x...

// Check ABI is array of functions
console.log(Array.isArray(CONTRACT_ABI)); // Should be true
```

### ❌ Component not rendering

**Error**: Blank page or white screen

**Solution**:
```bash
# Check browser console for errors
# Open DevTools: F12

# Common causes:
1. React not imported
2. Syntax error in component
3. Props validation failed
4. Hooks misused

# Check with:
npm run frontend -- --debug
```

### ❌ State not updating

**Error**: Component not re-rendering after state change

**Solution**:
```javascript
// Ensure using setState, not direct assignment
// ❌ Wrong:
this.state.value = newValue;

// ✅ Right:
this.setState({ value: newValue });

// For hooks:
// ✅ Right:
const [value, setValue] = useState(initialValue);
setValue(newValue);
```

### ❌ API calls failing

**Error**: `ERR_BLOCKED_BY_CORS`

**Cause**: Backend CORS not configured or not running

**Solution**:
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check CORS in backend/server.js
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

# Restart backend
npm run backend
```

---

## MetaMask Issues

### ❌ MetaMask not detected

**Error**: `window.ethereum is undefined`

**Cause**: MetaMask not installed or disabled

**Solution**:
1. Install MetaMask: https://metamask.io/
2. Enable extension in Chrome settings
3. Refresh page
4. Check: `window.ethereum !== undefined`

### ❌ Account connection fails

**Error**: `User rejected the request`

**Cause**: User clicked "Cancel" in MetaMask popup

**Solution**:
```bash
# Retry connection
# Ensure popup wasn't blocked
# Check browser permissions
```

### ❌ Wrong network selected

**Error**: `Wrong network` message appears

**Cause**: Not on Sepolia testnet

**Solution**:
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia Testnet"
4. If not available, click "Add Network"
5. Fill in details:
   - Name: Sepolia Testnet
   - RPC: https://sepolia.infura.io/v3/YOUR_KEY
   - Chain ID: 11155111
   - Symbol: ETH

### ❌ Insufficient balance

**Error**: `Insufficient funds for gas`

**Cause**: Not enough test ETH

**Solution**:
```bash
# Get more test ETH
# Go to https://sepoliafaucet.com/
# Connect MetaMask
# Request 0.5 ETH
# Wait for confirmation (1-2 minutes)

# Check balance
# Open MetaMask, should show Ξ value
```

### ❌ Transaction keeps failing

**Error**: Transaction rejected or fails consistently

**Solution**:
1. Clear MetaMask cache:
   - Settings → Advanced → Reset Account
   - Confirm the reset
2. Check gas price:
   - Edit gas settings if needed
   - Add 20% buffer
3. Try transaction again

### ❌ Locked/Seeded issue

**Error**: `MetaMask account is locked`

**Cause**: Session expired or MetaMask locked

**Solution**:
1. Open MetaMask
2. Unlock wallet with password
3. Or click wallet icon in browser toolbar
4. Refresh dApp

---

## Network Issues

### ❌ Can't connect to Sepolia

**Error**: `Failed to fetch` or network timeout

**Cause**: Infura endpoint down or wrong URL

**Solution**:
```bash
# Test Infura endpoint directly
curl https://sepolia.infura.io/v3/YOUR_KEY \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Try Alchemy endpoint instead
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Or QuickNode
SEPOLIA_RPC_URL=https://eth-sepolia.quiknode.pro/YOUR_KEY
```

### ❌ Slow transactions

**Error**: Transaction takes too long to confirm

**Cause**: Low gas price or network congestion

**Solution**:
```javascript
// Increase gas price
const gasPrice = await web3.eth.getGasPrice();
const increasedPrice = Math.ceil(gasPrice * 1.5); // 50% more

// Use in transaction
tx.gasPrice = increasedPrice;
```

### ❌ Nonce too high

**Error**: `Error: the tx doesn't have the correct nonce`

**Cause**: Previous transactions not confirmed

**Solution**:
1. Open MetaMask
2. Settings → Advanced → Reset Account
3. Confirm reset
4. Try transaction again

### ❌ Block explorer not loading

**Error**: Etherscan times out

**Cause**: Network congestion

**Solution**:
```bash
# Try alternate explorers
https://sepolia.etherscan.io/ (Official)
https://testnet.bscscan.com/ (BSCScan)

# Or check transaction with:
web3.eth.getTransactionReceipt(txHash)
```

---

## Performance Issues

### ❌ App runs slowly

**Cause**: Too many renders or large data sets

**Solution**:
```javascript
// Use React.memo for components
const Dashboard = React.memo(({ data }) => {...});

// Use useMemo for expensive calculations
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// Lazy load components
const Leaderboard = React.lazy(() => import('./Leaderboard'));
```

### ❌ Leaderboard loads slowly

**Cause**: Too many records

**Solution**:
```bash
# Implement pagination
# Get 50 records at a time:
GET /api/leaderboard/global?limit=50&offset=0
GET /api/leaderboard/global?limit=50&offset=50

# Implement caching
# Cache results for 5 minutes
```

### ❌ Contract interaction slow

**Cause**: Network delay

**Solution**:
```javascript
// Add timeout handling
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 30000)
);

try {
  await Promise.race([transaction, timeoutPromise]);
} catch (e) {
  if (e.message === 'Timeout') {
    // Handle timeout
  }
}
```

---

## Getting Help

### Where to Find Answers

1. **Check Logs**
   ```bash
   # Backend logs
   tail -f backend/server.js

   # Browser console (F12)
   # Look for red error messages
   ```

2. **Search Issues**
   - GitHub Issues
   - Stack Overflow
   - Ethereum Stack Exchange

3. **Check Documentation**
   - README.md
   - QUICKSTART.md
   - CONFIG.md
   - This file!

4. **Community Help**
   - Ethereum Discord
   - Reddit r/ethdev
   - Stack Exchange

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run backend

# Run frontend with React DevTools
npm run frontend

# Use Hardhat debug
npx hardhat run scripts/deploy.js --network sepolia --debug
```

---

**Still stuck? Review the error message carefully, check the relevant section above, and try the suggested solution.**

Most issues are due to:
1. Missing/wrong environment variables
2. Not enough test ETH
3. Wrong network selected
4. Port already in use
5. Outdated cache

Try these first! 🚀
