// New Activity Form - Create activities with advanced settings
import { useState } from "react";
import { X, Plus, Clock, Bell, Tag } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Activity, ActivityCategory, Reminder } from "../types";

interface NewActivityFormProps {
  onSubmit?: (activity: Partial<Activity>) => void;
  onCancel?: () => void;
  isOpen: boolean;
}

export function NewActivityForm({
  onSubmit,
  onCancel,
  isOpen,
}: NewActivityFormProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("09:00");
  const [duration, setDuration] = useState(25);
  const [category, setCategory] = useState<ActivityCategory>("work");
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", type: "both", minutesBefore: 5 },
  ]);

  const categories: ActivityCategory[] = [
    "work",
    "personal",
    "health",
    "learning",
    "other",
  ];

  const addReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      type: "both",
      minutesBefore: 10,
    };
    setReminders([...reminders, newReminder]);
  };

  const removeReminder = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      alert("Please enter a task name");
      return;
    }

    // Validate at least one reminder is set
    if (reminders.length === 0) {
      alert("Please add at least one reminder");
      return;
    }

    // Convert "13:30" to full timestamp for today
    const today = new Date();
    const [hours, minutes] = dueTime.split(":").map(Number);
    today.setHours(hours, minutes, 0, 0);
    const scheduledAt = today.toISOString();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to create an activity");
      return;
    }

    try {
      // Prepare activity data
      const activityData = {
        user_id: user.id,
        title: taskName.trim(),
        description: description.trim(),
        scheduled_at: scheduledAt,
        category: category,
        duration: duration,
        reminders: JSON.stringify(reminders), // Store reminders as JSON
        notified: false,
        created_at: new Date().toISOString(),
      };

      // Save to Supabase with proper error handling
      const { data: insertedActivity, error: insertError } = await supabase
        .from("activities")
        .insert([activityData])
        .select();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        alert(`Failed to save activity: ${insertError.message}`);
        return;
      }

      if (!insertedActivity || insertedActivity.length === 0) {
        alert("Activity created but response was empty");
        return;
      }

      console.log("✅ Activity created successfully:", insertedActivity[0]);

      // Notify parent component
      onSubmit?.({
        text: taskName.trim(),
        dueTime,
        description,
        category,
        duration,
        reminders,
      });

      // Reset form
      setTaskName("");
      setDescription("");
      setDueTime("09:00");
      setDuration(25);
      setCategory("work");
      setReminders([{ id: "1", type: "both", minutesBefore: 5 }]);

      // Close modal
      onCancel?.();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("An unexpected error occurred while creating the activity");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center md:p-4">
      <div className="w-full md:max-w-2xl bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-primary-600 text-sm font-semibold uppercase tracking-wide">
              Create New
            </p>
            <h2 className="text-2xl font-bold text-gray-900">Add Activity</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Task Name *
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What will you focus on?"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this activity..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Grid: Time and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Start Time
              </label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-500">
                <Clock size={20} className="text-primary-600" />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="bg-transparent text-gray-900 focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Duration (min)
              </label>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-primary-500">
                <Clock size={20} className="text-primary-600" />
                <input
                  type="number"
                  value={duration}
                  onChange={(e) =>
                    setDuration(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                  max="180"
                  className="bg-transparent text-gray-900 focus:outline-none w-full"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1 ${
                    category === cat
                      ? "bg-primary-600 text-white border border-primary-600"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:border-primary-300"
                  }`}
                >
                  <Tag size={16} />
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">
                Reminders
              </label>
              <button
                type="button"
                onClick={addReminder}
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                <Plus size={16} /> Add Reminder
              </button>
            </div>

            <div className="space-y-2">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-2 border border-gray-300 rounded-lg p-3"
                >
                  <Bell size={20} className="text-primary-600 flex-shrink-0" />
                  <input
                    type="number"
                    value={reminder.minutesBefore}
                    onChange={(e) => {
                      const updated = reminders.map((r) =>
                        r.id === reminder.id
                          ? {
                              ...r,
                              minutesBefore: parseInt(e.target.value) || 0,
                            }
                          : r,
                      );
                      setReminders(updated);
                    }}
                    min="0"
                    max="120"
                    className="border border-gray-300 rounded px-2 py-1 w-12 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="text-gray-600 text-sm">minutes before</span>

                  <select
                    value={reminder.type}
                    onChange={(e) => {
                      const updated = reminders.map((r) =>
                        r.id === reminder.id
                          ? {
                              ...r,
                              type: e.target.value as
                                | "email"
                                | "browser"
                                | "both",
                            }
                          : r,
                      );
                      setReminders(updated);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ml-auto"
                  >
                    <option value="both">Email & Browser</option>
                    <option value="email">Email Only</option>
                    <option value="browser">Browser Only</option>
                  </select>

                  {reminders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReminder(reminder.id)}
                      className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-red-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Create Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewActivityForm;
