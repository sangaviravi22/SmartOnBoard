import { useState, useEffect } from "react";
import { UserProfile, LearningPlan, AssessmentResult } from "./types";
import LandingView from "./components/LandingView";
import AuthView from "./components/AuthView";
import OnboardingView from "./components/OnboardingView";
import AssessmentView from "./components/AssessmentView";
import DashboardView from "./components/DashboardView";
import { motion, AnimatePresence } from "motion/react";
import { apiService } from "./services/apiService";
import { LanguageContext } from "./contexts/LanguageContext";
import { Language } from "./services/translations";

function AppContent() {
  const [view, setView] = useState<"landing" | "auth" | "onboarding" | "assessment" | "dashboard">("landing");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [learningPlan, setLearningPlan] = useState<LearningPlan | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [language, setLanguageState] = useState<Language>("English");

  // Load state from localStorage on init
  useEffect(() => {
    const savedUser = localStorage.getItem("smartonboard_user");
    const savedPlan = localStorage.getItem("smartonboard_plan");
    const savedResult = localStorage.getItem("smartonboard_result");
    const savedLanguage = localStorage.getItem("smartonboard_language");

    if (savedLanguage) {
      setLanguageState(savedLanguage as Language);
    }

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Set language from user profile
      if (parsedUser.language) {
        setLanguageState(parsedUser.language);
      }
      if (savedPlan) setLearningPlan(JSON.parse(savedPlan));
      if (savedResult) setAssessmentResult(JSON.parse(savedResult));

      if (parsedUser.onboarded) {
        if (savedPlan) {
          setView("dashboard");
        } else if (savedResult) {
          setView("assessment"); // Resume assessment results view if plan not yet generated
        } else {
          setView("assessment");
        }
      } else {
        setView("onboarding");
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("smartonboard_user", JSON.stringify(user));
    }
    if (learningPlan) localStorage.setItem("smartonboard_plan", JSON.stringify(learningPlan));
    if (assessmentResult) localStorage.setItem("smartonboard_result", JSON.stringify(assessmentResult));
  }, [user, learningPlan, assessmentResult]);

  // Save and update language
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("smartonboard_language", newLanguage);
    
    if (user) {
      // Update user language in state
      const updatedUser = { ...user, language: newLanguage };
      setUser(updatedUser);
      
      // Update in database
      apiService.updateUserSettings(user.id, {
        language: newLanguage,
        emailNotifications: user.emailNotifications ?? true,
        darkMode: user.darkMode ?? false
      }).catch(err => console.error("Failed to update language in database:", err));
    }
  };

  const handleLogin = (id: string, email: string, user: UserProfile, plan?: LearningPlan) => {
    // User already stored in database via apiService.login() in AuthView
    setUser(user);
    
    // If user has existing learning plan from DB, restore it
    if (plan && plan.id) {
      setLearningPlan(plan);
      setView("dashboard");
    } else {
      // New user without plan yet
      setView("onboarding");
    }
  };

  const handleOnboardingComplete = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data, onboarded: true };
    setUser(updatedUser);
    
    // Update user settings in database
    try {
      await apiService.updateUserSettings(user.id, {
        language: data.language || "English",
        emailNotifications: true,
        darkMode: false
      });
    } catch (err) {
      console.error("Failed to update user settings:", err);
    }
    
    setView("assessment");
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
  };

  const handlePlanGenerated = async (plan: LearningPlan) => {
    if (!user) return;
    
    try {
      // Save the learning plan to database
      await apiService.createLearningPlan(
        user.id,
        plan.title,
        plan.targetSkill,
        plan.days
      );
      console.log("✓ Learning plan saved to database");
    } catch (err) {
      console.error("Failed to save learning plan to database:", err);
      // Still proceed even if save fails, plan will be in state
    }
    
    setLearningPlan(plan);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("smartonboard_user");
    localStorage.removeItem("smartonboard_plan");
    localStorage.removeItem("smartonboard_result");
    setUser(null);
    setLearningPlan(null);
    setAssessmentResult(null);
    setView("landing");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange }}>
      <div className="min-h-screen bg-bg selection:bg-primary/10 selection:text-primary">
        <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LandingView onGetStarted={() => setView("auth")} />
          </motion.div>
        )}

        {view === "auth" && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AuthView onLogin={handleLogin} onBack={() => setView("landing")} />
          </motion.div>
        )}

        {view === "onboarding" && user && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <OnboardingView user={user} onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {view === "assessment" && user && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AssessmentView 
              user={user} 
              onComplete={handleAssessmentComplete}
              onPlanGenerated={handlePlanGenerated}
              savedResult={assessmentResult}
            />
          </motion.div>
        )}

        {view === "dashboard" && user && learningPlan && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DashboardView 
              user={user} 
              plan={learningPlan} 
              onUpdatePlan={setLearningPlan} 
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </LanguageContext.Provider>
  );
}

export default function App() {
  return <AppContent />;
}

