# 📱 Wellness Transformation App - Specification Document

## 🎯 App Purpose

A lifestyle and wellness mobile application designed to help users **transform themselves through better eating and consistent exercising**. The app provides structured workout plans, nutrition tracking, and motivational progress features.

---
## Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper
AI Processing: DeepSeek

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  age INTEGER,
  weight DECIMAL(5,2), -- in kg
  height DECIMAL(5,2), -- in cm
  goal VARCHAR(50) CHECK (goal IN ('lose_fat', 'gain_muscle', 'maintain')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);
```

### User_Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  current_weight DECIMAL(5,2),
  target_weight DECIMAL(5,2),
  waist_measurement DECIMAL(5,2),
  hip_measurement DECIMAL(5,2),
  chest_measurement DECIMAL(5,2),
  arm_measurement DECIMAL(5,2),
  bmi DECIMAL(4,2),
  body_fat_percentage DECIMAL(4,2),
  daily_calorie_goal INTEGER,
  daily_protein_goal INTEGER,
  daily_carbs_goal INTEGER,
  daily_fat_goal INTEGER,
  daily_water_goal INTEGER, -- in ml
  units_preference VARCHAR(10) DEFAULT 'metric', -- metric/imperial
  theme_preference VARCHAR(10) DEFAULT 'light', -- light/dark
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Workout_Plans Table
```sql
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  goal_type VARCHAR(50) CHECK (goal_type IN ('weight_loss', 'muscle_gain', 'maintenance', 'strength', 'endurance')),
  is_custom BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for predefined plans
  estimated_duration INTEGER, -- in minutes
  days_per_week INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Workout_Days Table
