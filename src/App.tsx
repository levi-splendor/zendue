import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { supabase } from "./lib/supabase";

// Components
import TodoItem from "./components/TodoItem";
import Dashboard from "./components/Dashboard";
import ActivityHistory from "./components/ActivityHistory";
import FocusTimer from "./components/FocusTimer";
import NewActivityForm from "./components/NewActivityForm";
import NavigationBar from "./components/NavigationBar";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import Landing from "./components/Landing";
import { AuthGuard } from "./components/AuthGuard";

// Types
import type { TabType } from "./components/NavigationBar";
import type { Activity } from "./types/index";

// Hooks
import { useTimer } from "./hooks/useTimer";
import { useTodos } from "./hooks/useTodos";
import { useBadges } from "./hooks/useBadges";

// Utilities
import { sendTimerCompleteEmail } from "./lib/email";
import { useActivityNotifier } from "./hooks/useActivityNotifier";

// inside your component:

/**
 * Zendue - Professional Todo Timer PWA
 * Main application component with multi-page navigation
 */
function App() {
  // Add these lines at the top:
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useActivityNotifier(currentUser?.id); // ← moved here, inside the function
  // Auth page state: "login" | "signup"
  const [authPage, setAuthPage] = useState<"login" | "signup">("login");
  // Landing page visibility before auth
  const [showLanding, setShowLanding] = useState(true);

  // Timer hook for Pomodoro functionality
  const {
    todos,
    addTodo,
    updateTodo,
    toggleComplete,
    incrementPomodoro,
    deleteTodo,
  } = useTodos();

  // Todos hook for activity management
  const {
    timeLeft,
    isRunning,
    mode,
    formatTime,
    start,
    pause,
    reset,
    switchMode,
  } = useTimer(todos, () => {
    // Auto-switch to timer tab
    setActiveTab("timer");

    // Find the due activity and set it as selected
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const dueActivity = todos.find(
      (t) => !t.completed && t.dueTime === currentTime,
    );
    if (dueActivity) {
      setSelectedActivity(dueActivity as Activity);
    }
  });
  // Badge system hook
  useBadges(todos as Activity[]);

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined
  >();
  const [showNotificationPermission, setShowNotificationPermission] =
    useState(false);

  /**
   * Handle timer completion - trigger notifications and update activity
   */
  const handleTimerComplete = async () => {
    const currentTodo = selectedActivity
      ? todos.find((t) => t.id === selectedActivity.id)
      : todos.find((t) => !t.completed);

    if (currentTodo) {
      // Mark as completed
      toggleComplete(currentTodo.id);

      // Increment pomodoro
      incrementPomodoro(currentTodo.id);

      // Ring animation
      document.body.classList.add("timer-ring");
      setTimeout(() => document.body.classList.remove("timer-ring"), 2000);

      // Send email
      await sendTimerCompleteEmail(currentTodo.text, mode);

      // Browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🎉 Task Complete!", {
          body: `Great job completing: ${currentTodo.text}`,
          icon: "/icon-192.png",
        });
      }

      // Switch to history tab after 2 seconds
      setTimeout(() => {
        setActiveTab("history");
        setSelectedActivity(undefined);
      }, 2000);
    }
  };

  /**
   * Auto trigger when timer ends
   */
  useEffect(() => {
    if (timeLeft === 0 && isRunning && mode === "pomodoro") {
      handleTimerComplete();
    }
  }, [timeLeft, isRunning, mode]);

  /**
   * Handle adding new activity
   */
  const handleAddActivity = (activityData: Partial<Activity>) => {
    if (activityData.text) {
      addTodo(activityData.text, activityData.dueTime);
      setShowActivityForm(false);
    }
  };

  /**
   * Request browser notification permission
   */
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setShowNotificationPermission(false);
        }
      });
    }
  };

  /**
   * Handle starting a specific activity with timer
   */
  const handleStartActivity = (activityId: string) => {
    const activity = todos.find((t) => t.id === activityId);
    if (activity) {
      setSelectedActivity(activity as Activity);
      setActiveTab("timer");
      start();
    }
  };

  /**
   * Render active page based on selected tab
   */
  const renderActivePage = () => {
    switch (activeTab) {
      case "home":
        return (
          <Dashboard
            todos={todos as Activity[]}
            onStartActivity={handleStartActivity}
            user={currentUser}
          />
        );

      case "tasks":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Plus size={24} className="text-primary-600" />
                    Create New Activity
                  </h2>
                  <button
                    onClick={() => setShowActivityForm(true)}
                    className="w-full py-3 px-4 border-2 border-dashed border-primary-300 rounded-lg text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                  >
                    + Add New Activity
                  </button>
                </div>

                {/* Tasks List */}
                {todos.filter((t) => !t.completed).length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center mt-6">
                    <p className="text-gray-500 text-lg">
                      No tasks yet. Create one to begin!
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    {todos
                      .filter((t) => !t.completed)
                      .map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleComplete}
                          onDelete={deleteTodo}
                          onIncrementPomo={incrementPomodoro}
                          onUpdate={updateTodo}
                        />
                      ))}
                  </div>
                )}
              </div>

              {/* Sidebar - Completed Tasks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Completed
                </h3>
                <div className="space-y-2">
                  {todos.filter((t) => t.completed).length === 0 ? (
                    <p className="text-gray-400 text-sm">No completed tasks</p>
                  ) : (
                    todos
                      .filter((t) => t.completed)
                      .slice(0, 5)
                      .map((todo) => (
                        <div
                          key={todo.id}
                          className="text-sm text-gray-600 line-through"
                        >
                          {todo.text}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "timer":
        return (
          <FocusTimer
            activity={selectedActivity}
            timeLeft={timeLeft}
            isRunning={isRunning}
            mode={mode}
            formatTime={formatTime}
            start={start}
            pause={pause}
            reset={reset}
            switchMode={switchMode}
            onComplete={handleTimerComplete}
          />
        );

      case "history":
        return <ActivityHistory todos={todos as Activity[]} />;

      default:
        return null;
    }
  };

  // The main app UI (only shown when authenticated)
  const mainApp = (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <NavigationBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        uncompletedTasksCount={todos.filter((t) => !t.completed).length}
        onLogout={async () => {
          await supabase.auth.signOut();
        }}
      />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Zendue</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Master your schedule with disciplined precision
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">
                  Welcome,{" "}
                  {currentUser?.user_metadata?.full_name ||
                    currentUser?.email?.split("@")[0] ||
                    "User"}
                </p>
              </div>
            </div>

            {showNotificationPermission && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between gap-3">
                <p className="text-blue-700 text-sm font-medium">
                  Enable notifications to get reminded about activities
                </p>
                <button
                  onClick={requestNotificationPermission}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Enable
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="animate-fade-in">{renderActivePage()}</div>
        </div>
      </div>

      <NewActivityForm
        isOpen={showActivityForm}
        onSubmit={handleAddActivity}
        onCancel={() => setShowActivityForm(false)}
      />
    </div>
  );

  // Auth page switcher
  const authFallback =
    authPage === "login" ? (
      <Login onSwitchToSignup={() => setAuthPage("signup")} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthPage("login")} />
    );

  const fallback = showLanding ? (
    <Landing
      onGetStarted={() => {
        setShowLanding(false);
        setAuthPage("login");
      }}
    />
  ) : (
    authFallback
  );

  return <AuthGuard fallback={fallback}>{mainApp}</AuthGuard>;
}

export default App;
