import React from "react";
import { Zap } from "lucide-react";

interface LandingProps {
  onGetStarted: () => void;
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-6 mx-auto shadow-md">
          <Zap size={36} className="text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Zendue</h1>
        <p className="text-gray-600 mb-8">
          A focused todo timer that blends disciplined Pomodoro workflow with
          activity tracking to help professionals get things done.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-md"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
