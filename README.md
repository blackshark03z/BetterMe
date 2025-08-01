# BetterMe - Wellness Transformation App

A comprehensive mobile application for fitness tracking, nutrition management, and progress monitoring built with React Native, Expo, and Supabase.

## Features

- **Authentication**: Secure user registration and login
- **Workout Plans**: Structured workout routines with difficulty levels
- **Progress Tracking**: Weight, measurements, and fitness goals monitoring
- **Nutrition Tracking**: Meal logging and nutritional insights
- **Modern UI**: Beautiful interface with React Native Paper components

## Tech Stack

- **Frontend**: React Native with TypeScript
- **Framework**: Expo with Expo Router
- **Backend**: Supabase (Database, Authentication, Storage)
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BetterMe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings > API
   - Copy `env.example` to `.env` and fill in your Supabase credentials:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Setup Database**
   - Run the SQL scripts in `supabase/migrations/` to create tables
   - Or use the Supabase dashboard to create the required tables

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Run on device/simulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR code with Expo Go app

## Project Structure

```
src/
├── components/     # Reusable UI components
├── services/       # API services and external integrations
├── store/          # State management with Zustand
├── theme/          # Design system and styling
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── hooks/          # Custom React hooks

app/                # Expo Router pages
├── (auth)/         # Authentication screens
├── (tabs)/         # Main app tabs
└── _layout.tsx     # Root layout
```

## Database Schema

The app uses the following main tables:
- `users`: User profiles and preferences
- `workout_plans`: Custom workout routines
- `progress_logs`: Weight and measurement tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
