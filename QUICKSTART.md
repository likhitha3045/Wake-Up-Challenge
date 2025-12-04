# 🚀 Quick Start Guide - Wake-Up Challenge DApp

## Prerequisites
- Node.js 16+ installed
- MetaMask browser extension
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

## Step 1: Initial Setup

### 1.1 Install Dependencies
```bash
# Install all dependencies (root + frontend)
npm run install-all
```

### 1.2 Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with:
- `SEPOLIA_RPC_URL`: Your Infura key URL
- `PRIVATE_KEY`: Your wallet private key (with 0x prefix)
- `ETHERSCAN_API_KEY`: For contract verification (optional)

### 1.3 Get Test ETH
1. Go to [Sepolia Faucet](https://sepoliafaucet.com/)
2. Connect your MetaMask wallet
3. Request test ETH (you'll receive 0.5 ETH)

## Step 2: Deploy Smart Contract

### 2.1 Compile Contract
```bash
npm run contracts:compile
```

### 2.2 Deploy to Sepolia
```bash
npm run contracts:deploy
```

**Important**: Save the contract address from the output!

### 2.3 Update Frontend Config
1. Copy the contract address from deployment output
2. Update `.env`:
   ```
   REACT_APP_CONTRACT_ADDRESS=0x... (paste your address here)
   ```
3. Update `frontend/src/config.js`:
   ```javascript
   WAKEUP_CONTRACT: '0x...', // your address
   ```

## Step 3: Run Locally

### Option A: Run Everything Together
```bash
npm start
```
- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:3000`

### Option B: Run Separately (for development)

Terminal 1 - Backend:
```bash
npm run backend
```

Terminal 2 - Frontend:
```bash
npm run frontend
```

## Step 4: Test the Application

### 4.1 Connect MetaMask
1. Open `http://localhost:3000`
2. Click "Connect MetaMask"
3. Approve the connection
4. Ensure you're on Sepolia testnet

### 4.2 Create a Challenge
1. Click "New Challenge"
2. Set deposit: `0.1` ETH
3. Set wake-up time: `08:00` UTC
4. Set duration: `7` days
5. Click "Create Challenge"
6. Confirm MetaMask transaction

### 4.3 Confirm Wake-Up
1. Go to Dashboard
2. Click "Confirm Wake-Up"
3. Confirm MetaMask transaction

### 4.4 View Leaderboard
1. Click "Leaderboard"
2. See your ranking

## Step 5: Testing

### Run Smart Contract Tests
```bash
npm run contracts:test
```

### Specific Test File
```bash
npx hardhat test test/WakeUpChallenge.test.js
```

## Common Issues & Solutions

### ❌ "MetaMask not connected"
- Ensure MetaMask is installed
- Check if popup was blocked
- Try refreshing the page

### ❌ "Wrong network"
- Switch to Sepolia in MetaMask
- If not available, it will auto-add

### ❌ "Insufficient gas"
- Increase gas limit in MetaMask
- Check Sepolia ETH balance
- Get more test ETH from faucet

### ❌ "Contract not found"
- Verify contract address in `.env`
- Check if contract was deployed
- Run `npm run contracts:deploy` again

### ❌ "Backend not connecting"
- Check if backend is running
- Verify `BACKEND_PORT=5000` in `.env`
- Check CORS in `backend/server.js`

## 📊 Next Steps

1. **Deploy More Features**:
   - Link fitness apps (oracle integration)
   - Create social challenges
   - Add more leaderboard categories

2. **Production Deployment**:
   - Deploy contract to mainnet
   - Host frontend on Vercel/Netlify
   - Set up production backend

3. **Enhance Security**:
   - Add input validation
   - Implement rate limiting
   - Add user authentication

## 🔗 Useful Links

- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Explorer**: https://sepolia.etherscan.io/
- **MetaMask Docs**: https://docs.metamask.io/
- **Hardhat Docs**: https://hardhat.org/docs
- **Web3.js Docs**: https://web3js.readthedocs.io/

## 💡 Tips

- Always use test ETH on Sepolia before mainnet
- Keep your private key secure (never share it)
- Test thoroughly before mainnet deployment
- Monitor gas prices and optimize contracts
- Back up important wallet data

## ❓ Need Help?

Check the main `README.md` for:
- Complete API documentation
- Architecture details
- Advanced configurations
- Troubleshooting guide

---

**Ready to build? Start with Step 1!** 🚀
