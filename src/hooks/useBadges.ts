// useBadges Hook - Manages achievement/badge system logic
import { useState, useEffect, useCallback } from "react";
import type { Badge, Activity } from "../types";

export const useBadges = (todos: Activity[]) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

  // Define all available badges
  const allBadges: Badge[] = [
    {
      id: "first-focus",
      name: "First Focus",
      description: "Complete your first task",
      icon: "🌟",
      condition: "complete-1-task",
    },
    {
      id: "early-bird",
      name: "Early Bird",
      description: "Complete 3 tasks before 10 AM",
      icon: "🌅",
      condition: "early-tasks-3",
    },
    {
      id: "night-owl",
      name: "Night Owl",
      description: "Complete 3 tasks after 8 PM",
      icon: "🌙",
      condition: "late-tasks-3",
    },
    {
      id: "day-3-streak",
      name: "3-Day Streak",
      description: "Maintain a 3-day consecutive focus streak",
      icon: "🔥",
      condition: "3-day-streak",
    },
    {
      id: "day-5-streak",
      name: "5-Day Streak",
      description: "Maintain a 5-day consecutive focus streak",
      icon: "🔥🔥",
      condition: "5-day-streak",
    },
    {
      id: "day-7-streak",
      name: "Week Warrior",
      description: "Maintain a 7-day consecutive focus streak",
      icon: "⚔️",
      condition: "7-day-streak",
    },
    {
      id: "tasks-10",
      name: "Productive Day",
      description: "Complete 10 tasks in a single day",
      icon: "💯",
      condition: "10-tasks-day",
    },
    {
      id: "tasks-50",
      name: "Task Master",
      description: "Complete 50 tasks total",
      icon: "🏆",
      condition: "50-tasks-total",
    },
    {
      id: "tasks-100",
      name: "Legend",
      description: "Complete 100 tasks total",
      icon: "👑",
      condition: "100-tasks-total",
    },
    {
      id: "speed-5min",
      name: "Speed Runner",
      description: "Complete 3 tasks in under 5 minutes each",
      icon: "⚡",
      condition: "speed-runner",
    },
    {
      id: "all-categories",
      name: "Jack of All Trades",
      description: "Complete tasks in all categories",
      icon: "🎯",
      condition: "all-categories",
    },
    {
      id: "perfect-day",
      name: "Perfect Day",
      description: "Complete all tasks scheduled for the day",
      icon: "✨",
      condition: "perfect-day",
    },
  ];

  // Check if a badge should be earned
  const checkBadgeEarned = useCallback(
    (badge: Badge): boolean => {
      const completedTasks = todos.filter((t) => t.completed);
      const today = new Date().toISOString().split("T")[0];

      switch (badge.condition) {
        case "complete-1-task":
          return completedTasks.length >= 1;

        case "early-tasks-3": {
          const earlyTasks = completedTasks.filter((t) => {
            if (!t.completedAt) return false;
            const hour = new Date(t.completedAt).getHours();
            return hour < 10;
          });
          return earlyTasks.length >= 3;
        }

        case "late-tasks-3": {
          const lateTasks = completedTasks.filter((t) => {
            if (!t.completedAt) return false;
            const hour = new Date(t.completedAt).getHours();
            return hour >= 20;
          });
          return lateTasks.length >= 3;
        }

        case "3-day-streak":
          // Would calculate from activity history
          return false; // Placeholder

        case "5-day-streak":
          return false; // Placeholder

        case "7-day-streak":
          return false; // Placeholder

        case "10-tasks-day": {
          const todayTasks = completedTasks.filter(
            (t) => t.completedAt && t.completedAt.split("T")[0] === today,
          );
          return todayTasks.length >= 10;
        }

        case "50-tasks-total":
          return completedTasks.length >= 50;

        case "100-tasks-total":
          return completedTasks.length >= 100;

        case "speed-runner": {
          const speedTasks = completedTasks.filter((t) => {
            if (!t.timeSpent) return false;
            return t.timeSpent < 5 * 60; // Less than 5 minutes
          });
          return speedTasks.length >= 3;
        }

        case "all-categories": {
          const categories = new Set(
            todos.map((t) => t.category).filter(Boolean),
          );
          return categories.size >= 4;
        }

        case "perfect-day": {
          const todayTasks = todos.filter(
            (t) => t.createdAt && t.createdAt.split("T")[0] === today,
          );
          const todayCompleted = todayTasks.filter((t) => t.completed);
          return (
            todayTasks.length > 0 && todayTasks.length === todayCompleted.length
          );
        }

        default:
          return false;
      }
    },
    [todos],
  );

  // Check and update earned badges
  const updateEarnedBadges = useCallback(() => {
    const newEarned: Badge[] = [];

    allBadges.forEach((badge) => {
      if (checkBadgeEarned(badge)) {
        const alreadyEarned = earnedBadges.some((b) => b.id === badge.id);
        if (!alreadyEarned) {
          newEarned.push({
            ...badge,
            earnedAt: new Date().toISOString(),
          });
        }
      }
    });

    if (newEarned.length > 0) {
      setEarnedBadges([...earnedBadges, ...newEarned]);
    }
  }, [allBadges, checkBadgeEarned, earnedBadges]);

  // Check for new badges when todos change
  useEffect(() => {
    updateEarnedBadges();
  }, [updateEarnedBadges]);

  // Get next badge to aim for
  const getNextBadge = useCallback((): Badge | null => {
    return (
      allBadges.find(
        (badge) =>
          !earnedBadges.some((b) => b.id === badge.id) &&
          !checkBadgeEarned(badge),
      ) || null
    );
  }, [allBadges, earnedBadges, checkBadgeEarned]);

  return {
    allBadges,
    earnedBadges,
    getNextBadge: getNextBadge(),
    totalBadges: allBadges.length,
    earnedCount: earnedBadges.length,
    progress: Math.round((earnedBadges.length / allBadges.length) * 100),
  };
};

export default useBadges;
