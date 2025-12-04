# Wake-Up Challenge - Smart Contract-Based Alarm System

A decentralized wake-up challenge platform where users deposit funds and are incentivized to wake up on time. Complete all daily wake-ups to get your deposit back, or lose it to the burn address. Features social challenges, oracle-based activity verification, and global leaderboards.

## 🎯 Features

### Core Features
- **Deposit & Commitment**: Users deposit ETH as motivation
- **Daily Wake-Up Confirmation**: Confirm you woke up before your set time
- **Smart Rewards/Penalties**: 
  - ✅ Complete all days → Get deposit back
  - ❌ Miss any day → Deposit burned
- **Oracle Integration**: Verify wake-ups via decentralized oracles (Fitbit, Strava, GPS, etc.)
- **Social Challenges**: Challenge friends and compete together
- **Global Leaderboard**: Compete with other users
- **Transaction Tracking**: All interactions recorded on Sepolia testnet

### Technical Features
- ✅ MetaMask integration
- ✅ Sepolia testnet support
- ✅ Full-stack single-server architecture
- ✅ Responsive UI (Mobile-friendly)
- ✅ Unit testing with Hardhat
- ✅ Deployment scripts included

## 📋 Project Structure

```
wake-up-challenge/
├── contracts/              # Solidity smart contracts
│   └── WakeUpChallenge.sol
├── backend/                # Node.js/Express server
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js        # User authentication
│   │   ├── challenge.js   # Challenge management
│   │   ├── oracle.js      # Oracle integration
│   │   ├── leaderboard.js # Leaderboard data
│   │   └── user.js        # User profiles
├── frontend/              # React UI
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       └── components/
│           ├── MetaMaskConnect.js
│           ├── Dashboard.js
│           ├── CreateChallenge.js
│           ├── Leaderboard.js
│           └── Navigation.js
├── scripts/               # Deployment scripts
│   └── deploy.js
├── test/                  # Smart contract tests
│   └── WakeUpChallenge.test.js
├── hardhat.config.js      # Hardhat configuration
├── package.json           # Project dependencies
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- MetaMask browser extension
- Some Sepolia testnet ETH (get from faucet)

### Installation

1. **Clone the repository**
```bash
cd btaproject
```

2. **Install root dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Setup environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add:
```
# Backend
BACKEND_PORT=5000

# Blockchain
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Frontend
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=0x... (deploy first to get this)
REACT_APP_NETWORK_ID=11155111
```

### Setup Sepolia Testnet

1. **Get test ETH**:
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Connect MetaMask wallet
   - Request test ETH

2. **Add Sepolia network to MetaMask**:
   - Network Name: Sepolia Testnet
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
   - Chain ID: `11155111`
   - Currency: ETH

### Compile Smart Contracts

```bash
npm run contracts:compile
```

### Run Tests

```bash
npm run contracts:test
```

### Deploy Contracts

```bash
npm run contracts:deploy
```

This will:
1. Deploy `WakeUpChallenge` contract to Sepolia
2. Save contract address and ABI to frontend
3. Attempt Etherscan verification

**Save the contract address** - you'll need it in frontend environment variables.

### Start Backend Server

```bash
npm run backend
```

Server runs on `http://localhost:5000`

### Start Frontend (in new terminal)

```bash
npm run frontend
```

Frontend runs on `http://localhost:3000`

### Run Everything Together

```bash
npm start
```

This runs backend and frontend concurrently.

## 📱 Using the Application

### 1. Connect Wallet
- Click "Connect MetaMask"
- Approve connection request
- Ensure you're on Sepolia testnet

### 2. Create a Challenge
- Navigate to "New Challenge"
- Set parameters:
  - **Deposit Amount**: How much ETH to stake (e.g., 0.1)
  - **Wake-Up Time**: Daily target time (UTC)
  - **Duration**: Number of days (1-365)
- Confirm transaction in MetaMask
- Transaction recorded on blockchain

### 3. Confirm Daily Wake-Ups
- Go to Dashboard
- Click "Confirm Wake-Up" before your set time each day
- Oracle verifies your activity
- Progress tracked on blockchain

### 4. Challenge Completion
- When challenge ends, click "Finalize"
- If all days completed: Deposit returned ✅
- If any day missed: Deposit burned 🔥
- Results saved to smart contract

### 5. Social Challenges
- Invite friends via wallet addresses
- Compete for highest success rate
- Winner receives all deposits
- Track on leaderboard

### 6. View Leaderboard
- See global rankings
- Compare success rates
- View friend challenges
- Sorted by score/achievements

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify user
- `PUT /api/auth/profile` - Update profile

### Challenges
- `GET /api/challenge/user/:walletAddress` - Get user challenges
- `GET /api/challenge/:challengeId` - Get challenge details
- `POST /api/challenge/create` - Create new challenge
- `POST /api/challenge/:challengeId/wakeup` - Confirm wake-up
- `POST /api/challenge/:challengeId/finalize` - Finalize challenge
- `GET /api/challenge/stats/:walletAddress` - Get user stats

