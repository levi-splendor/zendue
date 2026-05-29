// Dashboard Page - Main landing page with daily stats, streak, and upcoming activities
import { Flame, Target, Zap, Clock, Briefcase } from "lucide-react";
import type { Activity } from "../types";
import { useDashboard } from "../hooks/useDashboard";

interface DashboardProps {
  todos: Activity[];
  onStartActivity?: (activityId: string) => void;
  user?: any;
}

export function Dashboard({ todos, onStartActivity, user }: DashboardProps) {
  // derive stats from todos
  const { dailyStats, streak, completionPercentage } = useDashboard(
    todos as Activity[],
  );
  const displayName =
    (user && (user.user_metadata?.full_name || user.user_metadata?.name)) ||
    (user?.email ? user.email.split("@")[0] : "there");
  // Get upcoming activities (not completed, sorted by due time)
  const upcomingActivities = todos.filter((t) => !t.completed).slice(0, 4);
  const completedActivities = todos.filter((t) => t.completed).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {displayName}
        </h1>
        <p className="text-gray-600">
          You have {todos.filter((t) => !t.completed).length} tasks scheduled
          for today.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Create Activity Form + Stats */}
        <div className="col-span-1 space-y-6">
          {/* Create New Activity Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary-600" />
              Create New Activity
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Client Review Meeting"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary-600 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Email Notification
                  </span>
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
              >
                SCHEDULE ACTIVITY
              </button>
            </form>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Today's Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-yellow-500" />
                  <span className="text-sm text-gray-600">Focus Score</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {dailyStats.focusScore}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={18} className="text-red-500" />
                  <span className="text-sm text-gray-600">Streak</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {streak.currentStreak} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-blue-500" />
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {streak.totalActivitiesCompleted}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Productivity Score */}
          <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-lg shadow-sm border border-primary-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary-600 font-medium mb-1">
                  Productivity Score
                </p>
                <p className="text-4xl font-bold text-gray-900">
                  {completionPercentage}%
                </p>
              </div>
              <div className="w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#e0e7ff"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#0056cc"
                    strokeWidth="8"
                    strokeDasharray={`${(completionPercentage / 100) * 340} 340`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <text
                    x="60"
                    y="60"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold fill-gray-900"
                  >
                    {completionPercentage}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock size={20} className="text-primary-600" />
                Upcoming Tasks
              </h2>
              {upcomingActivities.length > 0 && (
                <span className="text-sm text-gray-500">
                  {upcomingActivities.length} tasks
                </span>
              )}
            </div>

            {upcomingActivities.length > 0 ? (
              <div className="space-y-2">
                {upcomingActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {activity.text}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {activity.dueTime} • {activity.duration || 25} min
                      </p>
                    </div>
                    <button
                      onClick={() => onStartActivity?.(activity.id)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No upcoming tasks. Great job!</p>
              </div>
            )}
          </div>

          {/* Recently Completed */}
          {completedActivities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Recently Completed
              </h3>
              <div className="space-y-2">
                {completedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-3"
                  >
                    <p className="text-sm text-gray-700">
                      <span className="text-green-600 font-semibold">✓</span>{" "}
                      {activity.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
