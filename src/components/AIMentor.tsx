import { useState, useRef, useEffect } from "react";
import React from "react";
import { motion } from "motion/react";
import { UserProfile } from "../types";
import { geminiService } from "../services/geminiService";
import { X, Send, Sparkles, Loader2, Bot, User, Star, Lightbulb, ArrowRight, Copy, Check } from "lucide-react";
import { cn } from "../lib/utils";

interface AIMentorProps {
  user: UserProfile;
  context: string;
  onClose: () => void;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  isFavorited?: boolean;
  followups?: string[];
  relatedTopics?: Array<{ topic: string; description: string }>;
  topicsTouched?: string[];
}

export default function AIMentor({ user, context, onClose }: AIMentorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `👋 **Hey there! I'm your AI Mentor!**

I'm here to help you master computing concepts in an easy, fun way. Here's what I can help with:

🔹 **Deep Dives:** "What is [Flask/React/API/MongoDB/Python]?"
📖 **Step-by-Step Guides:** "How do I use [topic]?" 
💼 **Career Insights:** "Why learn [topic]?" with salary info
🔧 **Debug Help:** "I got an error with [topic]"
⚡ **Quick Comparisons:** "Flask vs Django?"

**I specialize in:**
✓ Flask, Django, Node.js, Express
✓ React, Vue, Angular, Flutter
✓ MongoDB, SQL, Databases
✓ APIs & REST
✓ Python, JavaScript, Dart
✓ And much more!

**Current lesson:** ${context}

What would you like to explore today? 🚀`,
      timestamp: Date.now(),
      followups: [
        "What is Flask?",
        "How do I get started with this topic?",
        "What career opportunities exist?"
      ],
      relatedTopics: [
        { topic: "Django", description: "Full-featured Python web framework" },
        { topic: "React", description: "Frontend UI library" }
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [topicsLearned, setTopicsLearned] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages ONLY (not on typing effect)
  useEffect(() => {
    if (scrollRef.current) {
      // Scroll immediately
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      // Use requestAnimationFrame for smooth scroll
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages.length]);

  // Typing effect for streaming responses
  useEffect(() => {
    if (currentMessageIndex < messages.length && messages[currentMessageIndex].role === 'assistant') {
      const message = messages[currentMessageIndex];
      let index = 0;
      const fullText = message.content;

      if (displayedContent.length < fullText.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(fullText.slice(0, displayedContent.length + 1));
        }, 20); // Typing speed
        return () => clearTimeout(timer);
      }
    }
  }, [displayedContent, currentMessageIndex, messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage,
      timestamp: Date.now()
    }]);

    setIsLoading(true);
    setDisplayedContent("");

    try {
      const response = await geminiService.askMentor(
        userMessage,
        context,
        user.experienceLevel,
        user.language || 'English'
      );

      // Extract topics mentioned in the query
      const detectedTopics = [
        'Flask', 'Django', 'React', 'Vue', 'Angular', 'Node.js', 'Express',
        'Python', 'JavaScript', 'MongoDB', 'SQL', 'API', 'REST', 'Dart', 'Flutter'
      ].filter(topic => userMessage.toLowerCase().includes(topic.toLowerCase()));

      // Update topics learned
      setTopicsLearned(prev => [...new Set([...prev, ...detectedTopics])]);

      // Generate follow-up questions
      const followups = generateFollowups(userMessage);
      const relatedTopics = generateRelatedTopics(detectedTopics);

      const newMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        isFavorited: false,
        followups,
        relatedTopics,
        topicsTouched: detectedTopics
      };

      setMessages(prev => [...prev, newMessage]);
      setCurrentMessageIndex(messages.length + 1);
      setDisplayedContent("");
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Could you try rephrasing? 😊",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFollowups = (query: string): string[] => {
    const lower = query.toLowerCase();
    
    if (lower.includes("what") || lower.includes("explain")) {
      return [
        `How do I use this in practice?`,
        `Can you show me a code example?`,
        `What companies use this?`
      ];
    }
    if (lower.includes("how")) {
      return [
        `What are the advanced concepts?`,
        `What are common mistakes?`,
        `Where can I practice this?`
      ];
    }
    if (lower.includes("error") || lower.includes("problem")) {
      return [
        `Can you explain why this happens?`,
        `How do I prevent this error?`,
        `Are there similar errors I should watch for?`
      ];
    }
    if (lower.includes("career") || lower.includes("job") || lower.includes("salary")) {
      return [
        `What are the career paths?`,
        `How do I get my first job?`,
        `What companies are hiring?`
      ];
    }

    return [
      `Can you give me a real-world example?`,
      `What's the best way to learn this?`,
      `How does this relate to what I know?`
    ];
  };

  const generateRelatedTopics = (topics: string[]): Array<{ topic: string; description: string }> => {
    const relations: Record<string, Array<{ topic: string; description: string }>> = {
      'Flask': [{ topic: 'Django', description: 'Full-featured Python framework' }, { topic: 'Node.js', description: 'Backend runtime' }],
      'React': [{ topic: 'Vue', description: 'Similar frontend framework' }, { topic: 'Next.js', description: 'React framework' }],
      'Node.js': [{ topic: 'Express', description: 'Node.js web framework' }, { topic: 'Dart', description: 'Multi-platform language' }],
      'Python': [{ topic: 'Django', description: 'Web framework' }, { topic: 'Flask', description: 'Micro framework' }],
      'MongoDB': [{ topic: 'SQL', description: 'Relational database' }, { topic: 'API', description: 'Connect to databases' }],
      'API': [{ topic: 'REST', description: 'API architectural style' }, { topic: 'Node.js', description: 'Build APIs with Node' }],
      'JavaScript': [{ topic: 'React', description: 'JavaScript library' }, { topic: 'Node.js', description: 'Server-side JS' }],
      'Flutter': [{ topic: 'Dart', description: 'Flutter uses Dart' }, { topic: 'React Native', description: 'Mobile framework' }]
    };

    return topics.length > 0 && relations[topics[0]] ? relations[topics[0]] : [];
  };

  const handleCopyFollowup = (question: string, index: number) => {
    setInput(question);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = (index: number) => {
    setMessages(prev => {
      const updated = [...prev];
      if (updated[index].role === 'assistant') {
        updated[index].isFavorited = !updated[index].isFavorited;
        if (updated[index].isFavorited) {
          setFavorites(f => [...f, updated[index].content]);
        } else {
          setFavorites(f => f.filter(fav => fav !== updated[index].content));
        }
      }
      return updated;
    });
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
      />
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-y-0 right-0 w-full max-w-lg bg-mentor-bg text-white z-50 flex flex-col shadow-2xl border-l border-white/10"
      >
        {/* Header with Progress */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <div className="font-bold tracking-tight">AI Mentor</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                Learned: {topicsLearned.length} topics • {messages.length - 1} messages
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar scroll-smooth">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col gap-2",
                m.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm",
                m.role === 'user' 
                  ? "bg-primary text-white rounded-br-none" 
                  : "bg-white/10 text-slate-200 border border-white/5 rounded-bl-none space-y-3"
              )}>
                <div className="whitespace-pre-wrap">{m.content}</div>
                
                {/* Follow-up Suggestions */}
                {m.followups && m.role === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <div className="text-slate-400 text-[10px] font-bold uppercase">💭 Try asking:</div>
                    <div className="space-y-1">
                      {m.followups.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCopyFollowup(q, idx)}
                          className="w-full text-left bg-white/5 hover:bg-white/10 p-2 rounded text-[10px] transition flex items-center justify-between group"
                        >
                          <span className="truncate">{q}</span>
                          {copiedId === idx ? (
                            <Check className="w-3 h-3 flex-shrink-0 ml-2 text-green-400" />
                          ) : (
                            <ArrowRight className="w-3 h-3 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Topics */}
                {m.relatedTopics && m.relatedTopics.length > 0 && m.role === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                    <div className="text-slate-400 text-[10px] font-bold uppercase">🔗 Related:</div>
                    <div className="flex gap-2 flex-wrap">
                      {m.relatedTopics.map((topic, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(`What is ${topic.topic}?`)}
                          className="bg-white/5 hover:bg-primary/30 px-2 py-1 rounded text-[9px] transition"
                          title={topic.description}
                        >
                          {topic.topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Actions */}
              {m.role === 'assistant' && (
                <div className="flex gap-2 text-slate-400 hover:text-slate-300 transition">
                  <button
                    onClick={() => toggleFavorite(i)}
                    className={cn(
                      "p-1.5 rounded hover:bg-white/5 transition",
                      m.isFavorited && "text-yellow-400"
                    )}
                    title={m.isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star className="w-4 h-4" fill={m.isFavorited ? "currentColor" : "none"} />
                  </button>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-white/5 space-y-3">
          {/* Topics Learned Progress */}
          {topicsLearned.length > 0 && (
            <div className="text-[10px] text-slate-400 space-y-1">
              <div className="font-bold uppercase">Topics Explored:</div>
              <div className="flex flex-wrap gap-1">
                {topicsLearned.map(topic => (
                  <span key={topic} className="bg-white/10 px-2 py-1 rounded">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSend} className="relative">
            <input 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything... What is Flask? How do I learn React?"
              className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10 transition-all text-white placeholder:text-slate-500"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest">
            💡 ChatGPT-style Smart Mentor • {favorites.length} Favorites
          </p>
        </div>
      </motion.div>
    </>
  );
}
