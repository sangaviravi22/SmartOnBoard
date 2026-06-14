import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { UserProfile, AssessmentQuestion, AssessmentResult, LearningPlan } from "../types";
import { 
  CheckCircle2, AlertCircle, Sparkles, 
  Target, Brain, ChevronRight
} from "lucide-react";
import { geminiService } from "../services/geminiService";
import { cn } from "../lib/utils";

interface AssessmentViewProps {
  user: UserProfile;
  onComplete: (result: AssessmentResult) => void;
  onPlanGenerated: (plan: LearningPlan) => void;
  savedResult: AssessmentResult | null;
}

export default function AssessmentView({ user, onComplete, onPlanGenerated, savedResult }: AssessmentViewProps) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<AssessmentResult | null>(savedResult);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    if (!savedResult) {
      loadQuestions();
    }
  }, [savedResult]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setLoadingText("Generating personalized skill assessment...");
      const data = await geminiService.generateAssessment(user);
      setQuestions(data);
    } catch (err) {
      setError("Failed to generate assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (optionIndex: number) => {
    const question = questions[currentIndex];
    const isCorrect = optionIndex === question.correctAnswer;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      evaluateResults(newAnswers);
    }
  };

  const evaluateResults = async (finalAnswerIndices: number[]) => {
    try {
      setLoading(true);
      setLoadingText("Analyzing your proficiency...");
      
      const evaluationPayload = finalAnswerIndices.map((idx, i) => ({
        questionId: questions[i].id,
        answerIndex: idx,
        correct: idx === questions[i].correctAnswer
      }));

      const res = await geminiService.evaluateAssessment(user, evaluationPayload);
      setResult(res);
      onComplete(res);
    } catch (err) {
      setError("Failed to evaluate results.");
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    if (!result) return;
    try {
      setLoading(true);
      setLoadingText("Building your 30-day adaptive learning plan...");
      const plan = await geminiService.generateLearningPlan(user, result);
      onPlanGenerated(plan);
    } catch (err) {
      setError("Failed to generate learning plan.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
           <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary"
           />
           <div className="absolute inset-0 flex items-center justify-center">
             <Brain className="text-primary w-8 h-8 animate-pulse" />
           </div>
        </div>
        <h2 className="text-2xl font-bold mb-2 tracking-tight">{loadingText}</h2>
        <p className="text-text-muted max-w-sm">Our AI is processing your request to craft a unique experience.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2 tracking-tight">Something went wrong</h2>
        <p className="text-text-muted mb-8">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen py-20 bg-bg px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card p-12 rounded-[3rem] shadow-2xl border border-border"
          >
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-emerald-50 rounded-3xl text-emerald-600 mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-bold mb-2">Assessment Complete</h2>
              <p className="text-lg text-text-muted">We've identified your proficiency level and mapped your growth area.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-slate-50 p-8 rounded-3xl border border-border">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2">Suggested Level</div>
                <div className="text-3xl font-bold text-primary">{result.suggestedLevel}</div>
                <div className="mt-4 text-text-main text-sm leading-relaxed">{result.feedback}</div>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-border">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">Performance Insights</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>Accuracy</span>
                      <span>{Math.round((result.score / result.maxScore) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${(result.score / result.maxScore) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-[10px] font-bold text-text-muted mb-2 uppercase tracking-tight">Key Strengths</div>
                    <div className="flex flex-wrap gap-2">
                      {result.strongAreas.slice(0, 3).map((area, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={generatePlan}
              className="w-full py-5 bg-primary text-white rounded-3xl text-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition shadow-xl shadow-primary/20 group"
            >
              <Sparkles size={24} />
              Generate My Learning Path
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const question = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-bg flex flex-col items-center py-20 px-6">
        <div className="w-full max-w-3xl">
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
            </div>
            <span className="text-xs font-bold text-primary">{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full mb-12 overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-10 lg:p-14 rounded-[2.5rem] border border-border shadow-2xl"
          >
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-text-main leading-snug">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3 mb-10">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "w-full p-5 text-left rounded-2xl border-2 transition-all font-medium text-sm flex justify-between items-center group bg-slate-50 border-slate-50 hover:border-slate-200"
                  )}
                >
                  <span className="text-slate-700 font-bold group-hover:text-primary transition-colors">{opt}</span>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-primary transition-all flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary scale-0 group-hover:scale-100 transition" />
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Your progress is being saved</p>
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                Step-by-step assessment <Target size={16} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
