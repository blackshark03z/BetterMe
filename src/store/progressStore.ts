import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkoutSession {
  id: string;
  planName: string;
  exerciseName: string;
  duration: number; // in seconds
  sets: number;
  reps: number;
  completedSets: number;
  date: Date;
  caloriesBurned?: number;
}

interface ProgressData {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalCalories: number;
  streakDays: number;
  lastWorkoutDate?: Date;
  weeklyGoal: number; // workouts per week
  weeklyProgress: number;
}

interface ProgressStore {
  sessions: WorkoutSession[];
  progress: ProgressData;
  addSession: (session: Omit<WorkoutSession, 'id' | 'date'>) => void;
  updateProgress: () => void;
  setWeeklyGoal: (goal: number) => void;
  getWeeklyStats: () => {
    workoutsThisWeek: number;
    totalDuration: number;
    totalCalories: number;
  };
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      progress: {
        totalWorkouts: 0,
        totalDuration: 0,
        totalCalories: 0,
        streakDays: 0,
        weeklyGoal: 3,
        weeklyProgress: 0,
      },

      addSession: (sessionData) => {
        const newSession: WorkoutSession = {
          ...sessionData,
          id: `session-${Date.now()}`,
          date: new Date(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        // Update progress after adding session
        get().updateProgress();
      },

      updateProgress: () => {
        const { sessions } = get();
        
        if (sessions.length === 0) return;

        // Ensure all session dates are Date objects
        const normalizedSessions = sessions.map(session => ({
          ...session,
          date: session.date instanceof Date ? session.date : new Date(session.date),
        }));

        // Calculate total stats
        const totalWorkouts = normalizedSessions.length;
        const totalDuration = normalizedSessions.reduce((sum, session) => sum + session.duration, 0) / 60; // Convert to minutes
        const totalCalories = normalizedSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0);

        // Calculate streak - Group sessions by date and count unique days
        const sortedSessions = [...normalizedSessions].sort((a, b) => b.date.getTime() - a.date.getTime());
        let streakDays = 0;
        let currentDate = new Date();
        const processedDates = new Set<string>();
        
        for (const session of sortedSessions) {
          const sessionDate = new Date(session.date);
          const sessionDateString = sessionDate.toDateString(); // Get date without time
          const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Only count each date once for streak calculation
          if (daysDiff <= 1 && !processedDates.has(sessionDateString)) {
            streakDays++;
            processedDates.add(sessionDateString);
            currentDate = sessionDate;
          } else if (daysDiff > 1) {
            break;
          }
        }

        // Calculate weekly progress
        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Sửa: Đếm số ngày duy nhất có tập trong tuần
        const workoutsThisWeekSessions = normalizedSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
        const uniqueWorkoutDays = new Set(workoutsThisWeekSessions.map(s => new Date(s.date).toDateString()));
        const workoutsThisWeek = uniqueWorkoutDays.size;

        const { progress } = get();
        const weeklyProgress = Math.min(workoutsThisWeek / progress.weeklyGoal, 1);

        set((state) => ({
          progress: {
            ...state.progress,
            totalWorkouts,
            totalDuration,
            totalCalories,
            streakDays,
            lastWorkoutDate: sortedSessions[0]?.date,
            weeklyProgress,
          },
        }));
      },

      setWeeklyGoal: (goal) => {
        set((state) => ({
          progress: {
            ...state.progress,
            weeklyGoal: goal,
          },
        }));
      },

      getWeeklyStats: () => {
        const { sessions } = get();
        
        // Ensure all session dates are Date objects
        const normalizedSessions = sessions.map(session => ({
          ...session,
          date: session.date instanceof Date ? session.date : new Date(session.date),
        }));
        
        const weekStart = new Date();
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weeklySessions = normalizedSessions.filter(session => {
          const sessionDate = new Date(session.date);
          return sessionDate >= weekStart && sessionDate <= weekEnd;
        });
        // Đếm số ngày duy nhất
        const uniqueDays = new Set(weeklySessions.map(s => new Date(s.date).toDateString()));
        return {
          workoutsThisWeek: uniqueDays.size,
          totalDuration: weeklySessions.reduce((sum, session) => sum + session.duration, 0) / 60,
          totalCalories: weeklySessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0),
        };
      },
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 