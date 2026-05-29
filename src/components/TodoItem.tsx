import { useState } from "react";
import { Trash2, Edit2, CheckCircle, Clock, Save, X } from "lucide-react";
import type { Todo } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onIncrementPomo: (id: string) => void;
  onUpdate: (id: string, newText: string, newDueTime?: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onIncrementPomo,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueTime, setEditDueTime] = useState(todo.dueTime || "");

  const handleSave = () => {
    if (!editText.trim()) return;
    onUpdate(todo.id, editText, editDueTime || undefined);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDueTime(todo.dueTime || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 group hover:shadow-md transition-all duration-300">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 accent-primary-600 rounded cursor-pointer"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="border border-primary-300 rounded-lg px-3 py-2 outline-none w-full text-gray-900 focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-primary-600" />
              <input
                type="time"
                value={editDueTime}
                onChange={(e) => setEditDueTime(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none text-gray-900 text-sm focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        ) : (
          <p
            className={`text-lg font-medium ${todo.completed ? "line-through text-gray-400" : "text-gray-900"}`}
          >
            {todo.text}
          </p>
        )}

        {!isEditing && (
          <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-semibold">
              {todo.pomodoros} 🍅
            </span>
            {todo.dueTime && (
              <span className="flex items-center gap-1 text-gray-600">
                <Clock size={14} /> {todo.dueTime}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className={`flex gap-2 transition-all ${isEditing ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
              title="Save"
            >
              <Save size={20} />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              title="Cancel"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onIncrementPomo(todo.id)}
              className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
              title="Complete Pomodoro"
            >
              <CheckCircle size={20} />
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-primary-100 rounded-lg text-primary-600 transition-colors"
              title="Edit"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
