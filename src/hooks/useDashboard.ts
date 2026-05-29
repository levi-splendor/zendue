// useDashboard Hook - Manages daily statistics and streak tracking
import { useState, useEffect, useCallback } from "react";
import type { Activity, DailyStats, Streak } from "../types";
import { format } from "date-fns";

export const useDashboard = (todos: Activity[]) => {
  // Daily statistics state
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    date: format(new Date(), "yyyy-MM-dd"),
    tasksCompleted: 0,
    totalTimeSpent: 0,
    averageSessionLength: 0,
    focusScore: 0,
  });

  // Streak tracking state
  const [streak, setStreak] = useState<Streak>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date().toISOString(),
    totalActivitiesCompleted: 0,
  });

  // Calculate daily statistics
  const calculateDailyStats = useCallback(() => {
    const today = format(new Date(), "yyyy-MM-dd");

    // Get today's completed tasks
    const completedToday = todos.filter(
      (t) =>
        t.completed &&
        t.completedAt &&
        format(new Date(t.completedAt), "yyyy-MM-dd") === today,
    );

    // Calculate total time spent (in minutes)
    const totalSeconds = completedToday.reduce(
      (acc, t) => acc + (t.timeSpent || 0),
      0,
    );
    const totalMinutes = Math.round(totalSeconds / 60);

    // Calculate average session length
    const averageSession =
      completedToday.length > 0
        ? Math.round(totalMinutes / completedToday.length)
        : 0;

    // Calculate focus score (0-100)
    // Based on: task completion rate, consistency, session quality
    const taskCompletionRate =
      todos.length > 0 ? (completedToday.length / todos.length) * 100 : 0;
    const focusScore = Math.min(
      100,
      Math.round(taskCompletionRate * 0.6 + averageSession * 0.4),
    );

    setDailyStats({
      date: today,
      tasksCompleted: completedToday.length,
      totalTimeSpent: totalMinutes,
      averageSessionLength: averageSession,
      focusScore,
    });
  }, [todos]);

  // Calculate streak information
  const calculateStreak = useCallback(() => {
    if (todos.length === 0) return;

    // Sort completed tasks by date
    const completedTasks = todos
      .filter((t) => t.completed && t.completedAt)
      .sort(
        (a, b) =>
          new Date(b.completedAt || 0).getTime() -
          new Date(a.completedAt || 0).getTime(),
      );

    const totalCompleted = completedTasks.length;

    if (totalCompleted === 0) {
      setStreak({
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date().toISOString(),
        totalActivitiesCompleted: 0,
      });
      return;
    }

    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let previousDate: Date | null = null;

    completedTasks.forEach((task) => {
      if (!task.completedAt) return;

      const taskDate = new Date(task.completedAt);
      const taskDateStr = format(taskDate, "yyyy-MM-dd");
      const today = format(new Date(), "yyyy-MM-dd");

      // If this is today's task or yesterday's task, continue the streak
      if (!previousDate) {
        previousDate = taskDate;
        currentStreak = taskDateStr === today ? 1 : 0;
        tempStreak = 1;
      } else {
        const dayDiff = Math.floor(
          (previousDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (dayDiff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);

          // Check if this is today or yesterday for current streak
          if (
            taskDateStr === today ||
            taskDateStr ===
              format(new Date(Date.now() - 86400000), "yyyy-MM-dd")
          ) {
            currentStreak = tempStreak;
          }
        } else if (dayDiff > 1) {
          tempStreak = 1;
        }
        previousDate = taskDate;
      }
    });

    longestStreak = Math.max(longestStreak, tempStreak);

    setStreak({
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      lastActivityDate:
        completedTasks[0].completedAt || new Date().toISOString(),
      totalActivitiesCompleted: totalCompleted,
    });
  }, [todos]);

  // Update stats when todos change
  useEffect(() => {
    calculateDailyStats();
    calculateStreak();
  }, [calculateDailyStats, calculateStreak]);

  return {
    dailyStats,
    streak,
    completionPercentage:
      todos.length > 0
        ? Math.round(
            (todos.filter((t) => t.completed).length / todos.length) * 100,
          )
        : 0,
  };
};

export default useDashboard;
