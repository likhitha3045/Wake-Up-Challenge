# 🚀 Deployment Guide - Wake-Up Challenge

## Table of Contents
1. [Local Development](#local-development)
2. [Sepolia Testnet Deployment](#sepolia-testnet-deployment)
3. [Mainnet Deployment](#mainnet-deployment)
4. [Production Setup](#production-setup)
5. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Local Development

### Prerequisites
```bash
Node.js 16+
npm or yarn
MetaMask (browser extension)
Git
```

### Setup

1. **Clone and Install**
```bash
cd btaproject
npm install
npm run install-all
```

2. **Compile Contracts**
```bash
npm run contracts:compile
```

3. **Run Tests**
```bash
npm run contracts:test
```

4. **Start Local Network** (in separate terminal)
```bash
npx hardhat node
```

5. **Deploy to Local Network**
```bash
npx hardhat run scripts/deploy.js --network hardhat
```

6. **Run Backend**
```bash
npm run backend
```

7. **Run Frontend** (in separate terminal)
```bash
npm run frontend
```

Visit `http://localhost:3000`

---

## Sepolia Testnet Deployment

### Prerequisites
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))
- Infura API key ([get free at infura.io](https://infura.io/))
- Etherscan API key ([get free at etherscan.io](https://etherscan.io/apis))

### Step 1: Setup Environment

```bash
# Copy environment file
cp .env.example .env
```

Edit `.env`:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
BACKEND_PORT=5000
```

### Step 2: Fund Account

1. Go to [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH (0.5 ETH)
4. Wait for confirmation

### Step 3: Deploy Contract

```bash
npm run contracts:deploy
```

**Output:**
```
✅ WakeUpChallenge deployed to: 0x...
✅ Contract ABI saved to frontend/src/contracts/
```

### Step 4: Update Configuration

Copy the contract address from deployment output and update:

**`.env`:**
```
REACT_APP_CONTRACT_ADDRESS=0x... (your deployed address)
```

**`frontend/src/config.js`:**
```javascript
WAKEUP_CONTRACT: '0x...', // your deployed address
```

### Step 5: Start Services

```bash
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend
npm run frontend
```

### Step 6: Test on Sepolia

1. Open `http://localhost:3000`
2. Click "Connect MetaMask"
3. Ensure you're on Sepolia testnet
4. Create a challenge
5. Confirm transactions in MetaMask
6. View on [Sepolia Etherscan](https://sepolia.etherscan.io/)

---

## Mainnet Deployment

### ⚠️ Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Contract audited (recommended for large projects)
- [ ] Frontend tested on Sepolia
- [ ] All environment variables configured
- [ ] Private key secure (never share)
- [ ] Sufficient ETH for gas fees
- [ ] Backend infrastructure ready

### Step 1: Mainnet Configuration

Update `hardhat.config.js`:

```javascript
module.exports = {
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1,
    }
  }
}
```

Update `.env`:
```
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0x...
```

### Step 2: Final Testing

```bash
# Run all tests
npm run contracts:test

# Verify contract on testnet first
npm run contracts:deploy --network sepolia
```

### Step 3: Deploy to Mainnet

```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet
```

### Step 4: Verify Contract

```bash
npx hardhat verify DEPLOYED_ADDRESS --network mainnet
```

### Step 5: Update Production Config

Update `frontend/.env.production`:
```
REACT_APP_CONTRACT_ADDRESS=0x... (mainnet address)
REACT_APP_NETWORK_ID=1
REACT_APP_BACKEND_URL=https://api.wakeupchallenge.com
```

---

## Production Setup

### Backend Deployment

#### Option 1: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY backend ./backend
COPY . .

EXPOSE 5000
CMD ["npm", "run", "backend"]
```

Build and deploy:
```bash
docker build -t wakeup-challenge-backend .
docker run -p 5000:5000 --env-file .env wakeup-challenge-backend
```

#### Option 2: Cloud Platforms

**Heroku:**
```bash
heroku create wakeup-challenge-backend
heroku config:set BACKEND_PORT=5000
heroku config:set MONGODB_URI=...
git push heroku main
```

**AWS Lambda:**
```bash
# Requires serverless framework
serverless deploy
```

**DigitalOcean:**
```bash
# Deploy using App Platform
doctl apps create --spec app.yaml
```

### Frontend Deployment

#### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Environment variables in Vercel dashboard:
```
REACT_APP_BACKEND_URL=https://api.wakeupchallenge.com
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_NETWORK_ID=1
```

#### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages

```bash
npm run build
npm install -g gh-pages
gh-pages -d frontend/build
```

### Database Setup (Optional)

For production, use MongoDB:

```bash
# Local MongoDB
mongod

# Or MongoDB Atlas (cloud)
# Create cluster at https://www.mongodb.com/cloud/atlas
```

Update `.env`:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
```

### Environment Variables (Production)

Create `.env.production`:
```
# Backend
BACKEND_PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...

# Blockchain
MAINNET_RPC_URL=https://mainnet.infura.io/v3/...
ETHERSCAN_API_KEY=...

# Frontend
REACT_APP_BACKEND_URL=https://api.wakeupchallenge.com
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_NETWORK_ID=1
```

---

## Monitoring & Maintenance

### Health Checks

**Backend Health:**
```bash
curl https://api.wakeupchallenge.com/api/health
```

**Contract Status:**
```bash
# Check on Etherscan
https://etherscan.io/address/0x...
```

### Logging

Configure Winston logger in `backend/server.js`:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Monitoring Services

- **Sentry** (Error tracking): [sentry.io](https://sentry.io/)
- **Datadog** (Performance): [datadoghq.com](https://www.datadoghq.com/)
- **PagerDuty** (Alerts): [pagerduty.com](https://www.pagerduty.com/)
- **UptimeRobot** (Uptime): [uptimerobot.com](https://uptimerobot.com/)

### Backup & Recovery

**Database Backups:**
```bash
# MongoDB backup
mongodump --uri "mongodb+srv://..." --out ./backup

# MongoDB restore
mongorestore --uri "mongodb+srv://..." ./backup
```

**Contract Data:**
```bash
# Export data from blockchain
# Use Etherscan API or Web3.js
```

### Security Updates

1. Keep dependencies updated
```bash
npm audit
npm update
npm audit fix
```

2. Rotate secrets regularly

3. Monitor contract for vulnerabilities

4. Regular security audits

### Scaling

For high traffic:

1. **Load Balancing**
   - Use Nginx or HAProxy
   - Multiple backend instances

2. **Caching**
   - Redis for sessions
   - CloudFlare for CDN

3. **Database**
   - Database replication
   - Read replicas

4. **Contract Optimization**
   - Batch operations
   - Off-chain computation

---

## Troubleshooting Deployment

### Contract Won't Deploy
```bash
# Check balance
ethers.provider.getBalance(account)

# Check RPC endpoint
curl SEPOLIA_RPC_URL -X POST

# Check gas price
ethers.provider.getGasPrice()
```

### Frontend Can't Connect
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check CORS settings
# Check frontend env variables
# Clear browser cache
```

### MetaMask Issues
- Clear MetaMask cache
- Reset account
- Re-add network
- Check contract address

### Transaction Failures
- Insufficient gas
- Insufficient balance
- Contract error
- Network congestion

---

## Rollback Procedure

If something goes wrong:

1. **Frontend**: Redeploy previous version
2. **Backend**: Restart with previous code
3. **Contract**: Deploy new version (can't change deployed contract)

---

## Support

For deployment issues:
- Check logs
- Review error messages
- Search documentation
- Contact support

---

**Deployment complete! 🎉**

Monitor your dApp and keep it updated for best performance.
