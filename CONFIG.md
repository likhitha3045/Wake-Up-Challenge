# Configuration Guide

## Environment Variables

### Backend Configuration

```env
# Server
BACKEND_PORT=5000
NODE_ENV=development

# Database (optional)
MONGODB_URI=mongodb://localhost:27017/wakeup-challenge
DB_NAME=wakeup-challenge

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:3000

# Blockchain
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0x... (your wallet private key)
ETHERSCAN_API_KEY=...

# Oracle
ORACLE_API_KEY=your_oracle_api_key
ORACLE_ENDPOINT=https://api.oracle-provider.com
```

### Frontend Configuration

```env
# Backend Connection
REACT_APP_BACKEND_URL=http://localhost:5000

# Smart Contract
REACT_APP_CONTRACT_ADDRESS=0x...
REACT_APP_NETWORK_ID=11155111  # Sepolia chain ID

# Features
REACT_APP_ENABLE_SOCIAL_CHALLENGES=true
REACT_APP_ENABLE_ORACLE=true
```

## Hardhat Configuration

The project includes a configured `hardhat.config.js` for:
- Sepolia testnet deployment
- Local testing network
- Contract compilation
- Gas reporting
- Contract verification

Key networks:
- **hardhat**: Local testing (chainId: 31337)
- **sepolia**: Testnet (chainId: 11155111)
- **mainnet**: Production (chainId: 1)

## Smart Contract Configuration

### Default Challenge Parameters

```javascript
// In WakeUpChallenge.sol
MAX_DURATION: 365 days
MIN_DEPOSIT: 0.001 ETH
DEFAULT_PENALTY_MULTIPLIER: 1.0 (100% burned)
```

## API Rate Limiting

Backend implements rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per user

Configure in `backend/server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Database Schema (MongoDB)

### User Collection
```javascript
{
  _id: ObjectId,
  walletAddress: String (unique),
  email: String,
  displayName: String,
  createdAt: Date,
  updatedAt: Date,
  stats: {
    totalChallenges: Number,
    completedChallenges: Number,
    failedChallenges: Number,
    totalDeposited: Number,
    totalBurned: Number,
    successRate: Number
  }
}
```

### Challenge Collection
```javascript
{
  _id: ObjectId,
  blockchainId: Number,
  user: String (walletAddress),
  depositAmount: Number,
  wakeUpTime: Number,
  duration: Number,
  startDate: Date,
  endDate: Date,
  status: String (ACTIVE|COMPLETED|FAILED),
  wakeUpDays: [Date],
  transactionHash: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Oracle Data Collection
```javascript
{
  _id: ObjectId,
  user: String,
  provider: String (fitbit|strava|etc),
  activityType: String,
  timestamp: Date,
  verified: Boolean,
  confidence: Number,
  data: Object,
  createdAt: Date
}
```

## Feature Flags

Enable/disable features in `backend/config.js`:

```javascript
const FEATURES = {
  SOCIAL_CHALLENGES: true,
  ORACLE_INTEGRATION: true,
  LEADERBOARD: true,
  DEPOSITS_ENABLED: true,
  AUTO_REFUND: true,
};
```

## Gas Configuration

Adjust gas limits in `hardhat.config.js`:

```javascript
{
  gasPrice: "auto", // Let network decide
  // Or set manually:
  // gasPrice: ethers.utils.parseUnits("20", "gwei"),
}
```

## Logging Configuration

Configure logging level in `backend/server.js`:

```javascript
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
// Options: error, warn, info, debug
```

## CORS Configuration

Modify CORS settings in `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## SSL/TLS Configuration

For production, enable HTTPS:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

https.createServer(options, app).listen(443);
```

## Performance Tuning

### Backend
- Connection pooling for database
- Redis caching for leaderboard
- Compression middleware

```javascript
app.use(compression());
app.use(bodyParser.json({ limit: '10mb' }));
```

### Frontend
- Code splitting
- Lazy loading components
- Image optimization
- Minification

```javascript
const Dashboard = React.lazy(() => import('./components/Dashboard'));
```

### Smart Contract
- Batch operations
- Optimize storage
- Use libraries (OpenZeppelin)

## Testing Configuration

Jest configuration in `frontend/package.json`:

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "collectCoverageFrom": ["src/**/*.{js,jsx}"]
  }
}
```

Hardhat testing:

```bash
npm run contracts:test
npx hardhat test test/WakeUpChallenge.test.js --network hardhat
```

## Security Configuration

### Secret Management
- Never commit `.env` to git
- Use `.env.example` for template
- Rotate secrets regularly
- Use managed secrets service (AWS Secrets, HashiCorp Vault)

### Input Validation
- Validate all user inputs
- Sanitize database queries
- Use Web3.js validators

### Smart Contract Security
- Use OpenZeppelin contracts
- Implement checks-effects-interactions pattern
- Avoid re-entrancy vulnerabilities
- Use SafeMath (automatic in Solidity 0.8+)

## Backup Configuration

Auto-backup daily:

```bash
# Add to crontab
0 2 * * * /home/user/backup-wakeup.sh
```

Script content:
```bash
#!/bin/bash
mongodump --uri "mongodb+srv://..." --out /backups/$(date +%Y%m%d)
```

## Monitoring Configuration

### Sentry Setup
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Datadog Setup
```javascript
const StatsD = require('node-statsd').StatsD;
const client = new StatsD();
client.increment('request.count');
```

---

**For more details, see the main README.md and DEPLOYMENT.md**
