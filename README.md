# Brand Partner Dashboard

A modern React dashboard application for brands and partners to manage their offers, content, and campaigns.

## Features

- 🗺️ Location-based offer management with Google Maps integration
- 📸 Content upload system for banners, logos, and promotional images
- 📊 Real-time analytics tracking (impressions, clicks, conversions, redemptions)
- 📅 Campaign scheduling with time-sensitive offers
- 💳 Subscription and billing management
- 🎫 Support system with live chat and ticket management

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Firebase for authentication
- Google Maps API for location-based features
- Recharts for analytics visualization
- Stripe for payment processing
- Socket.io for real-time chat

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key
- Firebase project credentials
- Stripe account (for billing features)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd brand-partner-web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/        # Reusable UI components
├── contexts/         # React context providers
├── pages/           # Main application pages
├── types/           # TypeScript type definitions
└── utils/           # Helper functions and utilities
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
