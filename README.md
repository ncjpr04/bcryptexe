# Fitness Challenges App with Solana Integration

A modern fitness application that allows users to create and join fitness challenges with monetary rewards, powered by Solana blockchain for secure handling of entry fees and prize distribution.

## Features

- **Authentication**: Login with Google OAuth
- **Challenge Creation**: Create fitness challenges with goals, deadlines, and prize structures
- **Solana Integration**: Secure handling of entry fees and prize distribution using Solana blockchain
- **Fitness Metrics Tracking**: Track steps, distance, calories, and workouts
- **Google Fit Integration**: Connect with Google Fit to import fitness data
- **Firebase Realtime Database**: Real-time updates and data synchronization
- **Leaderboards**: Track your progress against other participants

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Realtime Database)
- **Blockchain**: Solana (for handling payments and smart contracts)
- **Smart Contract**: Anchor framework, Rust
- **Authentication**: Google OAuth
- **Fitness Integration**: Google Fit API

## Smart Contract Architecture

The Solana smart contract is built using the Anchor framework and handles:

- **Challenge Creation**: Initialize new challenges with details like entry fee, prize pool, and deadlines
- **Joining Challenges**: Join challenges by paying entry fees, which are added to the prize pool
- **Challenge Completion**: Mark challenges as completed and determine winners
- **Prize Distribution**: Distribute rewards to winners based on their ranking
- **Challenge Cancellation**: Cancel challenges and handle refunds if needed

### Smart Contract Components

- **Challenge Account**: Stores challenge details like ID, title, entry fee, prize pool, etc.
- **Participant Account**: Tracks participants and their status in a challenge
- **Events**: Emit events for off-chain integration with Firebase

## Getting Started

### Prerequisites

- Node.js and npm installed
- Solana CLI tools installed
- Anchor framework installed
- Phantom wallet or another Solana wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fitness-challenges-app.git
   cd fitness-challenges-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Edit the `.env.local` file with your Firebase and Solana configuration.

4. Deploy the Solana contract:
   ```
   node deploy.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Solana Smart Contract Development

### Build the Smart Contract

```bash
anchor build
```

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

### Run Tests

```bash
anchor test
```

## Project Structure

```
.
├── programs/                # Solana smart contracts
│   └── fitness_challenges/  # Main contract code
│       └── src/             # Rust source code
│           └── lib.rs       # Contract implementation
├── src/                     # Next.js application code
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── contexts/            # React contexts (Auth, etc.)
│   ├── lib/                 # Utility functions and services
│   │   ├── firebase.ts      # Firebase configuration
│   │   ├── solanaClient.ts  # Solana client for frontend
│   │   └── userService.ts   # User management service
│   └── types/               # TypeScript type definitions
├── tests/                   # Smart contract tests
│   └── fitness_challenges.ts # Test file for the contract
├── Anchor.toml              # Anchor configuration
├── README.md                # Project documentation
└── package.json             # Node.js dependencies
```

## Interacting with the Solana Contract

The application provides a user-friendly interface for interacting with the Solana blockchain:

1. **Connect Wallet**: Connect your Phantom wallet to join challenges
2. **Create Challenge**: Set up a challenge with an entry fee and prize structure
3. **Join Challenge**: Pay the entry fee to join a challenge
4. **Track Progress**: Update your progress in active challenges
5. **Claim Rewards**: Winners can claim rewards after challenge completion

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   b c r y p t e x e 
 
 