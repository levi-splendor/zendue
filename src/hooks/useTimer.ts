import { useState, useEffect, useCallback, useRef } from "react";
import type { TimerMode, Activity } from "../types/index";
import { TIMER_SETTINGS, SOUNDS } from "../lib/constants";

export const useTimer = (todos?: Activity[], onAutoStart?: () => void) => {
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_SETTINGS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const autoStartTriggeredRef = useRef<Set<string>>(new Set());

  const playSound = (type: "complete" | "ring") => {
    try {
      const audio = new Audio(SOUNDS[type]);
      audio.volume = 0.7;
      audio.play().catch(console.error);
    } catch (error) {
      console.error("Failed to play sound:", error);
    }
  };

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode]);
    setIsRunning(false);
  }, []);

  // Auto-start timer when activity due time is reached (check every 5 seconds for better precision)
  useEffect(() => {
    if (!todos?.length) return;

    const checkDueTimes = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const dueActivity = todos.find(
        (todo) => !todo.completed && todo.dueTime === currentTime,
      );

      if (dueActivity && !isRunning) {
        // Use a ref to track which activities have been triggered
        const activityKey = `${dueActivity.dueTime}_${dueActivity.id}`;

        if (!autoStartTriggeredRef.current.has(activityKey)) {
          autoStartTriggeredRef.current.add(activityKey);
          setIsRunning(true);
          playSound("ring");

          // Log auto-start event
          console.log(
            `⏰ Auto-started timer for activity: "${dueActivity.text}" due at ${dueActivity.dueTime}`,
          );

          // Notify App.tsx to switch tab
          onAutoStart?.();

          // Clear the triggered activity after 2 minutes to allow re-trigger
          setTimeout(
            () => {
              autoStartTriggeredRef.current.delete(activityKey);
            },
            2 * 60 * 1000,
          );
        }
      }
    }, 5000); // Check every 5 seconds for better precision

    return () => clearInterval(checkDueTimes);
  }, [todos, isRunning, onAutoStart]);

  // Main timer countdown (every second for accuracy)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSound("complete");

      if (mode === "pomodoro") {
        setSessionsCompleted((prev) => prev + 1);
      }

      const nextMode: TimerMode =
        mode === "pomodoro"
          ? (sessionsCompleted + 1) % 4 === 0
            ? "longBreak"
            : "shortBreak"
          : "pomodoro";

      setTimeout(() => switchMode(nextMode), 1500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, sessionsCompleted, switchMode]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_SETTINGS[mode]);
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isRunning,
    mode,
    sessionsCompleted,
    formatTime,
    start,
    pause,
    reset,
    switchMode,
  };
};
