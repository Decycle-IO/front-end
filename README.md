# Decycle - Gamified Recycling Ecosystem

This repository contains three interconnected applications:

1. **Homepage** (`/`) - Marketing landing page showcasing the Decycle ecosystem
2. **Token TGE Page** (`/token`) - Token sale dApp for $TRASH token distribution
3. **Cannes dApp** (`/cannes`) - ETHGlobal Cannes-specific gamified recycling system

## Quick Start

### Prerequisites
- Node.js (v20 or higher)
- npm
- Foundry (for smart contract development)

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/decycle-io/front-end
cd front-end
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Smart Contract Setup

```bash
# Navigate to contracts directory
cd contracts

# Install Foundry dependencies
forge install

# Copy environment template
cp .env.example .env
# Add your PRIVATE_KEY to .env

# Deploy contracts (Avalanche Fuji Testnet)
./deploy.sh
```

## Project Structure

```
homepage/
├── src/
│   ├── components/
│   │   ├── home/           # Homepage components
│   │   ├── token/          # Token sale components  
│   │   ├── cannes/         # Cannes dApp components
│   │   ├── layout/         # Shared layout components
│   │   └── ui/             # Reusable UI components
│   ├── pages/
│   │   ├── Home.tsx        # Homepage (/)
│   │   ├── Token.tsx       # Token sale (/token)
│   │   ├── Cannes.tsx      # Cannes dApp (/cannes)
│   │   └── Dashboard.tsx   # Main dApp (placeholder routes)
│   ├── hooks/              # Custom React hooks
│   │   ├── cannes/         # Cannes-specific hooks
│   │   ├── contracts/      # Contract interaction hooks
│   │   └── web3/           # Web3 utility hooks
│   ├── config/
│   │   ├── contracts.ts    # Contract ABIs and addresses
│   │   └── chains.ts       # Blockchain configurations
│   ├── providers/          # React context providers
│   └── services/           # External service integrations
├── contracts/
│   ├── src/
│   │   ├── core/           # Main contract implementations
│   │   ├── interfaces/     # Contract interfaces
│   │   └── cannes/         # Cannes-specific contracts (TBD)
│   ├── script/             # Deployment scripts
│   └── deploy.sh           # Automated deployment script
├── contracts.config.ts     # Auto-generated contract addresses
└── public/                 # Static assets
```

## Development Status

### Homepage (`/`)
**Status**: Mostly Complete - Needs Polish & Assets

**Completed**:
- Responsive design and layout
- All sections implemented (Hero, Problem/Solution, How It Works, etc.)
- Interactive animations and transitions
- Mobile optimization

**Pending**:
- **Hero video/animation** - Replace green placeholder box in header
- **6 step images** for "How It Works" section:
  1. Stakers Deploy Smart Cans
  2. Public Deposits Recyclables  
  3. AI Sorts Materials
  4. Earn $TRASH Tokens
  5. Build Virtual Ecosystem
  6. Create Real-World Impact
- **Final polish pass** - Review copy, spacing, and interactions

### Token Sale Page (`/token`)
**Status**: Needs Work - Potential Issues

**Completed**:
- UI components and layout
- Purchase form and wallet integration
- Contract integration hooks

**Issues**:
- **Contract bugs** - Untested functionality
- **Testing needed** - Full end-to-end testing required
- **Code review** - Security and functionality audit needed

**Current Configuration**:
- Hardcoded for Avalanche Fuji Testnet (chainId: 43113)
- TrashGenesis contract: `0xB4b773cDd37FDe0D431a202378Cc54b388ac1776`

### Cannes dApp (`/cannes`)
**Status**: In Development

**Completed**:
- UI framework and components
- Game dashboard layout
- Leaderboard and founder tracking
- Frontend hooks and state management

**Pending**:
- **Smart contracts** - To be created by Atlas by the 30th
- **Contract integration** - Connect UI to deployed contracts
- **Game mechanics** - Complete gamification features
- **Testing** - Full functionality testing

## Configuration

### Environment Variables
Create `.env` in the `contracts/` directory:
```bash
PRIVATE_KEY=your_private_key_here
```

### Network Configuration
Currently hardcoded for Avalanche Fuji Testnet. To change networks:

1. Update `contracts.config.ts` networkConfig
2. Update RPC URL in `deploy.sh`
3. Update contract addresses after deployment

## TODOs

- [ ] **Homepage Assets**: Add hero video and 6 step images
- [ ] **Token Contract Testing**: Full security audit and testing
- [ ] **Cannes Contracts**: Create and deploy by the 30th (Atlas)
- [ ] **Homepage Polish**: Final review and optimization
- [ ] **Token Page Debugging**: Fix contract interaction issues
- [ ] **Cannes Integration**: Connect UI to contracts when ready

## Game Mechanics (Cannes dApp)

The Cannes dApp implements a gamified recycling system with:

- **Founder System**: Special roles for event organizers
- **Leaderboards**: Competitive recycling tracking
- **Bin Purchasing**: Stake-to-deploy mechanism
- **Real-time Activity**: Live recycling feed
- **Token Rewards**: $TRASH token distribution

*Note: Smart contracts for these features are pending development.*

## Key Contracts

### Core Contracts (Deployed)
- **TrashToken**: ERC20 token with minting/burning
- **TrashGenesis**: Token sale and distribution

### Cannes Contracts (Pending)
- **CannesGame**: Event-specific game logic
- **CannesLeaderboard**: Competition tracking
- **CannesRewards**: Event reward distribution
