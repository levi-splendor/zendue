// Navigation Bar - Left Sidebar Navigation for Desktop (ChronosTask Style)
import type { ReactNode } from "react";
import { Home, CheckSquare, BarChart3, Settings, LogOut } from "lucide-react";

export type TabType = "home" | "tasks" | "timer" | "history";

interface NavigationBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  uncompletedTasksCount?: number;
  onLogout?: () => void;
}

export function NavigationBar({
  activeTab,
  onTabChange,
  uncompletedTasksCount,
  onLogout,
}: NavigationBarProps) {
  const mainTabs: Array<{ id: TabType; label: string; icon: ReactNode }> = [
    {
      id: "home",
      label: "Dashboard",
      icon: <Home size={24} />,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: (
        <div className="relative">
          <CheckSquare size={24} />
          {uncompletedTasksCount ? (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {uncompletedTasksCount > 9 ? "9+" : uncompletedTasksCount}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      id: "history",
      label: "Analytics",
      icon: <BarChart3 size={24} />,
    },
  ];

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChronosTask</h1>
            <p className="text-xs text-gray-500">Professional Edition</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-4 space-y-2">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
              activeTab === tab.id
                ? "bg-primary-50 text-primary-600 font-semibold shadow-sm"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span
              className={`flex-shrink-0 ${
                activeTab === tab.id ? "text-primary-600" : "text-gray-500"
              }`}
            >
              {tab.icon}
            </span>
            <span className="flex-1">{tab.label}</span>
            {tab.id === "tasks" && uncompletedTasksCount ? (
              <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {uncompletedTasksCount}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => onTabChange("timer")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
            activeTab === "timer"
              ? "bg-primary-50 text-primary-600 font-semibold shadow-sm"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Settings size={24} className="flex-shrink-0" />
          <span className="flex-1">Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-left"
        >
          <LogOut size={24} className="flex-shrink-0" />
          <span className="flex-1">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}

export default NavigationBar;
