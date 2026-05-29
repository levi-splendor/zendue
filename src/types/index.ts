// Timer modes for Pomodoro technique
export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

// Activity category types
export type ActivityCategory =
  | "work"
  | "personal"
  | "health"
  | "learning"
  | "other";

// Activity repeat patterns
export type RepeatType = "once" | "daily" | "weekly" | "monthly";

// Legacy Todo interface - maintained for backward compatibility
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  pomodoros: number;
  createdAt: string;
  dueTime?: string;
}

// Enhanced Activity interface for new system
export interface Activity extends Todo {
  category?: ActivityCategory;
  description?: string;
  duration: number; // in minutes
  reminders?: Reminder[];
  repeatType?: RepeatType;
  completedAt?: string;
  timeSpent?: number; // actual time spent in seconds
}

// Reminder notification settings
export interface Reminder {
  id: string;
  type: "email" | "browser" | "both";
  minutesBefore: number;
}

// Activity history for analytics
export interface ActivityHistory {
  id: string;
  activityId: string;
  completedAt: string;
  timeSpent: number; // seconds
  category: ActivityCategory;
}

// User streak tracking
export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalActivitiesCompleted: number;
}

// Badge/Achievement definition
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string; // e.g., '5-day-streak', '10-tasks', 'first-focus'
  earnedAt?: string;
}

// Daily dashboard statistics
export interface DailyStats {
  date: string;
  tasksCompleted: number;
  totalTimeSpent: number; // minutes
  averageSessionLength: number; // minutes
  focusScore: number; // 0-100
}

// Weekly analytics data
export interface WeeklyAnalytics {
  week: string; // ISO week format
  dailyStats: DailyStats[];
  totalCompleted: number;
  averageDailyCompletion: number;
}

// User preferences and settings
export interface UserPreferences {
  theme: "dark" | "light";
  emailNotifications: boolean;
  browserNotifications: boolean;
  soundEnabled: boolean;
  workDuration: number; // pomodoro minutes
  breakDuration: number; // short break minutes
}
