#!/bin/bash
# Setup script for Wake-Up Challenge

echo "🚀 Setting up Wake-Up Challenge DApp..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Installing dependencies...${NC}"
npm install

echo -e "${BLUE}Step 2: Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

echo -e "${BLUE}Step 3: Creating environment file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env with your configuration${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo -e "${BLUE}Step 4: Compiling smart contracts...${NC}"
npm run contracts:compile

echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit .env with your Sepolia RPC URL and private key"
echo "2. Get test ETH from https://sepoliafaucet.com/"
echo "3. Deploy: npm run contracts:deploy"
echo "4. Run: npm start"
echo ""
