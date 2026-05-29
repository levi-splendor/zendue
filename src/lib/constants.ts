// Default timer settings (seconds) — reduced for quicker testing
export const TIMER_SETTINGS = {
  pomodoro: 25, // 25 seconds for quick testing (was 25 * 60)
  shortBreak: 5, // 5 seconds (was 5 * 60)
  longBreak: 15, // 15 seconds (was 15 * 60)
} as const;

export const MODE_LABELS = {
  pomodoro: "Focus Time",
  shortBreak: "Short Break",
  longBreak: "Long Break",
} as const;

export const SOUNDS = {
  complete: 'https://assets.mixkit.co/sfx/preview/2572/2572.wav',
  ring: 'https://assets.mixkit.co/sfx/preview/2964/2964.wav',
} as const;