### Oracle
- `POST /api/oracle/verify-activity` - Verify activity
- `GET /api/oracle/activity/:walletAddress` - Get activity history
- `POST /api/oracle/link-fitness-app` - Link fitness provider
- `POST /api/oracle/sync-activity` - Sync fitness data
- `GET /api/oracle/config` - Get oracle config

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/rank/:walletAddress` - User rank
- `GET /api/leaderboard/category/:category` - Category leaderboard
- `GET /api/leaderboard/social-challenges/:id` - Social challenge leaderboard

### User
- `GET /api/user/:walletAddress` - Get user profile
- `PUT /api/user/:walletAddress` - Update profile
- `GET /api/user/:walletAddress/friends` - Get friends
- `POST /api/user/:walletAddress/friends/add` - Add friend

## 🔐 Smart Contract Functions

### Create Challenge
```solidity
function createChallenge(
    uint256 _depositAmount,
    uint256 _wakeUpTime,
    uint256 _durationDays
) external payable returns (uint256)
```

### Confirm Wake-Up
```solidity
function confirmWakeUp(uint256 _challengeId) external
```

### Finalize Challenge
```solidity
function finalizeChallenge(uint256 _challengeId) external
```

### Social Challenge
```solidity
function createSocialChallenge(
    address[] calldata _participants,
    uint256 _depositAmount,
    uint256 _wakeUpTime,
    uint256 _durationDays
) external payable
```

## 📊 Data Models

### Challenge
```javascript
{
  id: uint256,
  user: address,
  depositAmount: uint256,
  wakeUpTime: uint256 (seconds),
  startDate: uint256 (timestamp),
  endDate: uint256 (timestamp),
  status: enum (ACTIVE, COMPLETED, FAILED, CANCELLED),
  daysCompleted: uint256,
  totalDays: uint256,
  wokenUpToday: mapping (day => bool),
  withdrawn: bool
}
```

### Social Challenge
```javascript
{
  id: uint256,
  participants: address[],
  depositAmount: uint256,
  wakeUpTime: uint256,
  startDate: uint256,
  endDate: uint256,
  winner: address,
  completed: bool,
  successDays: mapping (address => uint256)
}
```

## 🧪 Testing

### Run Unit Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test -- --coverage
```

### Specific Test File
```bash
npx hardhat test test/WakeUpChallenge.test.js
```

## 🚢 Deployment

### Testnet Deployment (Sepolia)
```bash
npm run contracts:deploy
```

### Verify on Etherscan
Automatic verification runs after deployment. Manual:
```bash
npx hardhat verify DEPLOYED_ADDRESS --network sepolia
```

### Mainnet Deployment (Future)
Update `hardhat.config.js` with mainnet RPC and private key, then:
```bash
npx hardhat run scripts/deploy.js --network mainnet
```

## 🔌 Oracle Integration

### Supported Providers
- **Fitbit**: Activity tracking
- **Strava**: Running/cycling verification
- **Apple Health**: iOS health data
- **Google Fit**: Android health data
- **Oura Ring**: Sleep tracking
- **Garmin**: Activity/sleep tracking

### How It Works
1. User links fitness app via OAuth
2. Oracle syncs activity data daily
3. Verifies wake-up time from activity
4. Confirms via smart contract
5. Prevents gaming the system

### Mock Oracle (Development)
For testing, oracle uses mock verification:
```javascript
POST /api/oracle/verify-activity
{
  "walletAddress": "0x...",
  "activityType": "wake-up-confirmation",
  "timestamp": "2024-01-01T08:30:00Z"
}
```

## 🏗️ Architecture

### Backend Architecture
```
Express Server (Single Port: 5000)
├── Authentication Routes
├── Challenge Routes
├── Oracle Routes
├── Leaderboard Routes
└── User Routes
```

### Frontend Architecture
```
React App (Port: 3000)
├── MetaMask Connector
├── Dashboard
├── Create Challenge
├── Leaderboard
└── Navigation
```

### Blockchain Layer
```
Ethereum Sepolia Testnet
└── WakeUpChallenge Contract
    ├── Challenge Management
    ├── Deposit Handling
    ├── Social Challenges
    └── Leaderboard Data
```

## 💡 Key Features Explained

### Deposit Mechanism
- Users send ETH to smart contract
- Contract holds funds in escrow
- Smart contract validates transactions

### Wake-Up Verification
- Users must confirm before set time
- Oracle verifies from fitness apps
- Blockchain records confirmation
- Cannot confirm retroactively

### Penalty System
- Miss 1 day → Deposit burned
- Burned funds go to zero address
- No refunds possible
- Final check at challenge end date

### Social Challenges
- Multiple users can join
- All must reach set time daily
- Winner with most days completed gets all deposits
- Ties handled by earlier confirmation time

### Leaderboard
- Ranked by total score
- Score = (successful challenges × 100) + (total wake-ups)
- Updated real-time
- Filters by category

## 🐛 Troubleshooting

### MetaMask Connection Issues
- Ensure MetaMask is installed
- Check if Sepolia network is added
- Try refreshing page
- Check browser console for errors

### Contract Deployment Fails
- Verify Sepolia RPC URL is valid
- Check private key format (with 0x)
- Ensure account has Sepolia ETH
- Check Etherscan API key

### Transactions Failing
- Insufficient gas (increase gas limit)
- Insufficient balance (get testnet ETH)
- Contract not deployed (deploy first)
- Wrong network (switch to Sepolia)

### Backend Not Connecting
- Ensure port 5000 is free
- Check `BACKEND_PORT` in .env
- Verify frontend URL in CORS config
- Check server logs for errors

## 📈 Future Enhancements

- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] NFT badges for achievements
- [ ] Staking for higher rewards
- [ ] AI-powered predictions
- [ ] Mobile app (React Native)
- [ ] Advanced oracle verification
- [ ] Community governance
- [ ] Premium features/subscriptions
- [ ] Referral program
- [ ] Integration with more fitness apps

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For issues and questions:
- GitHub Issues: [Report bugs](../../issues)
- Email: support@wakeupchallenge.xyz
- Discord: [Join community](https://discord.gg/...)

## 🙏 Acknowledgments

- OpenZeppelin for security libraries
- Hardhat for development framework
- Web3.js for Ethereum interaction
- React for UI framework
- Sepolia team for testnet

---

**Made with ❤️ for early risers everywhere**

Start your wake-up challenge today! 🚀
