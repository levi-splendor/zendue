// Reusable Card Components using Tailwind CSS
import { ReactNode } from "react";

// Basic glass card wrapper - used throughout the app
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// Stat card - displays metrics with icon and value
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  icon,
  label,
  value,
  subtext,
  trend,
}: StatCardProps) {
  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  };

  return (
    <Card className="flex items-start gap-4">
      <div className="p-3 bg-primary-100 rounded-lg text-primary-600">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtext && (
          <p className={`text-xs mt-1 ${trendColor[trend || "neutral"]}`}>
            {subtext}
          </p>
        )}
      </div>
    </Card>
  );
}

// Activity card - displays a single activity with metadata
interface ActivityCardProps {
  title: string;
  time?: string;
  category?: string;
  duration?: string;
  status?: "pending" | "active" | "completed";
  onClick?: () => void;
  actionButton?: ReactNode;
}

export function ActivityCard({
  title,
  time,
  category,
  duration,
  status,
  onClick,
  actionButton,
}: ActivityCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    active: "bg-blue-100 text-primary-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <Card
      onClick={onClick}
      className={`flex items-center justify-between gap-4 ${onClick ? "hover:bg-gray-50" : ""}`}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {time && <span className="text-sm text-gray-600">🕐 {time}</span>}
          {duration && (
            <span className="text-sm text-gray-600">⏱️ {duration}</span>
          )}
          {category && (
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
              {category}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {status && (
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[status]}`}
          >
            {status}
          </span>
        )}
        {actionButton}
      </div>
    </Card>
  );
}

// Progress card - shows completion with circular indicator
interface ProgressCardProps {
  label: string;
  percentage: number;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function ProgressCard({
  label,
  percentage,
  color = "primary",
  size = "md",
}: ProgressCardProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const colorClasses = {
    primary: "#0056cc",
    green: "#10b981",
    purple: "#a855f7",
    pink: "#ec4899",
  };

  return (
    <Card className="flex flex-col items-center justify-center text-center">
      <div className={`relative ${sizeClasses[size]} mb-4`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke={colorClasses[color as keyof typeof colorClasses]}
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 45 * (percentage / 100)} ${2 * Math.PI * 45}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">
            {percentage}%
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </Card>
  );
}

// Badge card - displays achievement badges
interface BadgeCardProps {
  icon: string;
  name: string;
  description: string;
  earnedAt?: string;
  tier?: "bronze" | "silver" | "gold" | "platinum";
}

export function BadgeCard({
  icon,
  name,
  description,
  earnedAt,
  tier,
}: BadgeCardProps) {
  const tierColors = {
    bronze: "border-orange-200 bg-orange-50",
    silver: "border-gray-300 bg-gray-50",
    gold: "border-yellow-200 bg-yellow-50",
    platinum: "border-purple-200 bg-purple-50",
  };

  return (
    <Card
      className={`flex flex-col items-center justify-center text-center py-8 border-2 ${
        tier ? tierColors[tier] : ""
      }`}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-1">{name}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      {earnedAt && (
        <p className="text-xs text-primary-600">
          Earned: {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
}

// Empty state card
interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyStateCard({
  icon = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </Card>
  );
}
