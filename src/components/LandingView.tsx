import { motion } from "motion/react";
import { ArrowRight, Sparkles, Target, Zap, Globe, CheckCircle2, Users, Rocket, BookOpen } from "lucide-react";

interface LandingViewProps {
  onGetStarted: () => void;
}

export default function LandingView({ onGetStarted }: LandingViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-3xl">●</span> SmartOnboard
          </motion.div>
          <motion.button 
            onClick={onGetStarted}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-bold bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            Sign In
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-100 border border-blue-200"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Powered by AI</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Intelligent
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                onboarding
              </span>
              <br />
              for modern teams.
            </h1>

            {/* Subheading */}
            <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-xl font-medium">
              Bridge the skill gap with AI-driven assessments and a personalized 30-day curriculum 
              tailored to your role. Master your stack 10x faster.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button 
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                Start Free Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
              >
                Watch Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {[
                { icon: Users, label: "Active Learners", value: "50K+" },
                { icon: Rocket, label: "Completion Rate", value: "94%" },
                { icon: BookOpen, label: "Courses", value: "100+" }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border border-blue-200/50 shadow-2xl p-8 overflow-hidden">
              {/* Floating card background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
              
              <div className="relative grid grid-cols-2 gap-4 h-full">
                {/* Card 1 - Assessment */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-blue-100 mb-4">
                      <Target className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Skill Assessment</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Smart AI identifies your strengths & gaps</p>
                  </div>
                </motion.div>

                {/* Card 2 - Main Progress */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.2 }}
                  className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 shadow-lg text-white col-span-1 row-span-2 flex flex-col justify-center items-center text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="text-5xl font-bold mb-2">42%</div>
                  </motion.div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-90">Progress</div>
                  <motion.div
                    className="mt-6 w-24 h-24 rounded-full border-4 border-white/30 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>

                {/* Card 3 - AI Learning */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.1 }}
                  className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700 text-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-blue-400/20 mb-4">
                      <Sparkles className="text-blue-300 w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">AI-Powered Learning</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">Personalized path just for you</p>
                  </div>
                </motion.div>

                {/* Card 4 - Fast Results */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-accent/20 mb-4">
                      <Zap className="text-accent w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Fast Results</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">Master skills 10x faster than traditional learning</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating element */}
            <motion.div
              className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-blue-600/40 blur-2xl"
              animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Target,
              title: "Personalized Learning",
              description: "AI-driven assessments create a custom learning path tailored to your skills and goals."
            },
            {
              icon: Rocket,
              title: "Rapid Progress",
              description: "Master new skills 10x faster with focused, project-based learning modules."
            },
            {
              icon: CheckCircle2,
              title: "Real-World Projects",
              description: "Build your portfolio with hands-on projects that match real industry demands."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white border border-gray-200 hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-600/10">
                  <feature.icon className="text-primary w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
