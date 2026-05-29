// Enhanced Focus Timer - Main timer view with session information
import { useState } from "react";
import { Play, Pause, Square, CheckCircle2 } from "lucide-react";
import type { Activity, TimerMode } from "../types";
import { TIMER_SETTINGS } from "../lib/constants";

interface FocusTimerProps {
  activity?: Activity;
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  formatTime: (seconds: number) => string;
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchMode: (mode: TimerMode) => void;
  onComplete?: () => void;
}

export function FocusTimer({
  activity,
  timeLeft,
  isRunning,
  mode,
  formatTime,
  start,
  pause,
  reset,
  onComplete,
}: FocusTimerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calculate progress for the circular indicator (use TIMER_SETTINGS in seconds)
  const maxTime = TIMER_SETTINGS[mode];
  const progress = ((maxTime - timeLeft) / maxTime) * 100;

  // Calculate elapsed time
  const elapsedSeconds = maxTime - timeLeft;
  const formattedElapsed = formatTime(elapsedSeconds);

  // Determine colors based on timer mode
  const modeColors = {
    pomodoro: "#0056cc",
    shortBreak: "#10b981",
    longBreak: "#8b5cf6",
  };

  const modeLabels = {
    pomodoro: "Morning Meditation",
    shortBreak: "SHORT BREAK",
    longBreak: "LONG BREAK",
  };

  // Fullscreen timer view
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 z-50 flex flex-col items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold"
        >
          ✕
        </button>

        {/* Session Info */}
        {activity && (
          <div className="text-center mb-12">
            <p className="text-gray-500 text-lg mb-2">Currently working on:</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {activity.text}
            </h2>
            <p className="text-gray-600">{activity.description}</p>
          </div>
        )}

        {/* Large Circular Timer */}
        <div className="relative w-96 h-96 mb-12">
          <svg
            className="w-full h-full"
            viewBox="0 0 280 280"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="130"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="130"
              fill="none"
              stroke={modeColors[mode]}
              strokeWidth="8"
              strokeDasharray={`${(progress / 100) * 817} 817`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 1s linear" }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg mb-3">REMAINING</p>
            <div className="text-7xl font-mono font-bold text-gray-900">
              {formatTime(timeLeft)}
            </div>
            <p className="text-gray-600 text-lg mt-4">{modeLabels[mode]}</p>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-8">
          <p className="text-gray-600">Email sent to user@example.com</p>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={start}
              className="px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl font-bold text-lg transition-colors"
            >
              ○ Snooze
            </button>
          ) : null}

          <button
            onClick={onComplete}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg transition-colors shadow-lg"
          >
            ✓ Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Session Info Card */}
      {activity && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary-600 text-sm font-bold mb-2 uppercase tracking-wide">
                Focus Session
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {activity.text}
              </h3>
              {activity.description && (
                <p className="text-gray-600 mt-2">{activity.description}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">Due</p>
              <p className="text-xl font-bold text-gray-900">
                {activity.dueTime}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Timer Display */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12">
        <div className="flex flex-col items-center">
          <p className="text-gray-500 text-sm font-semibold mb-8 uppercase tracking-wide">
            {modeLabels[mode]}
          </p>

          {/* Large Circular Timer */}
          <div className="relative w-80 h-80 mb-12">
            <svg
              className="w-full h-full"
              viewBox="0 0 280 280"
              style={{ transform: "rotate(-90deg)" }}
            >
              {/* Background circle */}
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />
              {/* Progress circle */}
              <circle
                cx="140"
                cy="140"
                r="130"
                fill="none"
                stroke={modeColors[mode]}
                strokeWidth="6"
                strokeDasharray={`${(progress / 100) * 817} 817`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-widest">
                REMAINING
              </p>
              <div className="text-7xl font-mono font-bold text-gray-900">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Info Display */}
          <div className="flex gap-12 mb-12 text-center w-full justify-center">
            <div className="bg-gray-50 rounded-lg px-6 py-4">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
                Elapsed
              </p>
              <p className="text-2xl font-mono font-bold text-gray-900">
                {formattedElapsed}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-6 py-4">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
                Progress
              </p>
              <p className="text-2xl font-mono font-bold text-gray-900">
                {progress.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Email notification info */}
          <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm text-blue-700 mb-8">
            📧 Email sent to user@example.com
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center flex-wrap">
        {!isRunning ? (
          <button
            onClick={start}
            className="bg-primary-600 hover:bg-primary-700 transition-all px-8 py-4 rounded-xl flex items-center gap-3 text-lg font-semibold text-white shadow-md active:scale-95"
          >
            <Play size={24} fill="currentColor" /> START TIMER
          </button>
        ) : (
          <button
            onClick={pause}
            className="bg-amber-500 hover:bg-amber-600 transition-all px-8 py-4 rounded-xl flex items-center gap-3 text-lg font-semibold text-white shadow-md active:scale-95"
          >
            <Pause size={24} fill="currentColor" /> PAUSE
          </button>
        )}

        <button
          onClick={reset}
          className="bg-gray-300 hover:bg-gray-400 transition-all px-8 py-4 rounded-xl flex items-center gap-3 text-gray-900 font-semibold active:scale-95"
        >
          <Square size={24} /> STOP
        </button>

        <button
          onClick={() => setIsFullscreen(true)}
          className="bg-gray-200 hover:bg-gray-300 transition-all px-8 py-4 rounded-xl flex items-center gap-3 text-gray-900 font-semibold active:scale-95"
        >
          🖥️ FULLSCREEN
        </button>

        <button
          onClick={onComplete}
          className="bg-green-600 hover:bg-green-700 transition-all px-8 py-4 rounded-xl flex items-center gap-3 text-lg font-semibold text-white shadow-md active:scale-95"
        >
          <CheckCircle2 size={24} /> DONE
        </button>
      </div>
    </div>
  );
}

export default FocusTimer;
