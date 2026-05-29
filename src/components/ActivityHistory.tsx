// Activity History Page - Performance metrics, badges, and completion statistics
import { TrendingUp, Award, Clock, CheckCircle2 } from "lucide-react";
import { Card, StatCard, BadgeCard, EmptyStateCard } from "./Cards";
import type { Activity } from "../types";
import { format } from "date-fns";

interface ActivityHistoryProps {
  todos: Activity[];
}

export function ActivityHistory({ todos }: ActivityHistoryProps) {
  // Simulated achievements/badges - will come from backend
  const badges = [
    {
      icon: "🔥",
      name: "Unstoppable Flow",
      description: "You've hit your daily focus targets for 5 consecutive days",
      earnedAt: new Date().toISOString(),
      tier: "gold" as const,
    },
    {
      icon: "⭐",
      name: "5-Day Badge",
      description: "Gold Tier Achieved",
      earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tier: "gold" as const,
    },
    {
      icon: "🚀",
      name: "Speed Runner",
      description: "Complete 3 tasks in under 1 hour",
      tier: "silver" as const,
    },
    {
      icon: "🎯",
      name: "Focus Master",
      description: "Complete 50 tasks total",
      tier: "platinum" as const,
    },
  ];

  // Simulated weekly completion data
  const weeklyData = [12, 8, 14, 11, 15, 9, 13];
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

  // Get completed activities sorted by date
  const completedActivities = todos
    .filter((t) => t.completed && t.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt || 0).getTime() -
        new Date(a.completedAt || 0).getTime(),
    );

  // Calculate statistics
  const totalCompleted = todos.filter((t) => t.completed).length;
  const totalTimeSpent = todos.reduce((acc, t) => acc + (t.timeSpent || 0), 0);
  const averageSessionTime =
    totalCompleted > 0 ? Math.round(totalTimeSpent / totalCompleted / 60) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Review your productivity and achievements
        </p>
      </div>

      {/* Active Streak Highlight */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🔥</div>
          <div>
            <p className="text-orange-600 text-sm font-bold mb-1">
              ACTIVE STREAK
            </p>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Unstoppable Flow
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              You've hit your daily focus targets for 5 consecutive days. Keep
              the momentum going.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-5xl font-bold text-orange-600">5</span>
          <span className="text-gray-600">DAYS</span>
        </div>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<CheckCircle2 size={24} />}
          label="Tasks Completed"
          value={totalCompleted}
          subtext="All time"
        />
        <StatCard
          icon={<Clock size={24} />}
          label="Avg Session Time"
          value={`${averageSessionTime} min`}
          subtext="Well balanced"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          label="Focus Score"
          value="92%"
          subtext="Excellent consistency ↑"
          trend="up"
        />
      </div>

      {/* Weekly Completion Chart */}
      <Card>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Weekly Completion
          </h2>
          <p className="text-sm text-gray-600">Tasks completed per day</p>
        </div>

        <div className="flex items-end justify-around h-48 gap-2 px-4">
          {weeklyData.map((count, idx) => {
            const maxValue = Math.max(...weeklyData);
            const percentage = (count / maxValue) * 100;

            return (
              <div key={idx} className="flex flex-col items-center flex-1">
                <div className="w-full flex items-end justify-center">
                  <div
                    className="w-3/4 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all hover:from-primary-500 hover:to-primary-300"
                    style={{ height: `${percentage}%`, minHeight: "8px" }}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-3 font-medium">
                  {weekDays[idx]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-primary-500 rounded-full" />
          <span>
            Average: {Math.round(weeklyData.reduce((a, b) => a + b) / 7)}{" "}
            tasks/day
          </span>
        </div>
      </Card>

      {/* Achievements/Badges Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Award className="text-yellow-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, idx) => (
            <BadgeCard
              key={idx}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              earnedAt={badge.earnedAt}
              tier={badge.tier}
            />
          ))}
        </div>
      </div>

      {/* Tasks Completed Section */}
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Tasks Completed ({completedActivities.length})
          </h2>
          <p className="text-sm text-gray-600">All completed tasks</p>
        </div>

        {completedActivities.length > 0 ? (
          <div className="space-y-3">
            {completedActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {activity.text}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Completed{" "}
                      {activity.completedAt
                        ? format(
                            new Date(activity.completedAt),
                            "MMM d • h:mm a",
                          )
                        : "recently"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.category || "Work"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {activity.timeSpent
                      ? `${Math.round(activity.timeSpent / 60)} min`
                      : "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyStateCard
            icon="✅"
            title="No completed activities yet"
            description="Complete your first activity to see your history here."
          />
        )}
      </Card>
    </div>
  );
}

export default ActivityHistory;
