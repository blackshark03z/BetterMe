import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dataSyncService } from '../services/dataSync';

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

interface BodyStats {
  id: string;
  weight: number;
  waist: number;
  hip: number;
  chest: number;
  arm: number;
  bodyFat: number;
  bmi: number;
  date: Date;
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
  bodyStats: BodyStats[];
  progress: ProgressData;
  addSession: (session: Omit<WorkoutSession, 'id' | 'date'>) => void;
  addBodyStats: (stats: Omit<BodyStats, 'id'>) => void;
  setSessions: (sessions: WorkoutSession[]) => void;
  setBodyStats: (stats: BodyStats[]) => void;
  updateProgress: () => void;
  setWeeklyGoal: (goal: number) => void;
  getWeeklyStats: () => {
    workoutsThisWeek: number;
    totalDuration: number;
    totalCalories: number;
  };
  resetStore: () => void;
  clearAllData: () => void;
  // Removed syncWithDatabase and uploadToDatabase to avoid require cycles
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      // Add debug log for persistence
      _hasHydrated: false,
      sessions: [],
      bodyStats: [],
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

        console.log('📝 Adding session to store:', {
          exerciseName: newSession.exerciseName,
          planName: newSession.planName,
          duration: newSession.duration,
          currentSessionsCount: get().sessions.length,
        });

        set((state) => ({
          sessions: [...state.sessions, newSession],
        }));

        console.log('✅ Session added, new count:', get().sessions.length);

        // Update progress after adding session
        get().updateProgress();
        