```sql
CREATE TABLE workout_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  day_name VARCHAR(100), -- e.g., "Chest & Triceps"
  rest_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Exercises Table
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  muscle_group VARCHAR(50),
  equipment_needed VARCHAR(100),
  difficulty_level VARCHAR(20),
  video_url TEXT,
  image_url TEXT,
  instructions TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for predefined exercises
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Workout_Exercises Table
```sql
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_day_id UUID REFERENCES workout_days(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL(6,2), -- in kg
  duration INTEGER, -- in seconds (for time-based exercises)
  rest_time INTEGER, -- in seconds
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Workout_Sessions Table
```sql
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  workout_day_id UUID REFERENCES workout_days(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Exercise_Logs Table
```sql
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_session_id UUID REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets_completed INTEGER,
  reps_completed INTEGER,
  weight_used DECIMAL(6,2),
  duration_completed INTEGER, -- in seconds
  rest_time_taken INTEGER, -- in seconds
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Meals Table
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  calories INTEGER,
  protein DECIMAL(6,2), -- in grams
  carbs DECIMAL(6,2), -- in grams
  fat DECIMAL(6,2), -- in grams
  fiber DECIMAL(6,2), -- in grams
  sugar DECIMAL(6,2), -- in grams
  sodium DECIMAL(6,2), -- in mg
  is_custom BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL for predefined meals
  barcode VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Meal_Logs Table
```sql
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  quantity DECIMAL(4,2) DEFAULT 1.0,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Water_Logs Table
```sql
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in ml
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Progress_Logs Table
```sql
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2),
  waist_measurement DECIMAL(5,2),
  hip_measurement DECIMAL(5,2),
  chest_measurement DECIMAL(5,2),
  arm_measurement DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) CHECK (type IN ('workout_reminder', 'meal_reminder', 'water_reminder', 'motivational')),
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### User_Settings Table
```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  workout_reminders BOOLEAN DEFAULT TRUE,
  meal_reminders BOOLEAN DEFAULT TRUE,
  water_reminders BOOLEAN DEFAULT TRUE,
  motivational_notifications BOOLEAN DEFAULT TRUE,
  reminder_times JSONB, -- {"workout": "08:00", "lunch": "12:00", "dinner": "18:00"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📁 Optimal Folder Structure

```
BetterMe/
├── app/                          # Expo Router app directory
│   ├── (auth)/                   # Authentication routes
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Home screen
│   │   ├── workout/              # Workout tab
│   │   │   ├── index.tsx         # Workout plans list
│   │   │   ├── [planId].tsx      # Specific workout plan
│   │   │   ├── create.tsx        # Create custom plan
│   │   │   └── session/          # Active workout session
│   │   │       ├── [sessionId].tsx
│   │   │       └── complete.tsx
│   │   ├── nutrition/            # Nutrition tab
│   │   │   ├── index.tsx         # Daily meal planner
│   │   │   ├── log-meal.tsx      # Log new meal
│   │   │   ├── water-tracker.tsx
│   │   │   └── search-food.tsx
│   │   ├── progress/             # Progress tab
│   │   │   ├── index.tsx         # Progress overview
│   │   │   ├── body-stats.tsx    # Body measurements
│   │   │   ├── workout-stats.tsx # Workout analytics
│   │   │   └── nutrition-stats.tsx
│   │   ├── profile/              # Profile tab
│   │   │   ├── index.tsx         # Profile overview
│   │   │   ├── edit-profile.tsx
│   │   │   └── settings.tsx
│   │   └── _layout.tsx           # Tab layout
│   ├── _layout.tsx               # Root layout
│   └── index.tsx                 # Splash screen
├── src/
│   ├── components/               # Reusable components
│   │   ├── ui/                   # UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── workout/              # Workout-specific components
│   │   │   ├── ExerciseCard.tsx
│   │   │   ├── WorkoutPlanCard.tsx
│   │   │   ├── SessionTimer.tsx
│   │   │   └── ProgressTracker.tsx
│   │   ├── nutrition/            # Nutrition-specific components
│   │   │   ├── MealCard.tsx
│   │   │   ├── WaterTracker.tsx
│   │   │   ├── MacroChart.tsx
│   │   │   └── FoodSearch.tsx
│   │   ├── progress/             # Progress-specific components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   └── Calendar.tsx
│   │   └── common/               # Common components
│   │       ├── Header.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useWorkout.ts
│   │   ├── useNutrition.ts
│   │   ├── useProgress.ts
│   │   └── useSupabase.ts
│   ├── services/                 # API and external services
│   │   ├── supabase/             # Supabase client and queries
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── workouts.ts
│   │   │   ├── nutrition.ts
│   │   │   └── progress.ts
│   │   ├── ai/                   # AI service integration
│   │   │   ├── deepseek.ts
│   │   │   └── recommendations.ts
│   │   ├── notifications/        # Push notifications
│   │   │   ├── setup.ts
│   │   │   └── scheduler.ts
│   │   └── storage/              # Local storage utilities
│   │       ├── asyncStorage.ts
│   │       └── cache.ts
│   ├── utils/                    # Utility functions
│   │   ├── constants.ts          # App constants
│   │   ├── helpers.ts            # Helper functions
│   │   ├── validators.ts         # Form validation
│   │   ├── formatters.ts         # Data formatting
│   │   └── calculations.ts       # Fitness calculations
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── workout.ts
│   │   ├── nutrition.ts
│   │   ├── progress.ts
│   │   └── supabase.ts
│   ├── store/                    # State management
│   │   ├── authStore.ts
│   │   ├── workoutStore.ts
│   │   ├── nutritionStore.ts
│   │   └── progressStore.ts
│   └── theme/                    # App theming
│       ├── colors.ts
│       ├── typography.ts
│       ├── spacing.ts
│       └── index.ts
├── assets/                       # Static assets
│   ├── images/
│   │   ├── exercises/            # Exercise images
│   │   ├── meals/                # Meal images
│   │   ├── icons/                # App icons
│   │   └── backgrounds/          # Background images
│   ├── fonts/                    # Custom fonts
│   └── animations/               # Lottie animations
├── docs/                         # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── tests/                        # Test files
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── .env.example                  # Environment variables template
├── app.json                      # Expo configuration
├── babel.config.js               # Babel configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── README.md                     # Project documentation
└── CONTEXT.md                    # This specification document
```

## 🧭 App Flow Overview

### 1.1 Launch & Registration
- **Splash Screen** → transitions to → **Registration/Login Screen**

### 1.2 Authentication
- **New users**: Register an Account
  - Fields: Name, Email, Password, Age, Weight, Height, Goal (Lose fat / Gain muscle / Maintain)
- **Existing users**: Login
  - Via email and password

### 1.3 Home Screen (Dashboard)
- After login, the user lands on the **Home Page**
- Two main tabs:
  - **🏋️ Workout Tab**
  - **🥗 Nutrition Tab**
- Persistent bottom navigation includes: `Home`, `Progress`, `Settings`, `Profile`

---

## 🏋️ Workout Tab

### 2.1 Workout Plan Selection
- Option to **select an existing workout plan** (based on user goal)
- Option to **create a custom plan**

### 2.2 Existing Workout Plans
- Pre-made plans for:
  - Weight loss
  - Muscle gain
  - Beginner-friendly
  - Home workouts
  - Gym-based plans

### 2.3 Create Your Own Workout Plan
- Name the workout plan
- Add days (e.g., Day 1: Chest & Triceps)
- Add exercises with:
  - Name
  - Sets
  - Reps
  - Rest time
  - Optional: video tutorial or animation

### 2.4 Workout Session
- Select a workout and **Start Session**
- View exercise cards step-by-step
- Track:
  - Sets completed
  - Reps
  - Time spent
- **Exercise Completion Flow:**
  - When all sets are completed → Show completion dialog
  - Options: "Next Exercise" or "Back to Plan"
  - Auto-reset timers for next exercise
- End with a **cool down suggestion**

---

## 🥗 Nutrition Tab

### 3.1 Daily Meal Planner
- Breakfast, Lunch, Dinner, Snacks
- Option to:
  - Add meals manually
  - Choose from recommended meal plans based on goal
  - Scan barcode or search for food items

### 3.2 Meal Logging
- Log calories, macronutrients (protein, fat, carbs)
- Visual daily/weekly graph of intake vs goal

### 3.3 Water Intake Tracker
- Simple add-amount button
- Daily hydration target based on body weight

---

## 📈 Progress Tracking

### 4.1 Body Stats
- Log and view:
  - Weight
  - Waist, hips, chest, arms measurements
  - BMI and body fat % (manual or auto-calc if integrated with smart devices)

### 4.2 Workout Progress
- Calendar of completed workouts
- Personal best records
- Workout consistency streaks

### 4.3 Nutrition Progress
- Weekly calories chart
- Macro distribution pie chart

---

## ⚙️ Settings

### 5.1 App Preferences
- Theme (dark/light mode)
- Units (lbs/kg, cm/inches)
- Notifications toggle (reminders for meals, water, workouts)

### 5.2 Account Settings
- Change password
- Edit profile info
- Logout

---

## 👤 Profile Page

- User avatar & basic stats
- Goal display (e.g., "Gaining Muscle")
- Join date, streak count
- Button: "Edit Goal" – triggers recalibration of meal & workout suggestions

---

## 🔔 Additional Features

### 7.1 Push Notifications
- Workout reminders
- Meal time alerts
- Motivational quotes

### 7.2 Integration (optional/future)
- Sync with Apple Health / Google Fit
- Smartwatch support

---

## 🧪 Future Enhancements

- AI-generated meal/workout plans based on progress
- Community feature: Share progress, challenge others
- In-app purchase for premium coaching

---

## 🗂 Example Navigation Stack

```
1. Splash Screen
2. Registration/Login
3. Home Page
    - Workout Tab
      - Choose Plan → Start Workout
    - Nutrition Tab
      - Log Meals → Track Intake
4. Progress Page
5. Profile Page
6. Settings
```

---

## 🔧 Tech Notes for Developers

### Technology Stack
- **Authentication**: Firebase Auth or OAuth2
- **Database**: Firebase Firestore / MongoDB
- **Frontend**: Flutter / React Native
- **State Management**: Provider / Redux
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Charting**: VictoryCharts / D3.js for progress visuals

### Development Considerations
- Implement responsive design for various screen sizes
- Ensure offline functionality for workout tracking
- Optimize for performance with large datasets
- Implement proper error handling and user feedback
- Follow accessibility guidelines for inclusive design

---

## 🎯 Vision Statement

> **Empower individuals to achieve their healthiest selves by making nutrition and exercise guidance accessible, structured, and sustainable.**

---

## 📋 Development Phases

### Phase 1: Core Features
- [ ] User authentication system
- [ ] Basic workout plan selection
- [ ] Simple meal logging
- [ ] Progress tracking basics

### Phase 2: Enhanced Features
- [ ] Custom workout plan creation
- [ ] Advanced nutrition tracking
- [ ] Detailed progress analytics
- [ ] Push notifications

### Phase 3: Advanced Features
- [ ] AI-powered recommendations
- [ ] Community features
- [ ] Premium subscription model
- [ ] Third-party integrations

---

*Last updated: [Current Date]*
*Version: 1.0* 