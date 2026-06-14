import { useState } from "react";
import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail, ChevronRight, Lock } from "lucide-react";
import { apiService } from "../services/apiService";
import { UserProfile, LearningPlan } from "../types";

interface AuthViewProps {
  onLogin: (id: string, email: string, user: UserProfile, plan?: LearningPlan) => void;
  onBack: () => void;
}

export default function AuthView({ onLogin, onBack }: AuthViewProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Call backend API to store/retrieve user
      const response = await apiService.login(email);
      if (response && response.id) {
        // User is created/found in DB
        const user: UserProfile = {
          id: response.id,
          email: response.email,
          role: response.role || "learner",
          skills: response.skills ? (typeof response.skills === 'string' ? JSON.parse(response.skills) : response.skills) : [],
          experienceLevel: response.experienceLevel || "Beginner",
          language: response.language || "English",
          onboarded: response.onboarded || false,
        };

        // Try to fetch existing learning plan from database
        let existingPlan: LearningPlan | undefined;
        try {
          existingPlan = await apiService.getLearningPlan(response.id);
        } catch (err) {
          // No plan found yet, that's okay
          console.log("No existing plan found");
        }

        // Call onLogin with user data and existing plan if found
        onLogin(response.id, email, user, existingPlan);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: any) {
      setError("Failed to connect to server. Make sure backend is running on localhost:3001");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-10 rounded-3xl border border-border shadow-2xl relative overflow-hidden"
      >
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-text-muted hover:text-text-main transition"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex justify-center mb-8 pt-4">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Lock size={28} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Welcome</h2>
        <p className="text-text-muted text-center mb-10 text-sm">Enter your email to continue your journey</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full bg-slate-50 border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Continue Journey
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-xs text-text-muted">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span>
        </div>
      </motion.div>
    </div>
  );
}