        // Upload to database if user is authenticated
        try {
          const { useAuthStore } = require('./authStore');
          const authStore = useAuthStore.getState();
          if (authStore.user?.id) {
            // Upload workout session to database
            dataSyncService.uploadWorkoutSession(authStore.user.id, newSession);
          }
        } catch (error) {
          console.log('Auth store not available for upload');
        }
      },

      addBodyStats: (statsData) => {
        const newStats: BodyStats = {
          ...statsData,
          id: `stats-${Date.now()}`,
        };

        set((state) => ({
          bodyStats: [...state.bodyStats, newStats],
        }));
        
        // Upload to database if user is authenticated
        try {
          const { useAuthStore } = require('./authStore');
          const authStore = useAuthStore.getState();
          if (authStore.user?.id) {
            // Upload body stats to database
            dataSyncService.uploadBodyStats(authStore.user.id, newStats);
          }
        } catch (error) {
          console.log('Auth store not available for upload');
        }
      },

      setSessions: (sessions) => {
        set({ sessions });
      },

      setBodyStats: (stats) => {
        set({ bodyStats: stats });
      },

      updateProgress: () => {
        const { sessions } = get();
        
        console.log('🔄 updateProgress called with sessions:', sessions.length);
        console.log('🔄 Sessions content:', sessions.map(s => ({ id: s.id, exerciseName: s.exerciseName })));
       
        if (sessions.length === 0) {
          console.log('🔄 No sessions found, returning early');
          return;
        }

        // Ensure all session dates are Date objects and filter out invalid ones
        const normalizedSessions = sessions
          .filter(session => session.date) // Filter out sessions without date
          .map(session => {
            try {
              const dateObj = session.date instanceof Date ? session.date : new Date(session.date);
              if (isNaN(dateObj.getTime())) return null;
              return {
                ...session,
                date: dateObj,
              };
            } catch (error) {
              return null;
            }
          })
          .filter(session => session !== null) as WorkoutSession[];

        // Calculate total stats
        const totalWorkouts = normalizedSessions.length;
        const totalDurationInSeconds = normalizedSessions.reduce((sum, session) => sum + session.duration, 0);
        const totalDuration = Number((totalDurationInSeconds / 60).toFixed(2)); // Convert to minutes with 2 decimal places
        const totalCalories = normalizedSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0);
        
        console.log('ProgressStore Total Stats Debug:', {
          totalWorkouts,
          totalDurationInSeconds,
          totalDurationInMinutes: totalDuration,
          totalCalories,
          sessions: normalizedSessions.map(s => ({
            exerciseName: s.exerciseName,
            duration: s.duration, // in seconds
            durationInMinutes: s.duration / 60,
            caloriesBurned: s.caloriesBurned,
          })),
        });


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

        // Calculate weekly progress - Fix timezone issue
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        console.log('Week calculation:', {
          now: now.toISOString(),
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          sessionsCount: normalizedSessions.length,
        });


        // Sửa: Đếm số ngày duy nhất có tập trong tuần
        const workoutsThisWeekSessions = normalizedSessions.filter(session => {
          const sessionDate = new Date(session.date);
          // Compare only date part, ignore time
          const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
          const weekStartOnly = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
          const weekEndOnly = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());
          
          const isInWeek = sessionDateOnly >= weekStartOnly && sessionDateOnly <= weekEndOnly;
          
          console.log('Session check:', {
            sessionDate: sessionDate.toISOString(),
            sessionDateOnly: sessionDateOnly.toISOString(),
            weekStartOnly: weekStartOnly.toISOString(),
            weekEndOnly: weekEndOnly.toISOString(),
            isInWeek,
          });
          
          return isInWeek;
        });
        const uniqueWorkoutDays = new Set(workoutsThisWeekSessions.map(s => new Date(s.date).toDateString()));
        const workoutsThisWeek = uniqueWorkoutDays.size;

        const { progress } = get();
        const weeklyProgress = Math.min(workoutsThisWeek / progress.weeklyGoal, 1);

        console.log('ProgressStore Debug:', {
          workoutsThisWeek,
          weeklyGoal: progress.weeklyGoal,
          weeklyProgress,
          totalWorkouts,
        });


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
        console.log('Setting weekly goal:', goal);
        set((state) => ({
          progress: {
            ...state.progress,
            weeklyGoal: goal,
          },
        }));
        // Update progress after setting goal
        get().updateProgress();
      },

             getWeeklyStats: () => {
         const { sessions } = get();
         
         // Ensure all session dates are Date objects and filter out invalid ones
         const normalizedSessions = sessions
           .filter(session => session.date) // Filter out sessions without date
           .map(session => {
             try {
               const dateObj = session.date instanceof Date ? session.date : new Date(session.date);
               if (isNaN(dateObj.getTime())) return null;
               return {
                 ...session,
                 date: dateObj,
               };
             } catch (error) {
               return null;
             }
           })
           .filter(session => session !== null) as WorkoutSession[];
         
         // Use same logic as updateProgress()
         const now = new Date();
         const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
         const weekEnd = new Date(weekStart);
         weekEnd.setDate(weekEnd.getDate() + 6);
         weekEnd.setHours(23, 59, 59, 999);

         const weeklySessions = normalizedSessions.filter(session => {
           const sessionDate = new Date(session.date);
           // Compare only date part, ignore time
           const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
           const weekStartOnly = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
           const weekEndOnly = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());
           
           return sessionDateOnly >= weekStartOnly && sessionDateOnly <= weekEndOnly;
         });
         // Đếm số ngày duy nhất
         const uniqueDays = new Set(weeklySessions.map(s => new Date(s.date).toDateString()));
                   return {
            workoutsThisWeek: uniqueDays.size,
            totalDuration: Number((weeklySessions.reduce((sum, session) => sum + session.duration, 0) / 60).toFixed(2)),
            totalCalories: weeklySessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0),
          };
       },

             resetStore: () => {
         set({
           sessions: [],
           bodyStats: [],
           progress: {
             totalWorkouts: 0,
             totalDuration: 0,
             totalCalories: 0,
             streakDays: 0,
             weeklyGoal: 3,
             weeklyProgress: 0,
           },
         });
       },

       clearAllData: () => {
         set({
           sessions: [],
           bodyStats: [],
           progress: {
             totalWorkouts: 0,
             totalDuration: 0,
             totalCalories: 0,
             streakDays: 0,
             weeklyGoal: 3,
             weeklyProgress: 0,
           },
         });
       },

                     // Removed syncWithDatabase and uploadToDatabase to avoid require cycles
    }),
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 