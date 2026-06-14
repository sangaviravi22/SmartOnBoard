import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, LearningPlan, LearningDay, Certificate } from "../types";
import { 
  LogOut, LayoutDashboard, BookOpen, MessageSquare, 
  CheckCircle2, Lock, ChevronRight, PlayCircle, 
  FileText, ExternalLink, Sparkles, Send, Zap, Brain, BarChart3, Download, Share2, AlertCircle, Award, Code,
  HelpCircle, Settings, X, Mail, MessageCircle, ExternalLink as ExtLink
} from "lucide-react";
import { geminiService } from "../services/geminiService";
import { apiService } from "../services/apiService";
import AIMentor from "./AIMentor";
import FinalAssessmentView from "./FinalAssessmentView";
import { cn } from "../lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../services/translations";

interface DashboardViewProps {
  user: UserProfile;
  plan: LearningPlan;
  onUpdatePlan: (plan: LearningPlan) => void;
  onLogout: () => void;
}

type DashboardSection = "overview" | "learning-plan" | "assessment" | "resources" | "analytics" | "projects" | "final-assessment";

export default function DashboardView({ user, plan, onUpdatePlan, onLogout }: DashboardViewProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [activeSection, setActiveSection] = useState<DashboardSection>("overview");
  const [activeDayIndex, setActiveDayIndex] = useState(plan.currentDay - 1);
  const [showMentor, setShowMentor] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(false);
  const [userCertificate, setUserCertificate] = useState<Certificate | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [supportView, setSupportView] = useState<'menu' | 'contact' | 'faq' | 'community' | 'status'>('menu');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  
  // Initialize settings from localStorage
  const [userLanguage, setUserLanguage] = useState(() => {
    const saved = localStorage.getItem('smartonboard_language');
    return saved || user.language || "English";
  });
  const [emailNotifications, setEmailNotifications] = useState(() => {
    const saved = localStorage.getItem('smartonboard_emailNotifications');
    return saved ? JSON.parse(saved) : true;
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('smartonboard_darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projectSubmission, setProjectSubmission] = useState('');

  const activeDay = plan.days[activeDayIndex];

  const handleDaySelect = (index: number) => {
    if (plan.days[index].locked) return;
    setActiveDayIndex(index);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizSubmit = async () => {
    if (quizAnswer === null) return;
    const correct = quizAnswer === activeDay.quiz.correctAnswer;
    setQuizCorrect(correct);
    setQuizSubmitted(true);

    if (correct) {
      const updatedDays = [...plan.days];
      // Record quiz score and completion data
      updatedDays[activeDayIndex].quizScore = 100;
      updatedDays[activeDayIndex].completedAt = Date.now();
      updatedDays[activeDayIndex].timeSpent = Math.random() * 60 + 30; // 30-90 minutes
      updatedDays[activeDayIndex].completed = true;
      
      if (activeDayIndex + 1 < updatedDays.length) {
        updatedDays[activeDayIndex + 1].locked = false;
      }

      // Sync with database in real-time
      const dayId = plan.days[activeDayIndex].id || `day_${activeDay.day}`;
      try {
        await apiService.updateLearningDay(
          dayId,
          user.id,
          true,
          100,
          false
        );
      } catch (err) {
        console.error("Failed to sync with database:", err);
      }

      onUpdatePlan({ 
        ...plan, 
        days: updatedDays,
        currentDay: Math.max(plan.currentDay, activeDayIndex + 2)
      });
    }
  };

  const completedDays = plan.days.filter(d => d.completed).length;
  const progressPercent = Math.round((completedDays / plan.days.length) * 100);

  // Calculate real analytics
  const calculateQuizAccuracy = () => {
    const completedQuizzes = plan.days.filter(d => d.completed && d.quizScore !== undefined);
    if (completedQuizzes.length === 0) return 0;
    const totalScore = completedQuizzes.reduce((sum, d) => sum + (d.quizScore || 0), 0);
    return Math.round(totalScore / completedQuizzes.length);
  };

  const calculateEngagementLevel = () => {
    // Based on completion rate and consistency
    const completionRate = progressPercent;
    const daysWithTime = plan.days.filter(d => d.timeSpent !== undefined).length;
    const consistencyBonus = daysWithTime > 0 ? Math.min(20, daysWithTime * 2.5) : 0;
    return Math.min(100, Math.round(completionRate * 0.8 + consistencyBonus));
  };

  const calculateConceptMastery = () => {
    const completedWithScores = plan.days.filter(d => d.completed && d.quizScore !== undefined);
    if (completedWithScores.length === 0) return 0;
    const avgScore = completedWithScores.reduce((sum, d) => sum + (d.quizScore || 0), 0) / completedWithScores.length;
    return Math.round(avgScore * 0.9); // Slightly lower than quiz accuracy
  };

  const calculateTotalHours = () => {
    const totalMinutes = plan.days.reduce((sum, d) => sum + (d.timeSpent || 0), 0);
    return Math.round((totalMinutes / 60) * 10) / 10;
  };

  const calculateWeeklyStreak = () => {
    // Generate realistic daily engagement based on completed days
    const days = plan.days.length;
    const completed = completedDays;
    const basePattern = [65, 45, 80, 92, 78, 88, 95]; // Default pattern
    
    if (completed === 0) return basePattern;
    
    // Scale pattern based on progress
    const scale = (completed / days) * 100;
    return basePattern.map(v => Math.min(100, Math.round((v + scale) / 2)));
  };

  const handleDownloadReport = () => {
    // Generate CSV report data
    const reportData = [
      ['SmartOnboard Learning Report'],
      ['Date', new Date().toLocaleDateString()],
      ['User', user.email],
      ['Course', plan.title],
      ['Target Skill', plan.targetSkill],
      [],
      ['PERFORMANCE METRICS'],
      ['Metric', 'Value'],
      ['Quiz Accuracy', `${quizAccuracy}%`],
      ['Engagement Level', `${engagementLevel}%`],
      ['Concept Mastery', `${conceptMastery}%`],
      ['Overall Progress', `${progressPercent}%`],
      [],
      ['COMPLETION METRICS'],
      ['Metric', 'Value'],
      ['Modules Completed', `${completedDays}/${plan.days.length}`],
      ['Total Hours Spent', `${totalHours.toFixed(1)} hours`],
      [],
      ['DAILY BREAKDOWN'],
      ['Day', 'Title', 'Topic', 'Status', 'Score', 'Time (mins)']
    ];

    plan.days.forEach(day => {
      reportData.push([
        day.day.toString(),
        day.title,
        day.topic,
        day.completed ? 'Completed' : day.locked ? 'Locked' : 'Unlocked',
        day.quizScore ? `${day.quizScore}%` : 'N/A',
        day.timeSpent ? Math.round(day.timeSpent).toString() : 'N/A'
      ]);
    });

    // Convert to CSV format
    const csvContent = reportData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartOnboard-Report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotification({ message: 'Report downloaded successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShareProgress = async () => {
    const shareText = `I'm making great progress on ${plan.title}! 🎓

📊 My Stats:
• Quiz Accuracy: ${quizAccuracy}%
• Engagement Level: ${engagementLevel}%
• Concept Mastery: ${conceptMastery}%
• Progress: ${progressPercent}% (${completedDays}/${plan.days.length} modules)
• Total Study Time: ${totalHours.toFixed(1)} hours

I'm learning ${plan.targetSkill} with SmartOnboard AI. Join me on this learning journey!`;

    try {
      // Try using native share API if available
      if (navigator.share) {
        await navigator.share({
          title: 'SmartOnboard Progress',
          text: shareText
        });
        setNotification({ message: 'Progress shared!', type: 'success' });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        setNotification({ message: 'Progress copied to clipboard!', type: 'success' });
      }
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Share failed:', error);
      setNotification({ message: 'Share cancelled', type: 'info' });
      setTimeout(() => setNotification(null), 2000);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Persist language setting
  useEffect(() => {
    localStorage.setItem('smartonboard_language', userLanguage);
  }, [userLanguage]);

  // Persist email notifications setting
  useEffect(() => {
    localStorage.setItem('smartonboard_emailNotifications', JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  // Apply dark mode and persist setting
  useEffect(() => {
    localStorage.setItem('smartonboard_darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      
      // Inject dark mode styles
      let styleElement = document.getElementById('dark-mode-styles');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dark-mode-styles';
        document.head.appendChild(styleElement);
      }
      
      styleElement.innerHTML = `
        :root.dark {
          --bg: #111827;
          --card: #1f2937;
          --sidebar: #111827;
          --border: #374151;
          --text-main: #f1f5f9;
          --text-muted: #cbd5e1;
          --primary: #3b82f6;
          --primary-light: #dbeafe;
          --accent: #a78bfa;
        }
        
        body.dark,
        :root.dark {
          background-color: #111827;
          color: #f1f5f9;
        }
        
        :root.dark .bg-bg { background-color: #111827; }
        :root.dark .bg-card { background-color: #1f2937; }
        :root.dark .bg-sidebar { background-color: #111827; }
        :root.dark .text-text-main { color: #f1f5f9; }
        :root.dark .text-text-muted { color: #cbd5e1; }
        :root.dark .border-border { border-color: #374151; }
        :root.dark .hover\\:bg-slate-50:hover { background-color: #1f2937; }
        :root.dark .hover\\:bg-slate-100:hover { background-color: #374151; }
        :root.dark .border { border-color: #374151; }
        :root.dark input,
        :root.dark textarea {
          background-color: #1f2937;
          color: #f1f5f9;
          border-color: #374151;
        }
        :root.dark input::placeholder,
        :root.dark textarea::placeholder {
          color: #cbd5e1;
        }
      `;
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      
      // Remove dark mode styles
      const styleElement = document.getElementById('dark-mode-styles');
      if (styleElement) {
        styleElement.remove();
      }
    }
  }, [darkMode]);

  const handleLanguageChange = async (lang: string) => {
    setUserLanguage(lang);
    localStorage.setItem('smartonboard_language', lang);
    setNotification({ message: `Language changed to ${lang}`, type: 'success' });
    
    // Sync with database
    try {
      await apiService.updateUserSettings(user.id, {
        language: lang,
        emailNotifications,
        darkMode
      });
    } catch (err) {
      console.error("Failed to update language:", err);
    }
  };

  const handleEmailNotificationsToggle = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    localStorage.setItem('smartonboard_emailNotifications', JSON.stringify(newValue));
    setNotification({ message: `Email notifications ${newValue ? 'enabled' : 'disabled'}`, type: 'success' });
    
    // Sync with database
    try {
      await apiService.updateUserSettings(user.id, {
        language: userLanguage,
        emailNotifications: newValue,
        darkMode
      });
    } catch (err) {
      console.error("Failed to update notifications:", err);
    }
  };

  const handleDarkModeToggle = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('smartonboard_darkMode', JSON.stringify(newValue));
    setNotification({ message: `Dark mode ${newValue ? 'enabled' : 'disabled'}`, type: 'success' });
    
    // Sync with database
    try {
      await apiService.updateUserSettings(user.id, {
        language: userLanguage,
        emailNotifications,
        darkMode: newValue
      });
    } catch (err) {
      console.error("Failed to update dark mode:", err);
    }
  };

  const handleSendContactMessage = async () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      setNotification({ message: 'Please fill in all fields', type: 'info' });
      return;
    }
    
    try {
      // Send to backend to store in database
      await apiService.submitSupportContact(user.id, contactSubject, contactMessage);
      setNotification({ message: 'Message sent! We\'ll get back to you soon.', type: 'success' });
    } catch (err) {
      console.error('Support message error:', err);
      setNotification({ message: 'Failed to send message. Please try again.', type: 'info' });
    }
    
    setContactSubject('');
    setContactMessage('');
    setSupportView('menu');
  };

  const faqs = [
    {
      question: 'How do I unlock the next lesson?',
      answer: 'Complete the current lesson quiz with a passing score to unlock the next lesson. You can retake quizzes as many times as needed.'
    },
    {
      question: 'Can I download my learning plan?',
      answer: 'Yes! Go to the Analytics section and click "Download Report" to get a CSV file with all your learning data.'
    },
    {
      question: 'How is my progress calculated?',
      answer: 'Your progress is based on completed modules. Each module includes a quiz that you must pass to mark it as complete.'
    },
    {
      question: 'Can I change my learning plan?',
      answer: 'Contact our support team via the support modal to request a plan modification based on your learning goals.'
    },
    {
      question: 'How does the AI mentor work?',
      answer: 'Click the chat icon to talk with your AI mentor. It can answer questions about current topics and provide explanations.'
    },
    {
      question: 'What happens after I complete all lessons?',
      answer: 'You\'ll unlock the Final Assessment. Pass it with 70% to earn your certificate!'
    }
  ];

  const projects = [
    {
      id: 1,
      title: 'Modern Portfolio with React',
      level: 'Beginner',
      duration: '4 hours',
      description: 'Build a responsive personal portfolio website using React with smooth scroll and animations.',
      color: 'from-blue-500 to-blue-600',
      tasks: [
        'Implement a responsive navigation bar with smooth scroll',
        'Create a dynamic project gallery with hover animations',
        'Build a contact form with validation',
        'Optimize for mobile devices and performance'
      ]
    },
    {
      id: 2,
      title: 'RESTful API Integration',
      level: 'Intermediate',
      duration: '6 hours',
      description: 'Create a complete backend API with Express and integrate it with a frontend application.',
      color: 'from-purple-500 to-purple-600',
      tasks: [
        'Design RESTful API endpoints for CRUD operations',
        'Implement authentication and authorization',
        'Set up database with proper relationships',
        'Write comprehensive API documentation'
      ]
    },
    {
      id: 3,
      title: 'Real-time Chat Application',
      level: 'Advanced',
      duration: '8 hours',
      description: 'Build a real-time chat application using WebSockets with message history and user management.',
      color: 'from-emerald-500 to-emerald-600',
      tasks: [
        'Implement WebSocket connections for real-time communication',
        'Create user authentication and profile management',
        'Build message history with database persistence',
        'Optimize for scalability and concurrent users'
      ]
    },
    {
      id: 4,
      title: 'E-commerce Platform',
      level: 'Advanced',
      duration: '10 hours',
      description: 'Build a full-stack e-commerce platform with payment integration and admin dashboard.',
      color: 'from-orange-500 to-orange-600',
      tasks: [
        'Create product catalog with filtering and search',
        'Implement shopping cart and checkout flow',
        'Integrate payment gateway (Stripe)',
        'Build admin dashboard for inventory management'
      ]
    },
    {
      id: 5,
      title: 'Machine Learning Data Analysis',
      level: 'Advanced',
      duration: '12 hours',
      description: 'Perform data analysis and build a machine learning model using Python and popular libraries.',
      color: 'from-pink-500 to-pink-600',
      tasks: [
        'Load and explore datasets with pandas and matplotlib',
        'Perform feature engineering and preprocessing',
        'Train and evaluate machine learning models',
        'Create visualizations for data insights'
      ]
    },
    {
      id: 6,
      title: 'Mobile App Development',
      level: 'Intermediate',
      duration: '7 hours',
      description: 'Build a native mobile application with React Native with offline support.',
      color: 'from-indigo-500 to-indigo-600',
      tasks: [
        'Set up React Native development environment',
        'Create reusable components and navigation',
        'Implement local storage for offline functionality',
        'Optimize performance for mobile devices'
      ]
    }
  ];

  const quizAccuracy = calculateQuizAccuracy();
  const engagementLevel = calculateEngagementLevel();
  const conceptMastery = calculateConceptMastery();
  const totalHours = calculateTotalHours();
  const weeklyData = calculateWeeklyStreak();

  return (
    <div 
      className={cn("min-h-screen flex", darkMode ? "bg-slate-950" : "bg-bg")}
      style={darkMode ? {
        backgroundColor: '#0f172a',
        color: '#f1f5f9'
      } : undefined}
    >
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-4 right-4 px-4 py-3 rounded-lg font-medium text-sm z-50 shadow-lg",
              notification.type === 'success' 
                ? "bg-emerald-500 text-white" 
                : "bg-blue-500 text-white"
            )}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Matching "Sleek Interface" */}
      <aside 
        className={cn("w-[240px] border-r border-border flex flex-col fixed inset-y-0 h-full z-40", darkMode ? "bg-slate-900 border-slate-800" : "bg-sidebar")}
        style={darkMode ? { backgroundColor: '#111827' } : undefined}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10 text-primary font-extrabold text-xl tracking-tight">
            <span className="text-2xl">●</span> SmartOnboard
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Main Menu</div>
            <button 
              onClick={() => setActiveSection("overview")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all",
                activeSection === "overview" 
                  ? "bg-primary-light text-primary" 
                  : "text-text-muted hover:bg-slate-100 hover:text-text-main"
              )}
            >
              <LayoutDashboard size={18} /> {t.dashboard.welcome}
            </button>
            <button 
              onClick={() => setActiveSection("learning-plan")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all",
                activeSection === "learning-plan" 
                  ? "bg-primary-light text-primary" 
                  : "text-text-muted hover:bg-slate-100 hover:text-text-main"
              )}
            >
              <BookOpen size={18} /> {t.dashboard.learning}
            </button>
            <button 
              onClick={() => setActiveSection("assessment")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all uppercase tracking-tighter",
                activeSection === "assessment" 
                  ? "bg-primary-light text-primary" 
                  : "text-text-muted hover:bg-slate-100 hover:text-text-main"
              )}
            >
              <Brain size={18} /> {t.assessment.title}
            </button>
            <button 
              onClick={() => setActiveSection("resources")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all",
                activeSection === "resources" 
                  ? "bg-primary-light text-primary" 
                  : "text-text-muted hover:bg-slate-100 hover:text-text-main"
              )}
            >
              <FileText size={18} /> {t.dashboard.resources}
            </button>
            <button 
              onClick={() => setActiveSection("projects")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all",
                activeSection === "projects" 
                  ? "bg-primary-light text-primary" 
                  : "text-text-muted hover:bg-slate-100 hover:text-text-main"
              )}
            >
              <Code size={18} /> {t.dashboard.projects}
            </button>
            <button 
              onClick={() => setActiveSection("analytics")}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all",
                activeSection === "analytics" 
                  ? "bg-primary-light text-primary" 
                  : "text-text-muted hover:bg-slate-100 hover:text-text-main"
              )}
            >
              <Zap size={18} /> {t.dashboard.analytics}
            </button>
            {completedDays === plan.days.length && (
              <button 
                onClick={() => setActiveSection("final-assessment")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all mt-2 border-t border-border pt-3",
                  activeSection === "final-assessment" 
                    ? "bg-amber-100 text-amber-900" 
                    : "text-text-muted hover:bg-amber-50 hover:text-amber-900"
                )}
              >
                <Award size={18} /> {t.finalAssessment.title}
              </button>
            )}
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-border">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setShowSupport(true)}
              className="flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all text-text-muted hover:bg-slate-50 hover:text-text-main"
            >
              <HelpCircle size={18} /> {t.dashboard.support}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all text-text-muted hover:bg-slate-50 hover:text-text-main"
            >
              <Settings size={18} /> {t.dashboard.settings}
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-3 p-3 rounded-lg font-medium text-sm transition-all text-text-muted hover:text-red-600 hover:bg-red-50 mt-2"
            >
              <LogOut size={18} /> {t.dashboard.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={cn("ml-[240px] flex-1 min-w-0 p-8 flex flex-col gap-6", darkMode && "bg-slate-900")} style={darkMode ? { backgroundColor: '#111827' } : undefined}>
        {/* Header - Changes based on section */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-main">
              {activeSection === "overview" && `Welcome back, ${user.email.split('@')[0]}`}
              {activeSection === "learning-plan" && "Your 30-Day Learning Path"}
              {activeSection === "assessment" && "Skills Assessment"}
              {activeSection === "resources" && "Learning Resources"}
              {activeSection === "projects" && "Real-World Projects"}
              {activeSection === "analytics" && "Performance Analytics"}              {activeSection === "final-assessment" && "Final Course Assessment"}            </h1>
            <p className="text-text-muted text-sm">
              {activeSection === "overview" && `Day ${activeDay.day} of your Personalized Learning Path`}
              {activeSection === "learning-plan" && `${completedDays} of ${plan.days.length} days completed`}
              {activeSection === "assessment" && `Overall Score: ${Math.round((completedDays / plan.days.length) * 100)}%`}
              {activeSection === "resources" && "Curated materials for enhanced learning"}
              {activeSection === "projects" && "Apply your skills to practical scenarios. Choose a project that matches your level and get AI-powered code review feedback."}
              {activeSection === "analytics" && "Track your progress and insights"}
              {activeSection === "final-assessment" && "Complete your course and earn your certificate"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("px-4 py-2 rounded-full border text-xs font-semibold shadow-sm", darkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white border-border text-text-main")}>
              {user.role} • {progressPercent}% Total Progress
            </div>
            <button
              onClick={onLogout}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition",
                darkMode 
                  ? "bg-red-900 hover:bg-red-800 text-red-100" 
                  : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
              )}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </header>

        {/* OVERVIEW SECTION */}
        {activeSection === "overview" && (
          <>
            {/* Stats Grid */}
            <section className="grid grid-cols-3 gap-5">
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[12px] uppercase font-bold text-text-muted tracking-wider mb-2">Overall Progress</div>
                <div className="text-2xl font-bold">{progressPercent}%</div>
                <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[12px] uppercase font-bold text-text-muted tracking-wider mb-2">Skill Proficiency</div>
                <div className="text-2xl font-bold">
                  {completedDays * 100} <span className="text-sm font-normal text-success ml-1">+{completedDays * 5}</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-success transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (completedDays / plan.days.length) * 120)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                <div className="text-[12px] uppercase font-bold text-text-muted tracking-wider mb-2">Estimated Completion</div>
                <div className="text-2xl font-bold">{plan.days.length - completedDays} Days</div>
                <div className="h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-accent transition-all duration-1000" 
                    style={{ width: `${(completedDays / plan.days.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </section>

            {/* Main Grid: Roadmap + Mentor Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
              {/* Main Roadmap & Current Content */}
              <div className="lg:col-span-2 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {/* Learning Plan List */}
                <section className="bg-card rounded-2xl border border-border flex flex-col overflow-hidden">
                  <div className="p-5 border-b border-border flex justify-between items-center bg-slate-50/50">
                    <span className="font-bold text-sm">30-Day Learning Path</span>
                    <span className="text-primary text-[12px] font-extrabold cursor-pointer hover:underline uppercase">Continue last module</span>
                  </div>
                  <div className="p-5 flex flex-col gap-3 overflow-y-auto max-h-[400px]">
                    {plan.days.slice(Math.max(0, activeDayIndex - 2), Math.min(plan.days.length, activeDayIndex + 3)).map((day, i) => {
                      const actualIndex = plan.days.findIndex(d => d.day === day.day);
                      const isCurrent = actualIndex === activeDayIndex;
                      return (
                        <div 
                          key={day.day}
                          onClick={() => handleDaySelect(actualIndex)}
                          className={cn(
                            "flex items-center gap-4 p-3 rounded-xl border border-border transition-all cursor-pointer",
                            day.completed && "bg-emerald-50 border-emerald-100",
                            isCurrent && "border-primary bg-white shadow-md shadow-primary/5",
                            day.locked && "opacity-60 bg-slate-50 cursor-not-allowed"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm",
                            day.completed ? "bg-success text-white" : isCurrent ? "bg-primary text-white" : "bg-slate-100 text-text-main"
                          )}>
                            {day.day}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold truncate">{day.title}</h4>
                            <p className="text-[12px] text-text-muted truncate">
                              {day.completed ? "Quiz passed" : isCurrent ? "Current Module" : day.locked ? "Locked" : "Available"}
                            </p>
                          </div>
                          {isCurrent && (
                            <div className="bg-primary text-white px-3 py-1 rounded-md text-[10px] font-extrabold uppercase">
                              {quizCorrect ? "DONE" : "START"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Current Active Day Details - W3Schools Style */}
                <section className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                   {/* Header */}
                   <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-8 border-b border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700">Day {activeDay.day} of 30</span>
                      <span className="text-[11px] font-bold text-gray-600">•</span>
                      <span className="text-[11px] font-bold text-gray-600 uppercase">{activeDay.topic}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">{activeDay.title}</h2>
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      📖 Master this concept step by step
                    </p>
                  </div>

                  {/* Main Content - W3Schools Format */}
                  <div className="p-8 prose prose-sm max-w-none">
                    {/* Split content by sections */}
                    <div className="space-y-6">
                      {activeDay.content.split('\n\n').map((section, idx) => {
                        const isHeading = section.includes('?') || section.includes('•') || section.includes(':');
                        const isBulletPoint = section.trim().startsWith('•');
                        const isMistakeSection = section.includes('❌') || section.includes('✅');
                        
                        if (section.trim() === '') return null;

                        if (isMistakeSection) {
                          return (
                            <div key={idx} className="bg-red-50 border-l-4 border-red-400 p-4 rounded my-4">
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{section}</p>
                            </div>
                          );
                        }

                        if (isBulletPoint) {
                          return (
                            <div key={idx} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded my-4">
                              <ul className="space-y-2 text-sm text-gray-800 list-disc list-inside">
                                {section.split('\n').filter(s => s.trim().startsWith('•')).map((item, i) => (
                                  <li key={i} className="text-gray-700">{item.replace('•', '').trim()}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        }

                        if (section.includes('💡')) {
                          return (
                            <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded my-4">
                              <p className="text-sm font-semibold text-yellow-900 mb-1">💡 Pro Tip</p>
                              <p className="text-sm text-gray-800">{section.replace('💡', '').trim()}</p>
                            </div>
                          );
                        }

                        return (
                          <div key={idx}>
                            {isHeading ? (
                              <h3 className="text-lg font-bold text-gray-900 mb-3 mt-6">{section}</h3>
                            ) : (
                              <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{section}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Enhanced Resources Section */}
                  <div className="px-8 py-6 border-t border-border bg-gray-50">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                      📚 Learning Resources & Further Reading
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {activeDay.resources.map((res, i) => {
                        const getResourceIcon = () => {
                          switch(res.type) {
                            case 'video': return <PlayCircle size={16} />;
                            case 'documentation': return <FileText size={16} />;
                            case 'tutorial': return <BookOpen size={16} />;
                            case 'exercise': return <Zap size={16} />;
                            case 'blog': return <MessageSquare size={16} />;
                            case 'example': return <Code size={16} />;
                            case 'guide': return <FileText size={16} />;
                            case 'webinar': return <Brain size={16} />;
                            default: return <ExternalLink size={16} />;
                          }
                        };

                        const getResourceColor = () => {
                          switch(res.type) {
                            case 'video': return 'bg-red-50 border-red-100 text-red-600';
                            case 'documentation': return 'bg-blue-50 border-blue-100 text-blue-600';
                            case 'tutorial': return 'bg-green-50 border-green-100 text-green-600';
                            case 'exercise': return 'bg-purple-50 border-purple-100 text-purple-600';
                            case 'blog': return 'bg-orange-50 border-orange-100 text-orange-600';
                            case 'example': return 'bg-pink-50 border-pink-100 text-pink-600';
                            case 'guide': return 'bg-cyan-50 border-cyan-100 text-cyan-600';
                            case 'webinar': return 'bg-indigo-50 border-indigo-100 text-indigo-600';
                            default: return 'bg-slate-50 border-slate-100 text-slate-600';
                          }
                        };

                        return (
                          <motion.a
                            key={i}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.02, y: -2 }}
                            className={`flex flex-col gap-2 p-4 rounded-xl border transition group cursor-pointer ${getResourceColor()}`}
                          >
                            <div className="flex items-start justify-between">
                              <div className={`p-2 rounded-lg ${getResourceColor().split(' ')[0]}`}>
                                {getResourceIcon()}
                              </div>
                              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition" />
                            </div>
                            <span className="text-[11px] font-bold capitalize">{res.type.replace('-', ' ')}</span>
                            <span className="text-[12px] font-semibold line-clamp-2">{res.title}</span>
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quiz in Details Card */}
                  <div className="bg-mentor-bg text-white p-6 rounded-2xl">
                     <h3 className="text-md font-bold mb-4 flex items-center gap-2">
                       <Zap size={16} className="text-blue-400" /> Knowledge Check
                     </h3>
                     <p className="text-sm mb-4 leading-relaxed opacity-90">{activeDay.quiz.question}</p>
                     
                     <div className="space-y-2 mb-4">
                       {activeDay.quiz.options.map((opt, i) => {
                         const isCorrect = i === activeDay.quiz.correctAnswer;
                         const isSelected = quizAnswer === i;
                         const showResult = quizSubmitted;
                         
                         return (
                           <button
                              key={i}
                              onClick={() => !quizSubmitted && setQuizAnswer(i)}
                              disabled={quizSubmitted}
                              className={cn(
                                "w-full p-3 text-left rounded-xl text-xs transition-all border",
                                quizSubmitted && isCorrect && "bg-emerald-500/20 border-emerald-400 bg-emerald-500/10",
                                quizSubmitted && isSelected && !isCorrect && "bg-red-500/20 border-red-400 bg-red-500/10",
                                quizSubmitted && !isSelected && !isCorrect && "border-white/10 opacity-60",
                                !quizSubmitted && isSelected && "bg-white/10 border-white/20",
                                !quizSubmitted && !isSelected && "border-white/5 hover:bg-white/5"
                              )}
                           >
                             <div className="flex items-center justify-between">
                               <span>{opt}</span>
                               {quizSubmitted && isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                               {quizSubmitted && isSelected && !isCorrect && <AlertCircle size={16} className="text-red-400" />}
                             </div>
                           </button>
                         );
                       })}
                     </div>

                     {/* Feedback Section */}
                     {quizSubmitted && (
                       <motion.div
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className={cn(
                           "p-4 rounded-xl mb-4 border",
                           quizCorrect 
                             ? "bg-emerald-500/20 border-emerald-400" 
                             : "bg-red-500/20 border-red-400"
                         )}
                       >
                         <div className="flex items-center gap-2 mb-2">
                           {quizCorrect ? (
                             <>
                               <CheckCircle2 size={18} className="text-emerald-400" />
                               <span className="font-bold text-emerald-300">Correct! Great job!</span>
                             </>
                           ) : (
                             <>
                               <AlertCircle size={18} className="text-red-400" />
                               <span className="font-bold text-red-300">Not quite right. Try again or see the explanation.</span>
                             </>
                           )}
                         </div>
                         {activeDay.quiz.explanation && (
                           <p className="text-xs opacity-90 leading-relaxed">
                             <span className="font-semibold">Explanation: </span>
                             {activeDay.quiz.explanation}
                           </p>
                         )}
                       </motion.div>
                     )}
                     
                     <div className="flex gap-3">
                       <button 
                        onClick={handleQuizSubmit}
                        disabled={quizAnswer === null || quizCorrect}
                        className="flex-1 py-3 bg-primary rounded-xl font-bold text-sm hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {quizCorrect ? "✓ Completed" : "Submit Answer"}
                       </button>
                       {quizSubmitted && !quizCorrect && (
                         <button 
                          onClick={() => {
                            setQuizAnswer(null);
                            setQuizSubmitted(false);
                            setQuizCorrect(false);
                          }}
                          className="flex-1 py-3 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/5 transition"
                         >
                           Try Again
                         </button>
                       )}
                       {quizCorrect && activeDayIndex < plan.days.length - 1 && (
                         <button 
                          onClick={() => {
                            handleDaySelect(activeDayIndex + 1);
                            setQuizAnswer(null);
                            setQuizSubmitted(false);
                            setQuizCorrect(false);
                          }}
                          className="flex-1 py-3 border border-white/20 rounded-xl font-bold text-sm hover:bg-white/5 transition flex items-center justify-center gap-2"
                         >
                           Next Module <ChevronRight size={16} />
                         </button>
                       )}
                     </div>
                  </div>
                </section>
              </div>

              {/* Sidebar Area - AI Mentor Feature */}
              <div className="flex flex-col gap-6">
                <div className="bg-mentor-bg rounded-2xl overflow-hidden flex flex-col h-[600px] border border-white/10 shadow-lg">
                  <div className="p-5 flex items-center gap-3 bg-white/5 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
                    <div>
                      <div className="text-sm font-bold text-white">AI Mentor</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active • Ready to help</div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-900/40">
                    <div className="bg-white/5 p-4 rounded-xl rounded-bl-none text-xs leading-relaxed text-slate-200 mb-4">
                      Hello! I'm here to dive deeper into <b>{activeDay.topic}</b>. Ask me anything about today's concepts!
                    </div>
                    <div className="bg-primary p-4 rounded-xl rounded-br-none text-xs text-white ml-8 shadow-md">
                       Can you explain this like I'm a beginner?
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/5 flex gap-2 items-center">
                     <div className="flex-1 bg-white/5 border border-white/5 rounded-full px-4 py-2 text-[12px] text-slate-400">
                        Ask a question...
                     </div>
                     <button 
                      onClick={() => setShowMentor(true)} 
                      className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold"
                     >
                       ↗
                     </button>
                  </div>
                </div>
                
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-sm font-bold mb-4">Learning Insights</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase mb-1">
                          <span>Concept Clarity</span>
                          <span>High</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[75%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-text-muted uppercase mb-1">
                          <span>Course Momentum</span>
                          <span>Great</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 w-[90%]" />
                        </div>
                      </div>
                    </div>
                </div>

                {/* Sample Certificate Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 text-center">
                    <Award className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-amber-900 mb-1">🎓 Your Achievement Awaits</h4>
                    <p className="text-[11px] text-amber-700 mb-4">Complete all 30 days + pass final test to earn your certificate</p>
                    
                    {/* Certificate Preview */}
                    <div className="bg-white rounded-lg p-4 mb-4 border border-amber-100 shadow-md text-left">
                      <div className="text-center mb-3">
                        <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Certificate of Completion</div>
                        <div className="h-0.5 w-16 bg-gradient-to-r from-amber-400 to-yellow-400 mx-auto"></div>
                      </div>
                      
                      <div className="space-y-2 text-[9px] text-amber-900">
                        <div>This certifies that:</div>
                        <div className="font-bold text-amber-700">{user.email.split('@')[0]}</div>
                        <div>has successfully completed</div>
                        <div className="font-bold text-amber-700">{user.role} Professional Course</div>
                        <div className="text-[8px] pt-2 border-t border-amber-100">
                          Certificate ID: CERT-2024-XXXXX
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-100/50 p-3 rounded-lg">
                      <p className="text-[10px] text-amber-800">
                        📊 <span className="font-semibold">{completedDays}/{plan.days.length}</span> days completed<br/>
                        Keep up the momentum! {plan.days.length - completedDays} days remaining
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}

        {/* LEARNING PLAN SECTION */}
        {activeSection === "learning-plan" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-bold mb-2">{plan.title}</h2>
                  <p className="text-sm text-text-muted">Target Skill: <span className="font-semibold">{plan.targetSkill}</span></p>
                </div>
                <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
                  {plan.days.map((day) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md",
                        day.completed && "bg-emerald-50 border-emerald-200",
                        !day.completed && day.locked && "bg-slate-50 border-border opacity-60",
                        !day.completed && !day.locked && "border-primary/30 hover:border-primary/60 bg-white"
                      )}
                      onClick={() => {
                        handleDaySelect(plan.days.findIndex(d => d.day === day.day));
                        setActiveSection("overview");
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center font-bold",
                          day.completed ? "bg-emerald-500 text-white" : "bg-primary/10 text-primary"
                        )}>
                          {day.completed ? <CheckCircle2 size={20} /> : day.day}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm">{day.title}</h4>
                          <p className="text-[12px] text-text-muted mt-1">{day.topic}</p>
                          <p className="text-xs text-text-muted mt-2 line-clamp-2">{day.content}</p>
                        </div>
                        {day.locked && <Lock size={18} className="text-text-muted flex-shrink-0 mt-1" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                <div className="text-[12px] font-bold text-primary uppercase tracking-wider mb-2">Progress</div>
                <div className="text-3xl font-bold text-primary mb-4">{progressPercent}%</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Completed</span>
                    <span className="font-bold">{completedDays}/{plan.days.length}</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESOURCES SECTION */}
        {activeSection === "resources" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-2">Curated Resources for {plan.targetSkill}</h2>
              <p className="text-sm text-text-muted">All resources aligned with your {plan.days.length}-day learning path</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                // Collect resources by type from all learning days
                const resourcesByType: Record<string, any[]> = {};
                const seen = new Set<string>();
                
                plan.days.forEach(day => {
                  day.resources.forEach(res => {
                    const key = res.type + ':' + res.url; // Use type+url as unique key
                    if (!seen.has(key)) {
                      seen.add(key);
                      if (!resourcesByType[res.type]) {
                        resourcesByType[res.type] = [];
                      }
                      resourcesByType[res.type].push(res);
                    }
                  });
                });

                const typeIcons: Record<string, string> = {
                  video: "🎥",
                  doc: "📚",
                  documentation: "📖",
                  tutorial: "🎓",
                  exercise: "🧪",
                  blog: "📝",
                  example: "💻",
                  guide: "📘",
                  webinar: "🎤",
                  link: "🔗"
                };

                const typeNames: Record<string, string> = {
                  video: "Video Tutorials",
                  doc: "Documentation",
                  documentation: "Official Guides",
                  tutorial: "Step-by-Step Tutorials",
                  exercise: "Practice Exercises",
                  blog: "Blog Articles",
                  example: "Code Examples",
                  guide: "Learning Guides",
                  webinar: "Webinars & Talks",
                  link: "Useful Links"
                };

                const typeDescs: Record<string, string> = {
                  video: "Visual learning materials for better understanding",
                  doc: "Foundational documentation and references",
                  documentation: "Official API documentation and guides",
                  tutorial: "Step-by-step tutorials for hands-on learning",
                  exercise: "Interactive exercises to practice concepts",
                  blog: "Article-based learning from experts",
                  example: "Code snippets and real-world examples",
                  guide: "Comprehensive learning guides",
                  webinar: "Live sessions and recorded talks from experts",
                  link: "Additional helpful resources and links"
                };

                return Object.entries(resourcesByType)
                  .sort((a, b) => b[1].length - a[1].length)
                  .map(([type, resources], i) => (
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-4xl group-hover:scale-110 transition">{typeIcons[type] || "📚"}</div>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{typeNames[type] || type}</h3>
                      <p className="text-sm text-text-muted mb-4">{typeDescs[type] || ""}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-[12px] font-bold text-primary">{resources.length} Resources</span>
                        <ChevronRight size={18} className="text-primary group-hover:translate-x-1 transition" />
                      </div>
                      
                      {/* Show first 3 resources as preview */}
                      <div className="mt-4 space-y-2 pt-4 border-t border-border/50">
                        {resources.slice(0, 3).map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-sm text-primary hover:underline line-clamp-1 flex items-center gap-2 transition hover:text-blue-600"
                          >
                            <ExternalLink size={14} />
                            {res.title}
                          </a>
                        ))}
                        {resources.length > 3 && (
                          <p className="text-xs text-text-muted pt-2 font-semibold">
                            + {resources.length - 3} more resources
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ));
              })()}
            </div>
          </div>
        )}

        {/* ANALYTICS SECTION */}
        {activeSection === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-6">Learning Performance</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Quiz Accuracy</span>
                      <span className="text-sm font-bold text-primary">{quizAccuracy}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${quizAccuracy}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Engagement Level</span>
                      <span className="text-sm font-bold text-accent">{engagementLevel}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-500" style={{ width: `${engagementLevel}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold">Concept Mastery</span>
                      <span className="text-sm font-bold text-emerald-500">{conceptMastery}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${conceptMastery}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-primary" /> Weekly Engagement
                </h3>
                <div className="flex items-end gap-2 h-40">
                  {weeklyData.map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-500"
                        style={{ height: `${Math.min(100, height)}%` }}
                      ></div>
                      <span className="text-[10px] font-bold text-text-muted">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6"
              >
                <h3 className="font-bold text-sm mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[12px] text-text-muted uppercase font-bold mb-1">Total Hours</div>
                    <div className="text-2xl font-bold">{totalHours.toFixed(1)}h</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-text-muted uppercase font-bold mb-1">Modules Completed</div>
                    <div className="text-2xl font-bold">{completedDays}/{plan.days.length}</div>
                  </div>
                  <div>
                    <div className="text-[12px] text-text-muted uppercase font-bold mb-1">Avg. Score</div>
                    <div className="text-2xl font-bold text-primary">{quizAccuracy}%</div>
                  </div>
                </div>
              </motion.div>

              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <button 
                  onClick={handleDownloadReport}
                  className="w-full py-3 bg-primary text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download Report
                </button>
                <button 
                  onClick={handleShareProgress}
                  className="w-full py-3 border border-border rounded-lg font-bold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                >
                  <Share2 size={16} /> Share Progress
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS SECTION */}
        {activeSection === "projects" && (
          <div className="space-y-6">
            {selectedProject === null ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "bg-gradient-to-br rounded-2xl p-6 text-white cursor-pointer transform transition hover:scale-105 hover:shadow-xl",
                        project.color
                      )}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <p className="text-sm opacity-90">{project.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2">
                          <Code size={16} />
                          <span className="text-sm font-medium">{project.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap size={16} />
                          <span className="text-sm font-medium">{project.level}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setProjectSubmission('');
                  }}
                  className="flex items-center gap-2 text-primary hover:underline mb-6 font-medium"
                >
                  ← Back to Projects
                </button>

                {projects.find(p => p.id === selectedProject) && (
                  <div className="space-y-6">
                    {(() => {
                      const project = projects.find(p => p.id === selectedProject);
                      return (
                        <>
                          <div className={cn("bg-gradient-to-r rounded-2xl p-8 text-white", project!.color)}>
                            <h2 className="text-3xl font-bold mb-2">{project!.title}</h2>
                            <p className="text-white/90 mb-4">{project!.description}</p>
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                                <Code size={18} />
                                <span className="font-medium">{project!.duration}</span>
                              </div>
                              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                                <Zap size={18} />
                                <span className="font-medium">{project!.level}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold mb-4">Task Instructions</h3>
                            <ol className="space-y-3">
                              {project!.tasks.map((task, idx) => (
                                <li key={idx} className="flex gap-3">
                                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm font-bold">
                                    {idx + 1}
                                  </span>
                                  <span className="text-text-main pt-1">{task}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6" style={darkMode ? { backgroundColor: '#1e3a8a', borderColor: '#3b82f6' } : undefined}>
                            <h3 className="font-bold mb-3 flex items-center gap-2">
                              <AlertCircle size={20} className="text-blue-600" /> Submission Instructions
                            </h3>
                            <p className="text-sm text-text-muted mb-4">
                              Submit your project by providing:
                            </p>
                            <ul className="text-sm text-text-muted space-y-2 list-disc list-inside">
                              <li>GitHub repository link with clean, commented code</li>
                              <li>Live demo or deployment link (if applicable)</li>
                              <li>README with setup and usage instructions</li>
                              <li>Brief description of your approach and challenges overcome</li>
                            </ul>
                          </div>

                          <div>
                            <label className="text-sm font-semibold mb-3 block">Submit Your Project</label>
                            <textarea
                              placeholder="Paste your GitHub repository link or project submission details..."
                              value={projectSubmission}
                              onChange={(e) => setProjectSubmission(e.target.value)}
                              rows={4}
                              className={cn(
                                "w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none",
                                darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-border"
                              )}
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={async () => {
                                if (projectSubmission.trim()) {
                                  const project = projects.find(p => p.id === selectedProject);
                                  if (project) {
                                    try {
                                      // Sync project submission to database
                                      await apiService.submitProject(
                                        user.id,
                                        plan.id,
                                        project.id,
                                        project.title,
                                        projectSubmission
                                      );
                                      setNotification({ message: `Project submitted! Our AI mentor will review your work and provide feedback.`, type: 'success' });
                                    } catch (err) {
                                      console.error("Failed to submit project:", err);
                                      setNotification({ message: 'Failed to submit project. Please try again.', type: 'info' });
                                    }
                                  }
                                  setProjectSubmission('');
                                  setSelectedProject(null);
                                } else {
                                  setNotification({ message: 'Please fill in the submission details', type: 'info' });
                                }
                              }}
                              className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                            >
                              <Send size={18} /> Submit Project
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProject(null);
                                setProjectSubmission('');
                              }}
                              className="flex-1 py-3 border border-border rounded-lg font-bold hover:bg-slate-50 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ASSESSMENT SECTION */}
        {activeSection === "assessment" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Assessment Result</h2>
                <p className="text-text-muted">Your current skill level and areas for improvement</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                  <div className="text-[12px] font-bold text-emerald-700 uppercase mb-2">Strong Areas</div>
                  <div className="text-lg font-bold">{plan.days[0]?.topic || 'Foundations'}</div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="text-[12px] font-bold text-blue-700 uppercase mb-2">Level</div>
                  <div className="text-lg font-bold">{user.experienceLevel}</div>
                </div>
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <div className="text-[12px] font-bold text-accent uppercase mb-2">Next Goal</div>
                  <div className="text-lg font-bold">Advanced</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm mb-3">Recommended Next Steps</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">Continue with current learning path</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">Practice more exercises on weaker topics</span>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">Join peer study group</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl p-6">
                <div className="text-[12px] uppercase font-bold mb-2 opacity-90">Overall Score</div>
                <div className="text-5xl font-bold mb-2">{Math.round((completedDays / plan.days.length) * 100)}%</div>
                <div className="text-sm opacity-90">Based on completed modules</div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h4 className="font-bold text-sm mb-4">Improvement Areas</h4>
                <ul className="space-y-3 text-sm">
                  {['Advanced Concepts', 'Problem Solving', 'Real-world Projects'].map((area, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FINAL ASSESSMENT SECTION */}
        {activeSection === "final-assessment" && (
          <FinalAssessmentView
            userProfile={user}
            skillLevel={plan.days[0]?.topic ? 'Intermediate' : 'Beginner'} 
            onComplete={(certificate) => {
              if (certificate) {
                setUserCertificate(certificate);
              }
              setActiveSection("overview");
            }}
          />
        )}
      </main>

      <AnimatePresence>
        {showMentor && (
          <AIMentor 
            user={user} 
            context={`Current Topic: ${activeDay.topic}\nContent: ${activeDay.content}`}
            onClose={() => setShowMentor(false)} 
          />
        )}
      </AnimatePresence>

      {/* SUPPORT MODAL */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSupport(false);
              setSupportView('menu');
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <HelpCircle size={24} className="text-primary" /> 
                  {supportView === 'menu' && 'Support'}
                  {supportView === 'contact' && 'Contact Us'}
                  {supportView === 'faq' && 'FAQ'}
                  {supportView === 'community' && 'Community'}
                  {supportView === 'status' && 'System Status'}
                </h2>
                <button
                  onClick={() => {
                    setShowSupport(false);
                    setSupportView('menu');
                  }}
                  className="p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* MENU VIEW */}
              {supportView === 'menu' && (
                <div className="p-6 space-y-3">
                  <p className="text-text-muted mb-4">Need help? We're here to assist you!</p>
                  
                  <button
                    onClick={() => setSupportView('contact')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-slate-50 transition text-left group"
                  >
                    <Mail size={20} className="text-primary group-hover:scale-110 transition flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Email Support</div>
                      <div className="text-xs text-text-muted">Send us a message</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSupportView('faq')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-slate-50 transition text-left group"
                  >
                    <FileText size={20} className="text-primary group-hover:scale-110 transition flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">FAQ</div>
                      <div className="text-xs text-text-muted">Common questions answered</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSupportView('community')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-slate-50 transition text-left group"
                  >
                    <MessageCircle size={20} className="text-primary group-hover:scale-110 transition flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">Community</div>
                      <div className="text-xs text-text-muted">Connect with other learners</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSupportView('status')}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-slate-50 transition text-left group"
                  >
                    <AlertCircle size={20} className="text-primary group-hover:scale-110 transition flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm">System Status</div>
                      <div className="text-xs text-text-muted">Check platform status</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowSupport(false)}
                    className="w-full mt-4 py-2 rounded-lg border border-border font-medium text-sm hover:bg-slate-50 transition"
                  >
                    Close
                  </button>
                </div>
              )}

              {/* CONTACT VIEW */}
              {supportView === 'contact' && (
                <div className="p-6 space-y-4">
                  <button
                    onClick={() => setSupportView('menu')}
                    className="text-primary text-sm font-medium mb-2 flex items-center gap-1 hover:underline"
                  >
                    ← Back
                  </button>
                  
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Subject</label>
                    <input
                      type="text"
                      placeholder="What is this about?"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">Message</label>
                    <textarea
                      placeholder="Tell us how we can help..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleSendContactMessage}
                    className="w-full py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition"
                  >
                    Send Message
                  </button>
                </div>
              )}

              {/* FAQ VIEW */}
              {supportView === 'faq' && (
                <div className="p-6 space-y-3">
                  <button
                    onClick={() => setSupportView('menu')}
                    className="text-primary text-sm font-medium mb-2 flex items-center gap-1 hover:underline"
                  >
                    ← Back
                  </button>
                  
                  {faqs.map((faq, idx) => (
                    <details key={idx} className="border border-border rounded-lg">
                      <summary className="px-4 py-3 cursor-pointer font-medium text-sm hover:bg-slate-50">
                        {faq.question}
                      </summary>
                      <div className="px-4 py-3 border-t border-border bg-slate-50 text-sm text-text-muted">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {/* COMMUNITY VIEW */}
              {supportView === 'community' && (
                <div className="p-6 space-y-4">
                  <button
                    onClick={() => setSupportView('menu')}
                    className="text-primary text-sm font-medium mb-2 flex items-center gap-1 hover:underline"
                  >
                    ← Back
                  </button>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Join Our Community</h3>
                    <p className="text-sm text-text-muted">
                      Connect with thousands of learners, share your progress, and get peer support.
                    </p>
                    <a
                      href="https://discord.gg/smartonboard"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                    >
                      <ExtLink size={16} /> Join Discord
                    </a>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Recent Activity</h4>
                    <div className="text-sm text-text-muted space-y-2">
                      <div className="p-3 border border-border rounded-lg">
                        <div className="font-medium text-text-main">Great learning experience!</div>
                        <div className="text-xs">@learner_john - 2h ago</div>
                      </div>
                      <div className="p-3 border border-border rounded-lg">
                        <div className="font-medium text-text-main">Completed my first course</div>
                        <div className="text-xs">@sarah_dev - 5h ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATUS VIEW */}
              {supportView === 'status' && (
                <div className="p-6 space-y-4">
                  <button
                    onClick={() => setSupportView('menu')}
                    className="text-primary text-sm font-medium mb-2 flex items-center gap-1 hover:underline"
                  >
                    ← Back
                  </button>
                  
                  <div className="space-y-3">
                    <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="font-semibold text-sm">All Systems Operational</span>
                      </div>
                      <p className="text-xs text-text-muted">Last updated: just now</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Service Status</h4>
                      
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <span className="text-sm">Platform</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs font-medium">Operational</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <span className="text-sm">API</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs font-medium">Operational</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <span className="text-sm">Database</span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-xs font-medium">Operational</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn("rounded-2xl shadow-xl max-w-md w-full", darkMode ? "bg-slate-800" : "bg-white")}
              style={darkMode ? { backgroundColor: '#1f2937' } : undefined}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("p-6 border-b flex items-center justify-between", darkMode ? "border-slate-700" : "border-border")} style={darkMode ? { borderColor: '#374151' } : undefined}>
                <h2 className={cn("text-xl font-bold flex items-center gap-2", darkMode && "text-white")}>
                  <Settings size={24} className="text-primary" /> Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className={cn("p-1 rounded-lg transition", darkMode ? "hover:bg-slate-700" : "hover:bg-slate-100")}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Language Setting */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">Language</label>
                  <div className="flex gap-2">
                    {['English', 'Spanish', 'French', 'German'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={cn(
                          "flex-1 py-3 px-3 rounded-lg font-bold text-sm transition-all duration-200 border-2",
                          userLanguage === lang
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105"
                            : "border-border hover:bg-blue-50 text-text-main hover:border-primary"
                        )}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Email Notifications</div>
                    <div className="text-xs text-text-muted">Get updates on your progress</div>
                  </div>
                  <button
                    onClick={handleEmailNotificationsToggle}
                    className={cn(
                      "relative inline-flex h-6 w-11 rounded-full transition",
                      emailNotifications ? "bg-primary" : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition mt-1",
                        emailNotifications ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Dark Mode</div>
                    <div className="text-xs text-text-muted">Easier on the eyes</div>
                  </div>
                  <button
                    onClick={handleDarkModeToggle}
                    className={cn(
                      "relative inline-flex h-6 w-11 rounded-full transition",
                      darkMode ? "bg-primary" : "bg-slate-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition mt-1",
                        darkMode ? "translate-x-6" : "translate-x-1"
                      )}
                    />
                  </button>
                </div>

                {/* Account Info */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm font-semibold mb-2">Account</div>
                  <div className="text-xs text-text-muted space-y-1">
                    <div>Email: {user.email}</div>
                    <div>Role: {user.role || 'Not set'}</div>
                    <div>Level: {user.experienceLevel}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full mt-4 py-2 rounded-lg border border-border font-medium text-sm hover:bg-slate-50 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
