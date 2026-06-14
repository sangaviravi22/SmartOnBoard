import { useState } from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { 
  Briefcase, Code, GraduationCap, Languages, 
  CheckCircle2, Target, ArrowRight, Sparkles 
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "../services/translations";

interface OnboardingViewProps {
  user: UserProfile;
  onComplete: (data: Partial<UserProfile>) => void;
}

export default function OnboardingView({ user, onComplete }: OnboardingViewProps) {
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(language);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    experienceLevel: 'Beginner',
    language: 'English'
  });

  const nextStep = () => setStep(s => s + 1);
  
  const handleComplete = () => {
    if (profile.role && profile.skills) {
      onComplete(profile);
    }
  };

  const steps = [
    { title: t.onboarding.step1, icon: <Briefcase size={20} /> },
    { title: t.onboarding.step2, icon: <Code size={20} /> },
    { title: t.onboarding.step3, icon: <GraduationCap size={20} /> },
    { title: t.onboarding.step4, icon: <Languages size={20} /> }
  ];

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex flex-col gap-2">
              <div className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                step >= i + 1 ? "bg-primary" : "bg-slate-200"
              )} />
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest text-center",
                step >= i + 1 ? "text-primary" : "text-text-muted"
              )}>{s.title}</span>
            </div>
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-10 lg:p-14 rounded-[2.5rem] border border-border shadow-2xl"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-text-main">What's your current role?</h2>
                <p className="text-text-muted">This helps us tailor the assessment and plan.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer', 'Student', 'Other'].map(role => (
                   <button
                    key={role}
                    onClick={() => { setProfile({...profile, role}); nextStep(); }}
                    className={cn(
                      "p-5 text-left rounded-2xl border border-border hover:border-primary hover:bg-primary-light transition-all font-bold text-sm",
                      profile.role === role ? "border-primary bg-primary-light text-primary" : "bg-white text-text-main"
                    )}
                   >
                     {role}
                   </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Main skills to focus on?</h2>
                <p className="text-text-muted">List the core stack or skills you want to master.</p>
              </div>
              <div className="space-y-4">
                <input 
                  autoFocus
                  placeholder="e.g. React, TypeScript, Node.js"
                  className="w-full bg-slate-50 border border-border rounded-2xl p-6 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-center"
                  value={Array.isArray(profile.skills) ? profile.skills.join(", ") : ""}
                  onChange={(e) => setProfile({...profile, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s)})}
                  onKeyDown={(e) => e.key === 'Enter' && profile.skills && nextStep()}
                />
                <button 
                  disabled={!profile.skills || profile.skills.length === 0}
                  onClick={nextStep}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-md hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Confirm Skills <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-center">Your experience level?</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map(level => (
                   <button
                    key={level}
                    onClick={() => { setProfile({...profile, experienceLevel: level}); nextStep(); }}
                    className={cn(
                      "p-6 flex items-center justify-between rounded-2xl border border-border hover:border-primary hover:bg-primary-light transition-all",
                      profile.experienceLevel === level ? "border-primary bg-primary-light transition-all" : "bg-white"
                    )}
                   >
                     <div>
                       <div className="font-bold text-text-main text-left">{level}</div>
                       <div className="text-xs text-text-muted text-left">
                        {level === 'Beginner' && "I'm just starting out with this stack."}
                        {level === 'Intermediate' && "I have some experience."}
                        {level === 'Advanced' && "I work with this stack regularly."}
                        {level === 'Expert' && "I have deep knowledge."}
                       </div>
                     </div>
                     <div className={cn(
                       "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                       profile.experienceLevel === level ? "border-primary bg-primary text-white" : "border-slate-200"
                     )}>
                       {profile.experienceLevel === level && <CheckCircle2 size={14} />}
                     </div>
                   </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div className="space-y-2 text-center">
                <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target size={32} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{t.onboarding.selectLanguage}</h2>
                <p className="text-text-muted">We'll start with a quick AI Skill Assessment.</p>
              </div>
              <div className="space-y-4">
                {/* Language Picker */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-border">
                  <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">{t.dashboard.language}</div>
                  <div className="grid grid-cols-4 gap-3">
                    {['English', 'Spanish', 'French', 'German'].map(lang => {
                      const isSelected = profile.language === lang;
                      return (
                        <button
                          key={lang}
                          onClick={() => {
                            const newProfile = {...profile, language: lang};
                            setProfile(newProfile);
                            setLanguage(lang as any);
                            console.log('Language changed to:', lang, 'Profile:', newProfile);
                          }}
                          className={cn(
                            "py-3 px-4 rounded-xl text-sm font-bold border-2 transition-all duration-200",
                            isSelected
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105" 
                              : "bg-white border-border text-text-main hover:border-primary hover:bg-blue-50"
                          )}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={handleComplete}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-600 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
                >
                  {t.assessment.finish}
                  <Sparkles size={20} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
