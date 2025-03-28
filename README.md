# Web3 Fitness Tracker

A decentralized fitness tracking application where users can stake crypto to compete in fitness challenges. Built with Next.js, Solana, and Firebase.

## Features

- 🔐 User Authentication with Firebase
- 💰 Solana Wallet Integration
- 🏃‍♂️ Google Fit Integration for Activity Tracking
- 🏆 Fitness Challenges with Crypto Staking
- 🏅 Real-time Leaderboards
- 🛡️ Anti-cheat Mechanisms

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Solana Wallet (Phantom)
- Firebase Account
- Google Cloud Project (for Google Fit API)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd web3-fitness-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable Authentication and Firestore.

4. Set up Google Fit API in Google Cloud Console.

5. Create a `.env.local` file in the root directory and add your configuration:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Fit API Configuration
NEXT_PUBLIC_GOOGLE_FIT_CLIENT_ID=your_google_fit_client_id
NEXT_PUBLIC_GOOGLE_FIT_API_KEY=your_google_fit_api_key
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── challenges/        # Challenges page
│   ├── profile/          # User profile page
│   └── page.tsx          # Home page
├── components/           # Reusable components
├── contexts/            # React contexts
└── lib/                 # Utility functions and configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   b c r y p t e x e  
 