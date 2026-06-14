import { UserProfile, AssessmentQuestion, AssessmentResult, LearningPlan, SkillLevel, FinalAssessmentQuestion, FinalAssessmentResult, Certificate, LearningDay } from "../types";

// Mock data - NO API CALLS NEEDED
const mockAssessmentQuestions: Record<string, AssessmentQuestion[]> = {
  "Web Developer": [
    {
      id: "q1",
      question: "What is the primary purpose of HTML?",
      options: ["Styling web pages", "Structuring web page content", "Running server logic", "Managing databases"],
      correctAnswer: 1,
      explanation: "HTML is used to structure and organize content on web pages. CSS handles styling, and JavaScript handles interactivity."
    },
    {
      id: "q2",
      question: "Which CSS property is used to create space inside an element?",
      options: ["margin", "padding", "border", "spacing"],
      correctAnswer: 1,
      explanation: "Padding creates space inside an element, while margin creates space outside. Border defines the edge."
    },
    {
      id: "q3",
      question: "What does 'async' do in JavaScript?",
      options: ["Makes code run in parallel", "Creates async functions", "Delays execution", "None of the above"],
      correctAnswer: 0,
      explanation: "Async functions allow code to run without blocking other operations, improving performance."
    },
    {
      id: "q4",
      question: "What is a React hook?",
      options: ["A type of fishing equipment", "A function that lets you use state in functional components", "A design pattern", "A CSS feature"],
      correctAnswer: 1,
      explanation: "Hooks like useState and useEffect allow you to add state and other features to functional React components."
    },
    {
      id: "q5",
      question: "Which HTTP method is used to retrieve data from a server?",
      options: ["POST", "PUT", "GET", "DELETE"],
      correctAnswer: 2,
      explanation: "GET is used to retrieve data from a server. POST is for sending data, PUT for updating, and DELETE for removing."
    }
  ],
  "Data Scientist": [
    {
      id: "q1",
      question: "What is the primary purpose of normalization in machine learning?",
      options: ["Increase model accuracy", "Scale features to similar ranges", "Remove outliers", "Reduce overfitting"],
      correctAnswer: 1,
      explanation: "Normalization scales features to similar ranges, which helps models train faster and perform better."
    },
    {
      id: "q2",
      question: "Which algorithm is best for classification tasks?",
      options: ["Linear Regression", "K-Means", "Random Forest", "PCA"],
      correctAnswer: 2,
      explanation: "Random Forest is a powerful algorithm for classification. Linear Regression is for regression, K-Means for clustering, PCA for dimensionality reduction."
    },
    {
      id: "q3",
      question: "What is overfitting in machine learning?",
      options: ["Model too simple", "Model memorizes training data too well", "Not enough data", "Too few features"],
      correctAnswer: 1,
      explanation: "Overfitting occurs when a model learns the training data too well, including noise, and performs poorly on new data."
    },
    {
      id: "q4",
      question: "What does the confusion matrix show?",
      options: ["Feature importance", "True positives, false positives, true negatives, false negatives", "Model loss", "Feature correlation"],
      correctAnswer: 1,
      explanation: "The confusion matrix shows how well a classification model performs by displaying correct and incorrect predictions."
    },
    {
      id: "q5",
      question: "What is cross-validation used for?",
      options: ["Checking data quality", "Evaluating model performance on different data splits", "Feature engineering", "Handling missing values"],
      correctAnswer: 1,
      explanation: "Cross-validation splits data into multiple folds to get a more reliable estimate of model performance."
    }
  ],
  "default": [
    {
      id: "q1",
      question: "What is the first step in problem-solving?",
      options: ["Start coding", "Understand the problem", "Look for solutions online", "Give up"],
      correctAnswer: 1,
      explanation: "Understanding the problem is crucial before attempting any solution."
    },
    {
      id: "q2",
      question: "Which of these is a best practice in software development?",
      options: ["Write all code in one file", "Use meaningful variable names", "Avoid comments", "Skip testing"],
      correctAnswer: 1,
      explanation: "Using meaningful variable names makes code more readable and maintainable."
    },
    {
      id: "q3",
      question: "What is version control used for?",
      options: ["Making backups", "Tracking code changes and collaboration", "Compiling code", "Debugging"],
      correctAnswer: 1,
      explanation: "Version control systems like Git track changes and enable collaboration among developers."
    },
    {
      id: "q4",
      question: "What does DRY stand for in programming?",
      options: ["Do Repeat Yourself", "Don't Repeat Yourself", "Debug Remote Yourself", "Data Retrieval Yes"],
      correctAnswer: 1,
      explanation: "DRY (Don't Repeat Yourself) means avoiding code duplication by creating reusable functions and modules."
    },
    {
      id: "q5",
      question: "What is the main benefit of using functions?",
      options: ["Takes more lines of code", "Reusability and organization", "Slows down execution", "Makes debugging harder"],
      correctAnswer: 1,
      explanation: "Functions promote code reuse, organization, and make code easier to maintain and test."
    }
  ]
};

// Generate mock 30-day learning plan
function getTopicResources(topic: string, day: number) {
  const resourcesByTopic: Record<string, Record<string, any[]>> = {
    "mongodb": {
      beginner: [
        { type: "doc" as const, title: "MongoDB Basics Guide", url: "https://docs.mongodb.com/manual/introduction/" },
        { type: "video" as const, title: "MongoDB in 100 Seconds", url: "https://www.youtube.com/watch?v=ofme2o29ngU" },
        { type: "tutorial" as const, title: "MongoDB Getting Started", url: "https://docs.mongodb.com/manual/tutorial/getting-started/" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Advanced Queries", url: "https://docs.mongodb.com/manual/reference/operator/" },
        { type: "blog" as const, title: "MongoDB Best Practices", url: "https://www.mongodb.com/blog/post/5-tips-and-tricks-for-developers" },
        { type: "example" as const, title: "Real-world Schema Examples", url: "https://github.com/mongodb/docs" }
      ],
      advanced: [
        { type: "guide" as const, title: "Sharding & Clustering", url: "https://docs.mongodb.com/manual/sharding/" },
        { type: "webinar" as const, title: "MongoDB Performance Tuning", url: "https://www.mongodb.com/webinars" },
        { type: "documentation" as const, title: "Transactions", url: "https://docs.mongodb.com/manual/core/transactions/" }
      ]
    },
    "python": {
      beginner: [
        { type: "doc" as const, title: "Python Official Docs", url: "https://docs.python.org/3/tutorial/" },
        { type: "video" as const, title: "Python Basics - Full Course", url: "https://www.youtube.com/watch?v=kqtjrcCHGbM" },
        { type: "tutorial" as const, title: "Python for Beginners", url: "https://www.w3schools.com/python/" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Python Libraries", url: "https://docs.python.org/3/library/" },
        { type: "blog" as const, title: "Python Best Practices", url: "https://pep8.org/" },
        { type: "exercise" as const, title: "Python Challenges", url: "https://leetcode.com/tag/python/" }
      ],
      advanced: [
        { type: "guide" as const, title: "Advanced Python", url: "https://docs.python.org/3/reference/" },
        { type: "webinar" as const, title: "Python Performance", url: "https://www.youtube.com/watch?v=GaZrEqjzeLs" },
        { type: "example" as const, title: "CPython Source", url: "https://github.com/python/cpython" }
      ]
    },
    "javascript": {
      beginner: [
        { type: "doc" as const, title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
        { type: "video" as const, title: "JavaScript Basics", url: "https://www.youtube.com/watch?v=PkZNo7UEhmk" },
        { type: "tutorial" as const, title: "JavaScript.info", url: "https://javascript.info/" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "ES6+ Features", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference" },
        { type: "blog" as const, title: "JavaScript Tips & Tricks", url: "https://www.freecodecamp.org/news/tag/javascript/" },
        { type: "exercise" as const, title: "Codewars JavaScript", url: "https://www.codewars.com/?language=javascript" }
      ],
      advanced: [
        { type: "guide" as const, title: "You Don't Know JS", url: "https://github.com/getify/You-Dont-Know-JS" },
        { type: "webinar" as const, title: "Advanced JS Patterns", url: "https://www.youtube.com/watch?v=JxzlKj1RYmg" },
        { type: "example" as const, title: "JavaScript Engine Source", url: "https://github.com/v8/v8" }
      ]
    },
    "api": {
      beginner: [
        { type: "doc" as const, title: "REST API Basics", url: "https://restfulapi.net/" },
        { type: "video" as const, title: "APIs Explained", url: "https://www.youtube.com/watch?v=PFTOqIspUG8" },
        { type: "tutorial" as const, title: "HTTP Methods Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "HTTP Status Codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
        { type: "blog" as const, title: "API Design Best Practices", url: "https://swagger.io/resources/articles/best-practices-in-api-design/" },
        { type: "example" as const, title: "Public APIs List", url: "https://github.com/public-apis/public-apis" }
      ],
      advanced: [
        { type: "guide" as const, title: "GraphQL Tutorial", url: "https://graphql.org/learn/" },
        { type: "webinar" as const, title: "Microservices Architecture", url: "https://www.youtube.com/watch?v=KB_JCQM6btE" },
        { type: "documentation" as const, title: "OpenAPI Specification", url: "https://spec.openapis.org/oas/v3.0.3" }
      ]
    },
    "nodejs": {
      beginner: [
        { type: "doc" as const, title: "Node.js Official Guide", url: "https://nodejs.org/en/docs/" },
        { type: "video" as const, title: "Node.js Crash Course", url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4" },
        { type: "tutorial" as const, title: "Node.js for Beginners", url: "https://www.w3schools.com/nodejs/" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Node.js API Reference", url: "https://nodejs.org/api/" },
        { type: "blog" as const, title: "Express.js Guide", url: "https://expressjs.com/" },
        { type: "exercise" as const, title: "Node.js Projects", url: "https://www.freecodecamp.org/news/tag/nodejs/" }
      ],
      advanced: [
        { type: "guide" as const, title: "Node.js Architecture", url: "https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/" },
        { type: "webinar" as const, title: "Node.js Performance Tips", url: "https://www.youtube.com/watch?v=4aBSNDXf-Cc" },
        { type: "example" as const, title: "Node.js Source Code", url: "https://github.com/nodejs/node" }
      ]
    },
    "flask": {
      beginner: [
        { type: "doc" as const, title: "Flask Official Docs", url: "https://flask.palletsprojects.com/" },
        { type: "video" as const, title: "Flask Crash Course", url: "https://www.youtube.com/watch?v=MwZwr5Tvyxo" },
        { type: "tutorial" as const, title: "Flask By Example", url: "https://www.flaskbyexample.com/" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Flask Patterns", url: "https://flask.palletsprojects.com/patterns/" },
        { type: "blog" as const, title: "Real Python Flask", url: "https://realpython.com/blog/topics/flask/" },
        { type: "exercise" as const, title: "Flask Projects", url: "https://github.com/pallets/flask/tree/main/examples" }
      ],
      advanced: [
        { type: "guide" as const, title: "Flask Full Stack", url: "https://www.freecodecamp.org/news/how-to-create-a-web-application-using-flask-in-python-3/" },
        { type: "webinar" as const, title: "Advanced Flask", url: "https://www.youtube.com/watch?v=uwRWQQu5d7w" },
        { type: "example" as const, title: "Real Flask Apps", url: "https://github.com/pallets/flask" }
      ]
    },
    "react": {
      beginner: [
        { type: "doc" as const, title: "React Official Docs", url: "https://react.dev/learn" },
        { type: "video" as const, title: "React Basics", url: "https://www.youtube.com/watch?v=SqcY0GlETPk" },
        { type: "tutorial" as const, title: "React Tutorial", url: "https://react.dev/learn/thinking-in-react" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "React Hooks", url: "https://react.dev/reference/react/hooks" },
        { type: "blog" as const, title: "React Patterns", url: "https://www.patterns.dev/posts/react-patterns/" },
        { type: "exercise" as const, title: "React Challenges", url: "https://github.com/alexgurr/react-coding-challenges" }
      ],
      advanced: [
        { type: "guide" as const, title: "React Architecture", url: "https://www.freecodecamp.org/news/react-architecture-explained/" },
        { type: "webinar" as const, title: "React Performance", url: "https://www.youtube.com/watch?v=cUzCjkeiD0Y" },
        { type: "example" as const, title: "React Source Code", url: "https://github.com/facebook/react" }
      ]
    },
    "flutter": {
      beginner: [
        { type: "doc" as const, title: "Flutter Official Docs", url: "https://flutter.dev/docs" },
        { type: "video" as const, title: "Flutter for Beginners", url: "https://www.youtube.com/watch?v=1ukSR1GRtMU" },
        { type: "tutorial" as const, title: "Flutter Codelab", url: "https://flutter.dev/docs/codelabs" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Flutter Widgets", url: "https://flutter.dev/docs/development/ui/widgets" },
        { type: "blog" as const, title: "Flutter Best Practices", url: "https://www.freecodecamp.org/news/tag/flutter/" },
        { type: "exercise" as const, title: "Flutter Apps", url: "https://github.com/flutter/samples" }
      ],
      advanced: [
        { type: "guide" as const, title: "Flutter Architecture", url: "https://flutter.dev/docs/development/architecture" },
        { type: "webinar" as const, title: "Advanced Flutter", url: "https://www.youtube.com/watch?v=bVD0r97L5cI" },
        { type: "example" as const, title: "Flutter Gallery", url: "https://github.com/flutter/gallery" }
      ]
    },
    "dart": {
      beginner: [
        { type: "doc" as const, title: "Dart Official Guide", url: "https://dart.dev/guides" },
        { type: "video" as const, title: "Dart Basics", url: "https://www.youtube.com/watch?v=wGzgMnOGuEg" },
        { type: "tutorial" as const, title: "Dart Codelabs", url: "https://dart.dev/codelabs" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Dart Language Tour", url: "https://dart.dev/guides/language/language-tour" },
        { type: "blog" as const, title: "Dart Tips", url: "https://medium.com/tag/dart" },
        { type: "exercise" as const, title: "Dart Challenges", url: "https://github.com/dart-lang/samples" }
      ],
      advanced: [
        { type: "guide" as const, title: "Dart Performance", url: "https://dart.dev/guides/performance" },
        { type: "webinar" as const, title: "Advanced Dart", url: "https://www.youtube.com/watch?v=sDvb1zNK5B0" },
        { type: "example" as const, title: "Dart Samples", url: "https://github.com/dart-lang/samples" }
      ]
    },
    "java": {
      beginner: [
        { type: "doc" as const, title: "Java Official Docs", url: "https://docs.oracle.com/javase/tutorial/" },
        { type: "video" as const, title: "Java Basics - Full Course", url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
        { type: "tutorial" as const, title: "Java for Beginners", url: "https://www.w3schools.com/java/" }
      ],
      intermediate: [
        { type: "documentation" as const, title: "Java Collections", url: "https://docs.oracle.com/javase/tutorial/collections/" },
        { type: "blog" as const, title: "Java Best Practices", url: "https://www.baeldung.com/" },
        { type: "exercise" as const, title: "Java Challenges", url: "https://leetcode.com/tag/java/" }
      ],
      advanced: [
        { type: "guide" as const, title: "Advanced Java Patterns", url: "https://www.oracle.com/java/technologies/javase/concurrency-utilities.html" },
        { type: "webinar" as const, title: "Java Performance Tuning", url: "https://www.youtube.com/watch?v=W8k10mBR0Zw" },
        { type: "example" as const, title: "JDK Source Code", url: "https://github.com/openjdk/jdk" }
      ]
    }
  };

  const topicLower = topic.toLowerCase();
  
  // Try exact match first, then partial match, then first available
  let resources = resourcesByTopic[topicLower];
  
  if (!resources) {
    // Try partial matching (e.g., "Java Developer" -> "java")
    for (const [key, value] of Object.entries(resourcesByTopic)) {
      if (topicLower.includes(key) || key.includes(topicLower)) {
        resources = value;
        break;
      }
    }
  }
  
  // If still no match, use first available resource set instead of defaulting to mongodb
  if (!resources) {
    const keys = Object.keys(resourcesByTopic);
    resources = resourcesByTopic[keys[0]] || resourcesByTopic["mongodb"];
  }
  
  let level = "beginner";
  if (day > 10 && day <= 20) level = "intermediate";
  if (day > 20) level = "advanced";
  
  return resources[level] || resources["beginner"];
}

function generateMockLearningPlan(topic: string, level: SkillLevel): LearningDay[] {
  const days: LearningDay[] = [];
  
  for (let day = 1; day <= 30; day++) {
    let title = "";
    let content = "";
    let resources = [];
    let quiz = { question: "", options: [""], correctAnswer: 0, explanation: "" };
    
    if (day <= 10) {
      // Beginner level
      title = `Day ${day}: ${topic} Fundamentals - Part ${day}`;
      content = `What is ${topic}?
This is a foundational concept in ${topic} learning. Think of it like learning the alphabet before reading books.

Why is it important?
Understanding fundamentals helps you build stronger knowledge later on your journey.

Key Points to Remember:
• Foundation is crucial for advanced learning
• Take your time understanding basics  
• Practice makes perfect
• Don't rush through this phase

Step-by-Step Guide:
1. Read and understand the concept carefully
2. Write down key points in your own words
3. Create a simple example to test your understanding
4. Review before moving to next lesson

Real-World Example:
In real-world scenarios, people who master fundamentals progress much faster than those who skip basics.

Pro Tip:
💡 Review what you learned yesterday before starting today's lesson. Repetition strengthens memory.`;
      
      resources = getTopicResources(topic, day);
      
      quiz = {
        question: `What is the main purpose of ${topic}?`,
        options: [
          `${topic} is only used for solving problems`,
          "It is just a theoretical concept",
          "It helps with both basic and advanced tasks",
          "It has no real-world applications"
        ],
        correctAnswer: 2,
        explanation: `${topic} is versatile and serves multiple purposes from solving problems to enabling advanced skills.`
      };
    } else if (day <= 20) {
      // Intermediate level
      const intermediateTopic = (day - 10);
      title = `Day ${day}: ${topic} Intermediate Skills - Concept ${intermediateTopic}`;
      content = `Intermediate ${topic} Concepts
Now that you've mastered the basics, let's explore more advanced applications and real-world scenarios.

What we'll cover:
Understanding practical applications of ${topic} beyond the basics that professionals use daily.

Key Points to Remember:
• Build on your foundational knowledge
• Practice combining multiple concepts
• Test your understanding with hands-on projects
• Challenge yourself gradually

Step-by-Step Guide:
1. Review basics from days 1-10 to reinforce knowledge
2. Learn new intermediate concepts and patterns
3. Practice combining concepts in mini-projects
4. Build a small application using learned concepts

Real-World Example:
Professional developers use these intermediate skills daily in production code to solve complex problems efficiently.

Pro Tip:
💡 Create a project combining multiple concepts to reinforce learning and build your portfolio.`;
      
      resources = getTopicResources(topic, day);
      
      quiz = {
        question: `Which is an intermediate application of ${topic}?`,
        options: [
          "Just memorizing basic definitions",
          "Combining multiple concepts to solve real problems",
          "Reading advanced academic papers",
          "Working without any planning"
        ],
        correctAnswer: 1,
        explanation: "Intermediate skills involve combining multiple concepts and patterns to build practical solutions."
      };
    } else {
      // Advanced level
      const advancedTopic = (day - 20);
      title = `Day ${day}: Advanced ${topic} - Expert Strategy ${advancedTopic}`;
      content = `Advanced ${topic} Mastery
You're now ready for professional-level applications, optimization, and architectural decisions.

Expert Concepts:
Performance optimization, scalability, design patterns, and best practices used by industry leaders.

Key Points to Remember:
• Focus on performance and efficiency
• Consider edge cases and failure scenarios
• Write clean, maintainable code that others can understand
• Optimize for scale and reliability
• Document your decisions for future developers

Step-by-Step Guide:
1. Analyze production code examples from leading projects
2. Learn optimization techniques and performance patterns
3. Study architectural design patterns used in industry
4. Build production-ready projects with error handling

Real-World Example:
Large tech companies use these advanced techniques to handle millions of users reliably while maintaining performance.

Pro Tip:
💡 Contribute to open source projects or build a portfolio project using these advanced skills to showcase mastery.`;
      
      resources = getTopicResources(topic, day);
      
      quiz = {
        question: `What characterizes advanced ${topic} practice?`,
        options: [
          "Following tutorials without thinking",
          "Optimization, scalability, and production-ready code",
          "Just learning new syntax",
          "Avoiding collaboration with other developers"
        ],
        correctAnswer: 1,
        explanation: "Advanced practice involves optimization, scalability, and applying best practices in production environments."
      };
    }
    
    days.push({
      day,
      title,
      topic: `${topic} - Day ${day}`,
      content,
      resources,
      quiz,
      completed: false,
      locked: day > 1
    });
  }
  
  return days;
}

export const geminiService = {
  async generateAssessment(profile: UserProfile): Promise<AssessmentQuestion[]> {
    // Use mock data based on role, or default questions
    const questions = mockAssessmentQuestions[profile.role] || mockAssessmentQuestions["default"];
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return questions;
  },

  async evaluateAssessment(profile: UserProfile, answers: { questionId: string, answerIndex: number, correct: boolean }[]): Promise<AssessmentResult> {
    // Mock evaluation logic
    const score = answers.filter(a => a.correct).length;
    const maxScore = answers.length;
    const percentage = (score / maxScore) * 100;
    
    // Determine skill level based on score
    let suggestedLevel: SkillLevel;
    if (percentage >= 80) suggestedLevel = "Expert";
    else if (percentage >= 60) suggestedLevel = "Advanced";
    else if (percentage >= 40) suggestedLevel = "Intermediate";
    else suggestedLevel = "Beginner";
    
    // Mock weak and strong areas based on score
    const weakAreas = profile.skills.slice(0, 2);
    const strongAreas = profile.skills.slice(profile.skills.length - 2);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      score,
      maxScore,
      suggestedLevel,
      feedback: `Great job! You scored ${percentage.toFixed(0)}%. Your level is ${suggestedLevel}. ${percentage >= 60 ? "You have a solid foundation." : "Focus on fundamentals to improve."}`,
      weakAreas: weakAreas.length > 0 ? weakAreas : ["Fundamentals"],
      strongAreas: strongAreas.length > 0 ? strongAreas : ["Problem Solving"]
    };
  },

  async generateLearningPlan(profile: UserProfile, result: AssessmentResult): Promise<LearningPlan> {
    const planId = `plan-${Date.now()}`;
    
    // Use user's first selected skill (from onboarding) as the primary topic
    // This is what they explicitly chose to learn
    const topic = profile.skills && profile.skills.length > 0 
      ? profile.skills[0] 
      : result.weakAreas[0] || "General Skills";
    
    const days = generateMockLearningPlan(topic, result.suggestedLevel);
    
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      id: planId,
      title: `30-Day ${result.suggestedLevel} Learning Path for ${topic}`,
      targetSkill: topic,
      currentDay: 1,
      days
    };
  },

  async askMentor(query: string, context: string, level: string, language: string): Promise<string> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Parse topic from context
    const topicMatch = context.match(/Current Topic: ([^\n-]+)/);
    const topic = topicMatch ? topicMatch[1].trim() : "your current topic";
    
    // Intelligent mentor responses based on question type and topic
    const queryLower = query.toLowerCase();
    
    // Topic-specific explanations
    const topicExplanations: Record<string, Record<string, string>> = {
      "mongodb": {
        "what": `🔹 **What is MongoDB?**

MongoDB is a NoSQL database that stores data in a flexible, JSON-like format called BSON (Binary JSON).

**Think of it like this:**
• Traditional databases = Excel spreadsheets (rigid columns)
• MongoDB = A filing cabinet where each file can have different properties

**🔹 Key Features**
• Flexible schema - documents don't need identical structure
• JSON-like format - easy for developers to work with
• Horizontal scaling - spread data across multiple servers
• Fast queries - optimized for common operations
• Document-oriented - stores related data together

**🔹 MongoDB vs Traditional Databases**

| Feature | MongoDB | SQL (MySQL, Postgres) |
|---------|---------|----------------------|
| Data model | Documents (JSON) | Tables (rows/columns) |
| Schema | Flexible | Rigid |
| Scalability | Horizontal | Vertical |
| Best for | Rapid development, varying data | Complex relationships |
| Learning curve | Easy ⭐ | Moderate |

**🔹 Perfect for:**
✓ Social media apps (users have different fields)
✓ E-commerce (products vary in properties)
✓ Content management systems
✓ Real-time applications
✓ Mobile app backends`,
        
        "how": `🔹 **MongoDB Quick Start**

**Step 1: Set up MongoDB**
\`\`\`bash
# Download from mongodb.com or use cloud (MongoDB Atlas)
# Start local server: mongod
\`\`\`

**Step 2: Basic operations**
\`\`\`javascript
// Insert data
db.users.insertOne({name: "Alice", age: 25, skills: ["JavaScript", "React"]})

// Find all users
db.users.find()

// Find specific users
db.users.find({age: {$gt: 20}})

// Update user
db.users.updateOne({name: "Alice"}, {$set: {age: 26}})

// Delete user
db.users.deleteOne({name: "Alice"})
\`\`\`

**Step 3: Collections & Documents**
\`\`\`javascript
// Create collection
db.createCollection("posts")

// Insert with structure
db.posts.insertOne({
  title: "My First Post",
  author: "Alice",
  likes: 10,
  tags: ["javascript", "mongodb"],
  createdAt: new Date()
})
\`\`\`

**Step 4: Advanced queries**
\`\`\`javascript
// Multiple conditions
db.users.find({age: {$gte: 18}, city: "New York"})

// Using arrays
db.users.find({skills: "JavaScript"})

// Sort and limit
db.users.find().sort({age: -1}).limit(5)
\`\`\`

**🔹 Popular MongoDB packages**
• mongoose - Object modeling for Node.js
• mongodb - Official driver
• aggregation - Complex data queries
• indexes - Speed up searches`,
        
        "why": `🔹 **Why Learn MongoDB?**

**Huge Job Market:**
💼 MongoDB Developer: $110-150k/year
💼 Full-stack Developer: $120-170k/year
💼 Backend Engineer: $130-180k/year
💼 Database Administrator: $100-140k/year

**Technical Advantages:**
✓ Developer-friendly - JSON format matches JavaScript objects
✓ Flexible - schema changes without migrations
✓ Scalable - handles growth easily
✓ Fast development - get to market quickly
✓ Real-time - perfect for live apps
✓ No SQL complexity - simpler queries than relational DBs

**Perfect for:**
✅ Startups & MVPs - develop quickly
✅ Mobile apps - flexible backends
✅ Real-time applications - live updates
✅ Content-heavy apps - images, videos, documents
✅ Social networks - user-generated content

**Companies using MongoDB:**
• Uber
• Airbnb
• Slack
• eBay
• Adobe`,
        
        "companies": `🏢 **Companies Using MongoDB**

**Major Tech Companies:**
🔹 **Uber** - Stores location data, user profiles, ride history
🔹 **Airbnb** - Manages listings, bookings, user reviews
🔹 **Slack** - Stores messages, workspace data, user info
🔹 **eBay** - Product catalogs, transactions, seller data
🔹 **Adobe** - Cloud services, user data, creative assets
🔹 **Spotify** - Music metadata, user preferences, playlists
🔹 **Amazon** - Product catalogs, reviews, inventory
🔹 **Netflix** - User profiles, viewing history, recommendations
🔹 **Google** - Various backend services and data storage
🔹 **Intel** - Infrastructure and data management
🔹 **IKEA** - Product data, inventory, orders
🔹 **Bosch** - IoT data and device management

**Why these companies chose MongoDB:**
✓ Handles massive scale (millions of users)
✓ Flexible schema for diverse data types
✓ Real-time performance
✓ Easy horizontal scaling
✓ Developer-friendly technology stack

**Industry Usage:**
- **StartUps** - 95% use MongoDB for rapid development
- **Mobile Apps** - 80% use MongoDB for backends
- **Real-time Apps** - 85% use MongoDB
- **IoT & Big Data** - Growing adoption rapidly

**Salary Impact - Companies Hiring:**
- MongoDB skills add $15-30k to base salary
- DevOps with MongoDB: $140-180k/year
- Senior MongoDB Architect: $170-250k/year
- Full-stack with MongoDB: $120-170k/year

**How to stand out:**
✅ Learn MongoDB + Node.js (most common stack)
✅ Build projects with real companies' use cases
✅ Master scaling techniques
✅ Get MongoDB certified
✅ Contribute to open source MongoDB projects`,
        
        "error": `🔹 **Common MongoDB Errors & Fixes**

**1️⃣ MongoNetworkError - Cannot connect**
Fix: Ensure MongoDB service is running
\`\`\`bash
# Check if mongod is running, start it if needed
mongod --dbpath /path/to/data
\`\`\`

**2️⃣ Collection not found**
Cause: Wrong collection name (MongoDB is case-sensitive)
Fix: Use exact collection name
\`\`\`javascript
db.Users.find()  // Wrong - should be db.users
\`\`\`

**3️⃣ Document validation errors**
Fix: Ensure data types match schema
\`\`\`javascript
// Correct
db.users.insertOne({name: "Alice", age: 25})
// Wrong
db.users.insertOne({name: "Alice", age: "25"})
\`\`\`

**4️⃣ Query returns empty**
Fix: Check filter conditions
\`\`\`javascript
// Better: add debug logging
console.log(db.users.countDocuments())  // Check count
\`\`\`

**5️⃣ Performance issues - slow queries**
Fix: Add indexes to searched fields
\`\`\`javascript
db.users.createIndex({email: 1})
db.users.createIndex({age: 1})
\`\`\`

**🔹 Debugging Checklist**
✓ Check MongoDB connection status
✓ Verify database & collection names
✓ Use \`find()\` to inspect data structure
✓ Check indexes with \`getIndexes()\`
✓ Review MongoDB logs for errors
✓ Test queries in MongoDB Compass (GUI tool)`
      },
      "python": {
        "what": `Python is a high-level, beginner-friendly programming language used for web development, data science, automation, and AI.

**Why Python?**
- Clear, readable syntax - looks almost like English
- Huge library ecosystem - pre-built tools for almost everything
- Versatile - one language for many purposes
- Growing demand - companies hire Python developers heavily

**Real-world uses:**
- Netflix uses Python for content recommendations
- Instagram uses Python for photo filters
- Spotify uses Python for recommendation algorithms
- Google and Amazon use Python extensively`,
        
        "how": `**Python basics - Getting started:**

1. **Install Python** - From python.org
2. **Choose an editor** - VS Code, PyCharm, or Jupyter
3. **Write your first program:**
\`\`\`python
print("Hello, World!")
name = "Alice"
age = 25
print(f"My name is {name} and I am {age} years old")
\`\`\`

4. **Learn the fundamentals:**
- Variables and data types (strings, numbers, lists)
- Control flow (if/else, loops)
- Functions (reusable code blocks)
- Libraries (numpy, pandas, requests)

5. **Practice with projects:**
- Build a calculator
- Create a to-do list app
- Scrape data from websites
- Build a web app with Flask

Start simple, then gradually increase complexity!`,
        
        "why": `**Why learn Python?**

1. **Easy to learn** - Clear syntax, less complex than Java/C++
2. **Versatile** - One language for backend, data science, automation
3. **High demand** - Top language requested by employers
4. **Rich ecosystem** - NumPy, Pandas, TensorFlow, Django pre-built
5. **Community** - Massive community, lots of tutorials and help
6. **Career opportunities** - Data scientist, backend engineer, DevOps

**Career salaries (approximate):**
- Python Developer: $100-150k/year
- Data Scientist: $120-180k/year
- ML Engineer: $150-250k/year`,
        
        "companies": `🏢 **Companies Using Python**

**Major Tech Companies:**
🔹 **Google** - Core infrastructure, YouTube, etc.
🔹 **Meta/Facebook** - Data analytics, ML systems
🔹 **Netflix** - Recommendations, data analysis
🔹 **Amazon** - Cloud services, data processing
🔹 **Microsoft** - Azure, AI services, tools
🔹 **Apple** - Siri, machine learning
🔹 **Intel** - Data processing, optimization
🔹 **Spotify** - Music recommendations
🔹 **Instagram** - Backend, photo processing
🔹 **Dropbox** - File syncing, backend
🔹 **Uber** - Ride algorithms, data science
🔹 **LinkedIn** - ML models, recommendations
🔹 **Airbnb** - Search algorithms, analytics
🔹 **Pinterest** - Recommendations, data analysis

**Why companies chose Python:**
✓ Fast development and prototyping
✓ Powerful libraries (NumPy, Pandas, TensorFlow)
✓ Machine learning capabilities
✓ Data science tools are best-in-class
✓ Easy to scale with teams
✓ Great for automation scripts

**Industry Usage:**
- 90% of data science teams use Python
- 80% of ML projects built with Python
- Used by 75% of Fortune 500 companies
- #1 language for AI/ML development

**Salary Impact - Companies Hiring:**
- Python adds $15-30k to base salary
- Python Developer: $100-150k/year
- Data Scientist: $120-180k/year
- ML Engineer: $150-250k/year
- Senior Data Scientist: $200-300k/year

**How to stand out:**
✅ Learn data science (Pandas, NumPy, Matplotlib)
✅ Master machine learning (Scikit-learn, TensorFlow)
✅ Build data analysis projects
✅ Learn SQL for databases
✅ Get Python certifications
✅ Contribute to open source projects`,
        
        "error": `**Common Python errors and fixes:**

1. **IndentationError** - Python requires proper spacing
   Fix: Use consistent indentation (4 spaces is standard)

2. **NameError** - Variable not defined
   Fix: Check spelling and make sure variable is created first

3. **TypeError** - Wrong data type
   Fix: Make sure you're using the right type (string vs number)

4. **IndexError** - List index out of range
   Fix: Check list length before accessing elements

5. **ModuleNotFoundError** - Library not installed
   Fix: Run 'pip install library_name' in terminal`
      },
      "javascript": {
        "what": `JavaScript is the programming language that powers interactive web experiences - it runs in every browser!

**What JavaScript does:**
- Makes websites interactive (buttons, animations, forms)
- Communicates with servers without refreshing page
- Powers modern web apps (React, Vue, Angular)
- Now also used on servers (Node.js)

**Real examples:**
- Google Maps - dragging the map, zooming
- Netflix - smooth playback and recommendations
- Slack - real-time messaging
- Your email interface - Gmail, Outlook`,
        
        "how": `**JavaScript basics:**

1. **Add to HTML:**
\`\`\`html
<script>
  alert("Hello from JavaScript!");
</script>
\`\`\`

2. **Key concepts:**
- Variables: \`let name = "Alice";\`
- Functions: \`function greet() { return "Hi!"; }\`
- Events: \`button.addEventListener('click', function() {...})\`
- DOM manipulation: Change what users see

3. **Example - Interactive button:**
\`\`\`javascript
let count = 0;
button.addEventListener('click', function() {
  count++;
  display.textContent = count;
});
\`\`\`

4. **Learn next:**
- ES6 modern syntax
- Async/await for server calls
- React or Vue frameworks
- APIs and data fetching`,
        
        "why": `**Why JavaScript is essential:**

1. **Browser power** - Only language that runs natively in browsers
2. **Full-stack** - Frontend AND backend (with Node.js)
3. **High demand** - Most requested frontend skill
4. **Huge ecosystem** - React, Vue, Express, etc.
5. **Constant improvement** - New features every year
6. **Real-time apps** - Perfect for live updates and interactions

**Job opportunities:**
- Frontend Developer: $90-130k/year
- Full-Stack Developer: $100-150k/year
- Node.js Backend: $110-160k/year`,
        
        "companies": `🏢 **Companies Using JavaScript**

**Major Tech Companies:**
🔹 **Google** - Search, Gmail, Google Workspace
🔹 **Facebook/Meta** - Entire platform built on JavaScript
🔹 **Netflix** - Streaming UI and interactions
🔹 **Amazon** - Web services and interfaces
🔹 **Microsoft** - VS Code, Azure, Office 365
🔹 **Apple** - Web services and iCloud
🔹 **Slack** - Web client and desktop app
🔹 **Uber** - Ride-sharing platform
🔹 **Airbnb** - Booking platform and UI
🔹 **Spotify** - Web player and dashboard
🔹 **PayPal** - Payment processing UI
🔹 **Dropbox** - File management UI
🔹 **Pinterest** - Image discovery platform
🔹 **Instagram** - Web version

**Why companies chose JavaScript:**
✓ Runs everywhere (browsers, servers, mobile)
✓ Huge developer pool (most popular language)
✓ Rich ecosystem of frameworks
✓ Fast development and prototyping
✓ Real-time capabilities with websockets
✓ Single language full-stack development

**Industry Statistics:**
- 70% of all websites use JavaScript
- 90% of job postings mention JavaScript
- #1 most used programming language
- 12.5 million JavaScript developers worldwide

**Salary Impact - Companies Hiring:**
- JavaScript adds $10-25k to base salary
- Frontend Developer: $90-130k/year
- Full-Stack Developer: $100-150k/year
- Senior JavaScript: $150-200k/year
- JavaScript Freelancer: $40-120/hour

**How to stand out:**
✅ Learn modern ES6+ syntax
✅ Master React or Vue framework
✅ Learn Node.js for backend
✅ Build full-stack applications
✅ Understand async/await and promises
✅ Contribute to npm open source`,
        
        "error": `**Debug JavaScript like a pro:**

1. **Console errors** - Open DevTools (F12), check Console tab
2. **Use console.log()** - Print values to see what's happening
3. **Breakpoints** - Click line numbers in DevTools to pause code
4. **Check types** - Use \`typeof variable\` to verify data types
5. **Network tab** - See if server calls succeed
6. **React DevTools** - Special extension for React debugging

**Common mistakes:**
- Undefined variables
- Trying to use before declaring
- Async/await issues
- Event listener not firing`
      },
      "api": {
        "what": `An API (Application Programming Interface) is like a restaurant menu. You don't need to know how the kitchen works - you just order what you want, and the kitchen delivers it!

**In programming:**
- API = A way for different programs to talk to each other
- You send a request to a server asking for data
- The server responds with the information you need

**Real-world APIs:**
- **Weather API** - Get current temperature for any city
- **Twitter API** - Access tweets, post content
- **Google Maps API** - Get directions, location data
- **Stripe API** - Process payments on websites
- **GitHub API** - Access repositories, commit data

**Types of APIs:**
1. **REST API** - Most common, uses HTTP requests
2. **GraphQL** - Query exactly what you need
3. **SOAP** - Enterprise-level, complex
4. **WebSocket** - Real-time, two-way communication`,
        
        "how": `**How to use an API - Step by Step:**

1. **Get API credentials:**
   - Sign up on the API provider's website
   - Get API key or authentication token
   - Read the documentation

2. **Make a request (example with fetch):**
\`\`\`javascript
fetch('https://api.example.com/users/123')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
\`\`\`

3. **Understand request methods:**
   - **GET** - Retrieve data (read)
   - **POST** - Create new data (write)
   - **PUT** - Update entire resource
   - **DELETE** - Remove data
   - **PATCH** - Update part of resource

4. **Example - Get weather data:**
\`\`\`javascript
const apiKey = "your_api_key_here";
const city = "New York";
fetch(\`https://api.weather.com/data?city=\${city}&key=\${apiKey}\`)
  .then(res => res.json())
  .then(data => console.log(data.temperature));
\`\`\`

5. **Using in Python:**
\`\`\`python
import requests
response = requests.get('https://api.example.com/users')
data = response.json()
print(data)
\`\`\`

6. **Common steps:**
   - Check documentation
   - Build request with correct URL
   - Add required headers and authentication
   - Handle the response
   - Handle errors gracefully`,
        
        "why": `**Why are APIs important?**

1. **Integration** - Connect different services (payment, weather, maps)
2. **Efficiency** - Use pre-built functionality instead of building from scratch
3. **Scalability** - Third-party services handle the heavy lifting
4. **Cost** - Cheaper than building everything yourself
5. **Innovation** - Enable new features and possibilities
6. **Real-time data** - Get live data from external sources

**Real-world business impact:**
- Uber integrates with Google Maps API for navigation
- Shopify stores use payment APIs (Stripe, PayPal)
- Mobile apps use weather, news, and sports APIs
- Social media apps integrate with multiple APIs

**Career relevance:**
- **API Developer** - Design and build APIs: $110-160k/year
- **Integration Engineer** - Connect APIs: $100-140k/year
- **REST API expertise** - Critical skill for backend developers
- **GraphQL developer** - Emerging high-demand role: $130-180k/year`,
        
        "companies": `🏢 **Companies Using APIs**

**Major API Providers:**
🔹 **Google** - Maps, Translate, Cloud APIs
🔹 **Amazon** - AWS APIs, e-commerce APIs
🔹 **Microsoft** - Azure, Office 365, AI APIs
🔹 **Meta** - Facebook, Instagram, WhatsApp APIs
🔹 **Twitter** - Tweet APIs, analytics
🔹 **Stripe** - Payment APIs (most popular)
🔹 **Twilio** - SMS, voice, communication APIs
🔹 **SendGrid** - Email delivery APIs
🔹 **Auth0** - Authentication APIs
🔹 **Slack** - Bot and integration APIs
🔹 **Salesforce** - CRM and integration APIs
🔹 **Shopify** - E-commerce APIs
🔹 **Uber** - Ride-sharing APIs
🔹 **Airbnb** - Booking and listing APIs

**Companies Building APIs:**
- Every tech company has internal + public APIs
- 85% of apps are built on APIs
- 90% of app integrations use APIs
- API economy worth $1.7 trillion

**Why companies use APIs:**
✓ Connect multiple services easily
✓ Scale without building everything
✓ Faster time-to-market
✓ Cost reduction
✓ Better security and reliability
✓ Focus on core business logic

**Salary Impact - Companies Hiring:**
- API knowledge adds $15-30k to salary
- API Developer: $110-160k/year
- Senior API Architect: $160-220k/year
- Integration Engineer: $100-140k/year
- GraphQL Developer: $130-180k/year

**How to stand out:**
✅ Master REST & GraphQL
✅ Learn API design principles
✅ Build APIs with Node.js/Python
✅ Understand authentication (OAuth, JWT)
✅ Experience with API testing (Postman)
✅ Learn API documentation best practices`,
        
        "error": `**Common API errors and fixes:**

1. **401 Unauthorized** - Invalid or missing authentication
   Fix: Check API key, add proper headers, verify token is fresh

2. **404 Not Found** - Wrong URL or endpoint doesn't exist
   Fix: Check documentation, verify endpoint path, confirm resource ID

3. **429 Too Many Requests** - Rate limit exceeded
   Fix: Add delays between requests, cache results, upgrade API plan

4. **500 Server Error** - API server has a problem
   Fix: Check API status page, try again later, contact support

5. **CORS Error** - Cross-Origin issue in browser
   Fix: Check if API allows your domain, use proxy, ask API owner

6. **Timeout** - Request takes too long
   Fix: Increase timeout value, optimize query, check network

**Debugging checklist:**
✓ Is API endpoint correct?
✓ Is authentication token valid?
✓ Are required headers included?
✓ Check API documentation for correct format
✓ Use Postman to test API before coding
✓ Check network tab in browser DevTools
✓ Print request and response for debugging`
      },
      "nodejs": {
        "what": `🔹 **What is Node.js?**

Node.js is JavaScript that runs on the server-side, not just in browsers. It allows you to use JavaScript to build powerful backend applications.

**🔹 Think of it like this:**
- **Before Node.js** - JavaScript only ran in browsers, server code needed Java, Python, or PHP
- **With Node.js** - You use the same JavaScript language for both frontend AND backend

**🔹 What makes Node.js special:**
- Uses JavaScript everywhere (frontend + backend) ✨
- Event-driven, non-blocking I/O - handles many requests efficiently
- Built on Chrome's V8 engine - very fast 🚀
- NPM (Node Package Manager) - huge library of reusable packages
- Great for real-time applications - uses WebSockets
- Single-threaded event loop - efficient memory usage

**🔹 Real-world companies using Node.js:**
✓ Netflix - uses Node.js for streaming
✓ LinkedIn - built with Node.js
✓ Uber - real-time ride tracking
✓ Walmart - handles millions of transactions
✓ PayPal - backend processing
✓ Twitter - uses Node.js
✓ eBay - backend services`,
        
        "how": `🔹 **How to use Node.js - Quick Start**

**Step 1: Install Node.js**
\`\`\`bash
# Download from nodejs.org
# Includes Node.js AND npm (package manager)
node --version  # Verify installation
\`\`\`

**Step 2: Create your first project**
\`\`\`bash
mkdir my-first-app
cd my-first-app
npm init -y
\`\`\`

**Step 3: Create a simple server (app.js)**
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, Node.js!\\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
\`\`\`

**Step 4: Run your app**
\`\`\`bash
node app.js
\`\`\`

**🔹 Use Express (most popular framework)**
\`\`\`javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(3000);
\`\`\`

**🔹 Popular commands**
\`\`\`bash
npm init -y              # Initialize project
npm install package      # Add package
npm install nodemon -D   # Auto-restart on changes
npm start                # Run project
\`\`\`

**🔹 Core packages to know**
• express - web framework
• mongoose - MongoDB ORM
• dotenv - environment variables
• cors - cross-origin support
• axios - HTTP client`,
        
        "why": `🔹 **Why learn Node.js?**

**Huge Job Market:**
💼 Node.js Developer: $110-160k/year
💼 Full-Stack Developer: $100-150k/year
💼 Backend Engineer: $120-170k/year
💼 DevOps with Node.js: $130-180k/year

**Technical Advantages:**
✓ Full-stack with one language - JavaScript everywhere
✓ High performance - handles thousands of concurrent connections
✓ Perfect for APIs - build REST APIs quickly
✓ Real-time capabilities - WebSockets for live updates
✓ Huge ecosystem - millions of packages on NPM
✓ Scalable - used by Netflix, LinkedIn, Uber

**Perfect for building:**
✅ Web servers and APIs (most common)
✅ Real-time applications (chat, notifications)
✅ Streaming services (Netflix uses it!)
✅ IoT (Internet of Things)
✅ Microservices
✅ Desktop apps (Electron)

**Why companies love Node.js:**
• Fast development - get to market quickly
• Scalability - handle growth without rewriting
• Cost-effective - fewer servers needed
• Developer productivity - reuse code between frontend/backend

**Companies hiring Node.js developers:**
• Netflix
• LinkedIn
• Uber
• Walmart
• PayPal`,
        
        "companies": `🏢 **Companies Using Node.js**

**Major Tech Companies:**
🔹 **Netflix** - Streaming platform and user interface
🔹 **LinkedIn** - Job platform and networking
🔹 **Uber** - Ride-sharing real-time systems
🔹 **Walmart** - E-commerce and transactions
🔹 **PayPal** - Payment processing system
🔹 **Slack** - Messaging platform backend
🔹 **Dropbox** - Cloud file syncing
🔹 **Airbnb** - Booking platform
🔹 **Medium** - Blogging platform
🔹 **eBay** - E-commerce backend
🔹 **NASA** - Space agency systems
🔹 **Square** - Payment solutions
🔹 **Mozilla** - Firefox browser services
🔹 **Heroku** - Cloud platform

**Why companies chose Node.js:**
✓ JavaScript on server and client (single language)
✓ High performance and scalability
✓ Non-blocking I/O handles many connections
✓ Perfect for APIs and microservices
✓ Real-time capabilities with WebSockets
✓ Large developer pool (many know JavaScript)
✓ Fast development cycles

**Industry Statistics:**
- 50% of startups use Node.js
- 80% of APIs built with Node.js or Python
- Used by 80% of Fortune 500 companies
- JavaScript (with Node.js) dominates web

**Salary Impact - Companies Hiring:**
- Node.js adds $15-35k to base salary
- Node.js Developer: $110-160k/year
- Senior Node.js: $150-210k/year
- Backend Architect: $170-250k/year
- Node.js Freelancer: $50-150/hour

**How to stand out:**
✅ Learn Express.js (most popular framework)
✅ Master async/await and Promises
✅ Build REST APIs and microservices
✅ Learn MongoDB for databases
✅ Understand Docker deployment
✅ Contribute to Node.js open source`,
        
        "error": `🔹 **Common Node.js Errors & Fixes**

**1️⃣ Cannot find module** - Missing package
Fix: \`npm install package-name\`
Check: Is package name spelled correctly?

**2️⃣ EADDRINUSE** - Port already in use
Fix: Change port OR kill process using the port
Command: On Windows: \`netstat -ano | findstr :3000\` then \`taskkill /PID <PID> /F\`

**3️⃣ TypeError: Cannot read property of undefined**
Fix: Check if variable exists before using
Use: Optional chaining \`obj?.property\`

**4️⃣ Callback not firing / Async issues**
Fix: Use promises or async/await
\`\`\`javascript
// Use async/await instead of callbacks
const data = await fetchData();
console.log(data);
\`\`\`

**5️⃣ Memory leak** - App uses more memory over time
Fix: Check for unreleased event listeners
Fix: Close database connections properly
Use: \`--max-old-space-size=4096\` to increase memory

**6️⃣ CORS errors** - API blocked by browser
Fix: Install CORS package: \`npm install cors\`
\`\`\`javascript
const cors = require('cors');
app.use(cors());
\`\`\`

**🔹 Debugging Checklist**
✓ Use \`console.log()\` strategically
✓ Check browser console for errors
✓ Use Node debugger: \`node --inspect app.js\`
✓ Check network tab in DevTools
✓ Look at request/response objects
✓ Monitor memory usage with \`--max-old-space-size\``
      },
      "flask": {
        "what": `🔹 **What is Flask?**

Flask is a lightweight web framework for Python used to build web applications and APIs quickly with minimal code.

Flask is called a **micro-framework** because it provides only essential tools without extra features like database layers (you add what you need).

**🔹 Key Features**
• Lightweight & simple - easy to learn
• Flexible - choose your own tools
• Built-in development server - test locally
• Routing system - maps URLs to functions
• Jinja2 templating - generate HTML dynamically
• RESTful request handling - perfect for APIs

**🔹 Flask vs Django**

| Feature | Flask | Django |
|---------|-------|--------|
| Type | Micro-framework | Full framework |
| Flexibility | High | Less flexible |
| Learning curve | Easy ⭐ | Moderate |
| Built-in tools | Minimal | Many |
| Best for | Small projects, APIs | Large apps |

**🔹 Real-world uses**
✓ Web applications (blogs, portfolios)
✓ REST APIs
✓ Backend for mobile apps
✓ Prototypes and MVPs`,
        
        "how": `🔹 **How to use Flask - Quick Start**

**Step 1: Install Flask**
\`\`\`bash
pip install flask
\`\`\`

**Step 2: Create your first app (app.py)**
\`\`\`python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

**Step 3: Run it**
\`\`\`bash
python app.py
# Visit http://127.0.0.1:5000/
\`\`\`

**🔹 Important Concepts**

**Routes & Functions:**
\`\`\`python
@app.route('/about')
def about():
    return "About page"

@app.route('/user/<name>')
def greet(name):
    return f"Hello {name}!"
\`\`\`

**Returning JSON (for APIs):**
\`\`\`python
from flask import jsonify

@app.route('/api/data')
def get_data():
    return jsonify({'name': 'Alice', 'age': 25})
\`\`\`

**Accepting POST data:**
\`\`\`python
from flask import request

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    return {'received': data}
\`\`\`

**🔹 Popular Flask Extensions**
• Flask-SQLAlchemy - database ORM
• Flask-Login - user authentication
• Flask-Cors - handle cross-origin requests
• Flask-RESTful - build REST APIs`,
        
        "why": `🔹 **Why learn Flask?**

**Career Benefits:**
💰 Flask Developer: $100-140k/year
💰 Full-stack Python: $110-150k/year
💰 Backend Engineer: $120-160k/year

**Technical Advantages:**
✓ Easy to learn - perfect for beginners
✓ Python is popular everywhere (data science + web)
✓ Great for startups - quick prototyping
✓ Large community & tons of tutorials
✓ Highly customizable for your needs

**When to use Flask:**
✅ Building APIs
✅ Small to medium projects
✅ Rapid prototyping
✅ Learning web development
✅ Microservices

**Perfect for:**
• Startups - get MVP fast
• APIs - RESTful endpoints
• Learning - simpler than Django
• Flexibility - control everything

**Companies using Flask:**
• Netflix
• LinkedIn
• Pinterest`,
        
        "companies": `🏢 **Companies Using Flask**

**Major Tech Companies:**
🔹 **Netflix** - Uses Flask for content delivery services
🔹 **LinkedIn** - Job platform features
🔹 **Pinterest** - Photo platform backend
🔹 **Uber** - API infrastructure
🔹 **Spotify** - Music recommendation services
🔹 **Dropbox** - File sharing services
🔹 **Airbnb** - Backend services
🔹 **Mailchimp** - Email marketing platform
🔹 **Stripe** - Payment processing platform
🔹 **DigitalOcean** - Cloud infrastructure services

**Why companies chose Flask:**
✓ Lightweight and flexible
✓ Perfect for APIs and microservices
✓ Easy to scale as needed
✓ Great for prototyping and MVPs
✓ Runs efficiently on servers
✓ Simple to understand and maintain

**Industry Usage:**
- 70% of startups use Flask for APIs
- 85% of microservices built with Flask
- Used by 50+ Fortune 500 companies
- Growing adoption for serverless

**Salary Impact - Companies Hiring:**
- Flask adds $10-20k to base salary
- Backend Flask Developer: $100-140k/year
- Senior Flask Developer: $140-180k/year
- Full-stack Flask Developer: $120-160k/year
- Flask Freelancer: $40-100/hour

**How to stand out:**
✅ Learn Flask + SQLAlchemy (database ORM)
✅ Master REST API design
✅ Learn Docker for deployment
✅ Build microservices architecture
✅ Get comfortable with databases
✅ Deploy to cloud (AWS, Heroku, DigitalOcean)`,
        
        "error": `🔹 **Common Flask Errors & Fixes**

**1️⃣ ModuleNotFoundError: No module named 'flask'**
Fix: \`pip install flask\`

**2️⃣ RuntimeError: Working outside of request context**
Cause: Accessing request data outside Flask context
Fix: Use request inside route functions

**3️⃣ 404 Not Found**
Cause: Route doesn't exist
Fix: Check route URL spelling and method (GET/POST)

**4️⃣ TypeError: The view function did not return a valid response**
Cause: Function didn't return anything
Fix: \`return\` a string or jsonify object

**5️⃣ Port 5000 already in use**
Fix: Change port: \`app.run(port=5001)\`

**🔹 Debugging Checklist**
✓ Is Flask installed? (\`pip list\`)
✓ Are routes correct? (spelling, decorators)
✓ Check error messages in terminal
✓ Use \`debug=True\` during development
✓ Print values with \`print()\`
✓ Check HTTP method (GET/POST)`
      },
      "react": {
        "what": `🔹 **What is React?**

React is a JavaScript library for building user interfaces with reusable components. It makes web apps interactive and fast.

**Think of React like LEGO:**
• Each component is a LEGO block
• Combine blocks to build complex UIs
• Reuse blocks across projects
• Change one block without affecting others

**🔹 Key Concepts**
• **Components** - Reusable UI building blocks
• **JSX** - Write HTML inside JavaScript
• **State** - Data that changes over time
• **Props** - Pass data to components
• **Hooks** - Functions like useState, useEffect

**🔹 Why React?**
✓ Component-based - code reuse
✓ Virtual DOM - super fast rendering
✓ Large ecosystem - tons of libraries
✓ Easy to learn for JavaScript developers
✓ Used by Facebook, Netflix, Airbnb

**🔹 React vs Other Frameworks**

| Feature | React | Vue | Angular |
|---------|-------|-----|---------|
| Learning curve | Easy | Very easy | Hard |
| Performance | Excellent | Excellent | Good |
| Popularity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Job demand | Highest | Growing | Still high |`,
        
        "how": `🔹 **React Basics - Quick Start**

**Step 1: Create app (with Create React App)**
\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

**Step 2: Basic Component**
\`\`\`javascript
function App() {
  return <h1>Hello React!</h1>
}
\`\`\`

**Step 3: State & Interactivity**
\`\`\`javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

**Step 4: Props (Pass data)**
\`\`\`javascript
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}

// Use it
<Greeting name="Alice" />
\`\`\`

**Step 5: Lists**
\`\`\`javascript
const items = ['React', 'Vue', 'Angular'];
<ul>
  {items.map(item => <li key={item}>{item}</li>)}
</ul>
\`\`\`

**🔹 Must-know Hooks**
• useState - add state to components
• useEffect - handle side effects
• useContext - share data globally
• useReducer - complex state management`,
        
        "why": `🔹 **Why Learn React?**

**Huge Job Market:**
💼 React Developer: $110-160k/year
💼 Full-stack React: $120-170k/year
💼 Senior React: $150-200k/year

**Technical Benefits:**
✓ Most popular JavaScript framework
✓ Used by Netflix, Facebook, Airbnb, Uber
✓ Component-based = less code
✓ Fast to build UIs
✓ Easy to learn if you know JavaScript

**Career Advantages:**
✓ Highest demand in job market
✓ Best salary among frontend frameworks
✓ Companies want React developers
✓ Growing constantly

**When to use React:**
✅ Interactive web apps
✅ Single Page Applications (SPAs)
✅ Dashboards & admin panels
✅ E-commerce sites
✅ Real-time apps

**Companies hiring React developers:**
• Netflix
• Facebook / Meta
• Airbnb
• Uber
• Amazon`,
        
        "companies": `🏢 **Companies Using React**

**Major Tech Companies:**
🔹 **Netflix** - Streaming platform and UI
🔹 **Facebook / Meta** - Creator, entire platform
🔹 **Airbnb** - Booking platform interface
🔹 **Uber** - Ride-sharing web platform
🔹 **Amazon** - E-commerce website
🔹 **Instagram** - Web version and dashboards
🔹 **PayPal** - Payment processing UI
🔹 **Slack** - Web application
🔹 **Dropbox** - File management UI
🔹 **Asana** - Project management platform
🔹 **Shopify** - E-commerce platform
🔹 **Salesforce** - CRM platform
🔹 **WhatsApp** - Web interface
🔹 **Pinterest** - Image platform

**Why companies chose React:**
✓ Most developers know React (biggest talent pool)
✓ Reusable components improve productivity
✓ Virtual DOM provides excellent performance
✓ Large ecosystem of libraries
✓ Proven at massive scale
✓ SEO-friendly with Next.js
✓ Easy to maintain codebases

**Industry Statistics:**
- 40% of all job postings ask for React
- 65% of Fortune 500 use React
- 80% of startups use React in tech stack
- React developers earn $25k more than average JS devs

**Salary Impact - Companies Hiring:**
- React adds $20-40k to base salary
- React Developer: $110-160k/year
- Senior React: $150-220k/year
- React Architect: $180-280k/year
- Freelance React: $80-200/hour

**How to stand out:**
✅ Learn Next.js for server-side rendering
✅ Master state management (Redux, Zustand)
✅ Build full-stack (React + Node.js)
✅ Learn TypeScript with React
✅ Contribute to React open source
✅ Create impressive portfolio projects`,
        
        "error": `🔹 **Common React Errors & Fixes**

**1️⃣ Cannot find module 'react'**
Fix: \`npm install react\`

**2️⃣ Objects are not valid as a React child**
Cause: Trying to render an object directly
Fix: Return data inside JSX: \`{JSON.stringify(obj)}\`

**3️⃣ Missing key prop in lists**
Warning when rendering lists without key
Fix: Add unique key: \`<li key={id}>{item}</li>\`

**4️⃣ useState is not defined**
Cause: Forgot to import
Fix: \`import { useState } from 'react';\`

**5️⃣ Cannot update a component while rendering**
Cause: State update in render logic
Fix: Move logic to useEffect

**🔹 Debugging Tips**
✓ Use React DevTools (browser extension)
✓ Check browser console for errors
✓ Use console.log() to track values
✓ Check component props in DevTools
✓ Ensure components are imported correctly`
      },
      "flutter": {
        "what": `🔹 **What is Flutter?**

Flutter is a mobile app development framework by Google that lets you build iOS and Android apps with a single codebase using Dart programming language.

**Think of it like this:**
• Build once for multiple platforms (iOS, Android, Web, Desktop)
• Same code runs everywhere - no rewriting needed
• Write in Dart - a beginner-friendly language

**🔹 Key Features**
• Cross-platform - One codebase, multiple apps
• Hot reload - See changes instantly (no recompile)
• Beautiful UI - Pre-built widgets and animations
• Fast performance - Compiled to native code
• Large community - Growing ecosystem
• Google-backed - Actively maintained

**🔹 Flutter vs Other Mobile Frameworks**

| Framework | Platform | Language | Learning curve |
|-----------|----------|----------|-----------------|
| Flutter | iOS + Android + Web | Dart | Easy ⭐ |
| React Native | iOS + Android | JavaScript | Moderate |
| Swift/Kotlin | One platform | Swift/Kotlin | Hard |
| Xamarin | iOS + Android + Web | C# | Moderate |

**🔹 Popular apps built with Flutter:**
✓ Google Ads
✓ eBay Motors
✓ BMW
✓ Alibaba
✓ Many startups`,
        
        "how": `🔹 **Flutter Quick Start**

**Step 1: Install Flutter**
\`\`\`bash
# Download from flutter.dev
# Add to PATH
flutter --version  # Verify installation
\`\`\`

**Step 2: Create your first app**
\`\`\`bash
flutter create my_first_app
cd my_first_app
flutter run
\`\`\`

**Step 3: Basic Flutter App (main.dart)**
\`\`\`dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Hello Flutter')),
        body: Center(child: Text('Welcome!')),
      ),
    );
  }
}
\`\`\`

**Step 4: Hot Reload**
\`\`\`bash
# Press 'r' in terminal while app runs
# Changes appear instantly!
\`\`\`

**🔹 Important Concepts**

**Widgets (building blocks):**
\`\`\`dart
Text('Hello')
Button()
Container()
Row()
Column()
\`\`\`

**State Management:**
\`\`\`dart
class Counter extends StatefulWidget {
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Text(count.toString());
  }
}
\`\`\`

**🔹 Popular packages**
• provider - state management
• http - API requests
• firebase - backend & analytics
• sqflite - local database`,
        
        "why": `🔹 **Why Learn Flutter?**

**Huge Job Market:**
💼 Flutter Developer: $100-150k/year
💼 Mobile Developer: $110-160k/year
💼 Full-stack Mobile: $120-170k/year
💼 Senior Flutter Dev: $150-200k/year

**Technical Advantages:**
✓ Build iOS + Android simultaneously - save time & money
✓ Hot reload - 10x faster development
✓ Beautiful UI out of the box
✓ Excellent documentation
✓ Growing job market (2nd most loved framework)
✓ Backed by Google

**When to use Flutter:**
✅ Cross-platform mobile apps
✅ Rapid prototyping
✅ Startup MVPs
✅ MVP to full app quickly
✅ Performance-critical apps
✅ Beautiful UI-focused apps

**Perfect for:**
• Startups - develop 2 apps in time of 1
• Companies - reduce maintenance costs
• Freelancers - offer more services
• Learning - great first mobile framework

**Companies hiring Flutter developers:**
• Google
• BMW
• Alibaba
• eBay
• Grab`,
        
        "companies": `🏢 **Companies Using Flutter**

**Major Tech Companies:**
🔹 **Google** - Creator, uses in Google Ads and internal apps
🔹 **BMW** - MyBMW mobile app, IoT integration
🔹 **Alibaba** - E-commerce mobile experiences
🔹 **eBay** - eBay Motors app and platforms
🔹 **Grab** - Southeast Asia ride-sharing and payments
🔹 **Google Ads** - Ad platform mobile app
🔹 **WhatsApp** - Various internal services
🔹 **Spotify** - Music streaming features
🔹 **Square** - Payment processing
🔹 **Philips Hue** - Smart home app
🔹 **Reflectly** - Mental health & journaling app
🔹 **Tencent** - Largest Chinese tech company

**Why companies chose Flutter:**
✓ Single codebase for iOS and Android
✓ Faster development cycles (hot reload)
✓ Beautiful UI without extra effort
✓ Strong performance on all platforms
✓ Lower development costs
✓ Easier maintenance and updates

**Startup Adoption:**
- 85% of new startups use Flutter
- Reduces time-to-market significantly
- One team manages both iOS and Android
- Cost savings of 40-60% vs native development

**Salary Impact - Companies Hiring:**
- Flutter adds $15-25k to base salary
- Flutter Developer: $100-150k/year
- Senior Flutter Developer: $150-200k/year
- Team Lead with Flutter: $180-220k/year
- Freelance Flutter projects: $50-150/hour

**How to stand out:**
✅ Learn Flutter + Firebase (most common)
✅ Master state management (Provider, Riverpod)
✅ Build cross-platform projects
✅ Contribute to Flutter open source
✅ Get Firebase certified
✅ Create portfolio apps on App Store/Play Store`,
        
        "error": `🔹 **Common Flutter Errors & Fixes**

**1️⃣ Command 'flutter' not found**
Fix: Download Flutter from flutter.dev and add to PATH
Verify: \`flutter --version\`

**2️⃣ Gradle build errors**
Cause: Android SDK issues
Fix: \`flutter doctor -v\` to diagnose
Solution: Update Android SDK if needed

**3️⃣ Null safety errors**
Cause: Variable might be null
Fix: Use null-safe operators: \`String? name = null;\`

**4️⃣ Widget doesn't update**
Cause: Not using StatefulWidget
Fix: Change to StatefulWidget or use state management

**5️⃣ Build errors after changes**
Fix: \`flutter clean\` then \`flutter pub get\`

**6️⃣ Hot reload not working**
Fix: Try \`flutter run\` again
Note: Some changes need full rebuild

**🔹 Debugging Checklist**
✓ Run \`flutter doctor -v\` to diagnose issues
✓ Check device connected: \`flutter devices\`
✓ Use DevTools: \`flutter pub global activate devtools\`
✓ Check logs: \`flutter logs\`
✓ Test on real device vs emulator
✓ Read error messages carefully`
      },
      "dart": {
        "what": `🔹 **What is Dart?**

Dart is a modern programming language by Google designed for building fast, multi-platform applications with a focus on developer productivity and performance.

**🔹 Why Dart exists:**
• Created by Google to power Flutter
• Combines best features of Java, C#, and JavaScript
• Compiles to native code AND runs on VMs
• Perfect for both frontend and backend

**🔹 Key Features**
• Type-safe - catch errors early
• Just-in-time (JIT) and Ahead-of-time (AOT) compilation
• Garbage collected - memory management automatic
• Strong OOP support - classes, inheritance, mixins
• Async/await - easy asynchronous programming
• Hot reload - instant development feedback

**🔹 Dart vs Other Languages**

| Language | Use Case | Type System | Learning Curve |
|----------|----------|------------|-----------------|
| Dart | Multi-platform apps | Strong typing | Easy ⭐ |
| Java | Backend/Android | Verbose | Moderate |
| Python | Data/Scripts | Dynamic | Easy |
| JavaScript | Web/Node | Dynamic | Easy |
| Go | Backend/CLI | Strong typing | Moderate |

**🔹 Dart is used for:**
✓ Flutter apps (primary use)
✓ Backend servers
✓ Command-line tools
✓ Web applications`,
        
        "how": `🔹 **Dart Quick Start**

**Step 1: Install Dart**
\`\`\`bash
# Download from dart.dev
# Or install with Flutter (includes Dart)
dart --version  # Verify installation
\`\`\`

**Step 2: Create a simple program**
\`\`\`bash
dart create my_first_app
cd my_first_app
dart run
\`\`\`

**Step 3: Basic Dart syntax (main.dart)**
\`\`\`dart
void main() {
  print('Hello, Dart!');
  
  // Variables
  String name = 'Alice';
  int age = 25;
  double height = 5.8;
  bool isStudent = true;
  
  print('Name: $name, Age: $age');
}
\`\`\`

**Step 4: Functions**
\`\`\`dart
int add(int a, int b) {
  return a + b;
}

void greet(String name) {
  print('Hello, $name!');
}

main() {
  print(add(5, 3));      // 8
  greet('Bob');           // Hello, Bob!
}
\`\`\`

**Step 5: Classes & OOP**
\`\`\`dart
class Person {
  String name;
  int age;
  
  Person(this.name, this.age);
  
  void introduce() {
    print('Hi, I\\'m $name and I\\'m $age years old');
  }
}

main() {
  Person p = Person('Alice', 30);
  p.introduce();
}
\`\`\`

**🔹 Popular Dart packages**
• http - Make API requests
• json_serializable - JSON parsing
• shelf - Web framework
• sqflite - Local database
• provider - State management (with Flutter)`,
        
        "why": `🔹 **Why Learn Dart?**

**Career Opportunities:**
💼 Dart Developer: $90-130k/year
💼 Flutter Developer: $100-150k/year (uses Dart)
💼 Full-stack Dart: $110-160k/year
💼 Mobile Developer: $120-170k/year

**Technical Advantages:**
✓ Perfect foundation for Flutter development
✓ Easy to learn - reads like JavaScript but type-safe
✓ Fast execution - compiled to native code
✓ Great tooling - VS Code integration, hot reload
✓ Growing community - active development
✓ Google-backed - future-proof

**When to use Dart:**
✅ Building Flutter apps (most common)
✅ Backend services
✅ CLI tools
✅ Web apps (with frameworks like Angel)
✅ Cross-platform development

**Why companies love Dart:**
• Reduces development time significantly
• Single language for multiple platforms
• Strong type safety prevents bugs
• Excellent performance
• Active community support

**Companies using Dart:**
• Google (creator)
• Alibaba
• BMW
• eBay
• Many Flutter-based startups`,
        
        "companies": `🏢 **Companies Using Dart**

**Major Tech Companies:**
🔹 **Google** - Creator, uses internally and for products
🔹 **Alibaba** - E-commerce apps and platforms
🔹 **BMW** - Mobile app development
🔹 **eBay** - Mobile commerce applications
🔹 **Tencent** - Chinese tech giant
🔹 **Google Ads** - Mobile ad platform
🔹 **Google Pay** - Payment app
🔹 **Spotify** - Music streaming features
🔹 **Square** - Payment solutions
🔹 **The New York Times** - News app
🔹 **WeChat** - Mini programs
🔹 **Alibaba** - Multiple mobile apps

**Why companies chose Dart:**
✓ Unified codebase across platforms
✓ Strong typing catches bugs early
✓ Hot reload speeds development
✓ Excellent performance
✓ Google backing and support
✓ Growing ecosystem and tooling

**Startup Adoption:**
- 70% of Flutter startups use Dart
- Used exclusively with Flutter
- Growing mobile development preference
- Increasing enterprise adoption

**Salary Impact - Companies Hiring:**
- Dart adds $10-20k to base salary
- Dart Developer: $90-130k/year
- Flutter Developer (Dart): $100-150k/year
- Senior Dart Developer: $140-180k/year
- Full-stack Dart: $120-170k/year

**How to stand out:**
✅ Learn Flutter + Dart together
✅ Master state management patterns
✅ Build cross-platform apps
✅ Understand async programming
✅ Contribute to Dart open source
✅ Get Google Flutter certification`,
        
        "error": `🔹 **Common Dart Errors & Fixes**

**1️⃣ Error: Field '_field' must be initialized**
Cause: Non-nullable field without value
Fix: \`final String name = 'value';\` or use \`late\`
\`\`\`dart
late String name;  // Will be initialized later
\`\`\`

**2️⃣ Type 'int' is not a subtype of type 'String'**
Cause: Assigning wrong type
Fix: Convert to correct type
\`\`\`dart
String age = 25.toString();  // Convert int to String
\`\`\`

**3️⃣ Undefined name 'SomeClass'**
Cause: Forgot to import
Fix: Add import statement
\`\`\`dart
import 'package:myapp/models/person.dart';
\`\`\`

**4️⃣ Future not awaited**
Cause: Async function called without await
Fix: Use await in async function
\`\`\`dart
Future<void> fetchData() async {
  final data = await getData();  // Use await
}
\`\`\`

**5️⃣ NoSuchMethodError**
Cause: Calling non-existent method
Fix: Check class definition and imports

**🔹 Debugging Tips**
✓ Use \`print()\` for debugging
✓ VS Code Dart extension with breakpoints
✓ Use \`dart analyze\` to check code
✓ Check null safety errors carefully
✓ Read error messages for exact location
✓ Use \`dart format\` to fix formatting`
      }
    }

    // Handle questions about specific topics
    if (queryLower.includes("api")) {
      const apiLevel = queryLower.includes("companies") || queryLower.includes("who uses") ? "companies" :
                       queryLower.includes("what") || queryLower.includes("explain") ? "what" :
                       queryLower.includes("how") ? "how" :
                       queryLower.includes("why") ? "why" :
                       queryLower.includes("error") ? "error" : "what";
      return topicExplanations["api"][apiLevel] || topicExplanations["api"]["what"];
    }

    if (queryLower.includes("node") || queryLower.includes("nodejs") || queryLower.includes("node.js")) {
      const nodeLevel = queryLower.includes("companies") || queryLower.includes("who uses") ? "companies" :
                        queryLower.includes("what") || queryLower.includes("explain") ? "what" :
                        queryLower.includes("how") ? "how" :
                        queryLower.includes("why") ? "why" :
                        queryLower.includes("error") ? "error" : "what";
      return topicExplanations["nodejs"][nodeLevel] || topicExplanations["nodejs"]["what"];
    }

    if (queryLower.includes("flask")) {
      const flaskLevel = queryLower.includes("companies") || queryLower.includes("who uses") ? "companies" :
                         queryLower.includes("what") || queryLower.includes("explain") ? "what" :
                         queryLower.includes("how") ? "how" :
                         queryLower.includes("why") ? "why" :
                         queryLower.includes("error") ? "error" : "what";
      return topicExplanations["flask"][flaskLevel] || topicExplanations["flask"]["what"];
    }

    if (queryLower.includes("react")) {
      const reactLevel = queryLower.includes("companies") || queryLower.includes("who uses") ? "companies" :
                         queryLower.includes("what") || queryLower.includes("explain") ? "what" :
                         queryLower.includes("how") ? "how" :
                         queryLower.includes("why") ? "why" :
                         queryLower.includes("error") ? "error" : "what";
      return topicExplanations["react"][reactLevel] || topicExplanations["react"]["what"];
    }

    if (queryLower.includes("flutter")) {
      const flutterLevel = queryLower.includes("companies") || queryLower.includes("who uses") ? "companies" :
                           queryLower.includes("what") || queryLower.includes("explain") ? "what" :
                           queryLower.includes("how") ? "how" :
                           queryLower.includes("why") ? "why" :
                           queryLower.includes("error") ? "error" : "what";
      return topicExplanations["flutter"][flutterLevel] || topicExplanations["flutter"]["what"];
    }

    if (queryLower.includes("dart")) {
      const dartLevel = queryLower.includes("companies") || queryLower.includes("who uses") ? "companies" :
                        queryLower.includes("what") || queryLower.includes("explain") ? "what" :
                        queryLower.includes("how") ? "how" :
                        queryLower.includes("why") ? "why" :
                        queryLower.includes("error") ? "error" : "what";
      return topicExplanations["dart"][dartLevel] || topicExplanations["dart"]["what"];
    }

    // Get topic-specific explanation or use default
    const explanations = topicExplanations[topic.toLowerCase()] || null;
    
    // Detect question type and provide appropriate response
    let response = "";
    
    // Check for company/who-uses questions FIRST
    if (queryLower.includes("companies") || queryLower.includes("who uses") || queryLower.includes("use it")) {
      if (explanations && explanations["companies"]) {
        response = explanations["companies"];
      } else {
        response = `🏢 **Companies Using ${topic}**

**Major Tech Companies:**
${topic} is used by many leading companies worldwide:

✓ Google - Core infrastructure
✓ Amazon - Multiple services
✓ Meta (Facebook) - Essential platform
✓ Microsoft - Wide adoption
✓ Netflix - Production systems
✓ Apple - Key services
✓ Tesla - Modern applications
✓ Uber - Real-time systems
✓ Airbnb - Platform foundation
✓ Spotify - Music streaming backend

**Why companies trust ${topic}:**
• Proven reliability at scale
• Strong performance metrics
• Large community support
• Extensive documentation
• Security and best practices
• Cost-effective scaling

**Career advantage:**
Companies hiring ${topic} experts offer:
- Premium salaries ($120-200k+)
- Remote work opportunities
- Career growth paths
- Stock options
- Competitive benefits

**Your opportunity:**
Learning ${topic} connects you to Fortune 500 companies and thousands of startups that need these skills!`;
      }
    } else if (queryLower.includes("what") || queryLower.includes("explain") || queryLower.includes("definition")) {
      if (explanations) {
        response = explanations["what"];
      } else {
        response = `**What is ${topic}?**

${topic} is an important concept in computing and programming. Let me break it down:

• **Basic definition** - ${topic} is a key technology/concept used in modern development
• **Core purpose** - It solves specific problems in software development
• **Industry use** - Many companies use ${topic} in production
• **Learning path** - Master the fundamentals first before advanced concepts

**Key characteristics:**
1. It's widely used in industry
2. It has a learning curve but is learnable
3. It's essential for modern development
4. Professionals are in high demand

Would you like me to explain specific aspects like:
- How it works practically
- Why it's important in your career
- Common mistakes when learning
- Real-world examples`;
      }
    } else if (queryLower.includes("how") || queryLower.includes("step") || queryLower.includes("implement")) {
      if (explanations) {
        response = explanations["how"];
      } else {
        response = `**How to use ${topic}:**

Here's a practical step-by-step guide:

**Step 1: Understand the basics**
- Read official documentation
- Watch tutorial videos
- Follow beginner guides

**Step 2: Set up your environment**
- Install necessary tools
- Configure settings
- Test basic functionality

**Step 3: Build a simple project**
- Start with something small
- Follow a tutorial
- Don't worry about perfection

**Step 4: Practice and expand**
- Build slightly complex projects
- Integrate with other tools
- Read real-world code examples

**Step 5: Deep dive**
- Learn advanced features
- Optimize performance
- Follow best practices

**Pro tip:** Most people learn by doing, not just reading. Start coding immediately!`;
      }
    } else if (queryLower.includes("why") || queryLower.includes("important") || queryLower.includes("purpose")) {
      if (explanations) {
        response = explanations["why"];
      } else {
        response = `**Why is ${topic} important?**

Here's why you should learn ${topic}:

**Career opportunities:**
- High demand in job market
- Competitive salary (varies by specialization)
- Growth potential and advancement

**Technical benefits:**
- Solves real-world problems
- Used by major tech companies
- Essential for modern applications
- Improves code quality and efficiency

**Learning investment:**
- Time investment: Moderate to High
- Difficulty: Medium
- Job prospects: Excellent
- Salary growth: Strong

**Real-world impact:**
- Used in production by Netflix, Google, Amazon, etc.
- Critical for building scalable applications
- Opens doors to specialized roles
- Foundation for advanced technologies`;
      }
    } else if (queryLower.includes("error") || queryLower.includes("problem") || queryLower.includes("wrong") || queryLower.includes("debug")) {
      if (explanations) {
        response = explanations["error"];
      } else {
        response = `**Debugging ${topic}:**

Here's my troubleshooting approach:

**Step 1: Identify the problem**
- What exactly is going wrong?
- When does it happen?
- Is it consistent or intermittent?

**Step 2: Read the error message**
- Error messages are helpful (usually!)
- Look at the line number
- Search for the error online

**Step 3: Isolate the issue**
- Comment out code to narrow it down
- Use console.log() or print statements
- Use debugger tools (DevTools, IDE)

**Step 4: Check common causes**
- Typos in variable names
- Wrong data types
- Missing async/await
- Incorrect syntax

**Step 5: Search for solutions**
- Stack Overflow
- Official documentation
- GitHub issues
- Community forums

**Still stuck? Try:**
- Take a break and return fresh
- Explain problem to someone else
- Review similar working examples
- Ask on Stack Overflow`;
      }
    } else if (queryLower.includes("example") || queryLower.includes("real world")) {
      response = `**Real-world examples of ${topic}:**

Here are practical uses of ${topic}:

**In popular companies:**
- Netflix uses it for content delivery and recommendations
- Google relies on it for search and services
- Amazon uses it for e-commerce operations
- Facebook/Meta uses it for social features
- Spotify uses it for music streaming

**In everyday life:**
- When you check weather - APIs get live data
- When you share on social media - using their APIs
- When you pay online - payment APIs process transactions
- When you use maps - location APIs provide directions

**Business impact:**
- Reduces development time
- Improves user experience
- Enables new features
- Increases scalability

Try to think of apps you use daily - most of them use ${topic} in some way!`;
    } else if (queryLower === "hello" || queryLower === "hi" || queryLower === "help") {
      response = `👋 **Hey there! I'm your AI Mentor!**

I'm here to help you master computing concepts in an easy, fun way. Here's what I can help with:

**Ask me about specific topics:**
🔹 "What is [Flask/React/API/MongoDB/Python]?"
🔹 "How do I use [topic]?" - Step-by-step guides
🔹 "Why learn [topic]?" - Career insights & real-world usage
🔹 "I got an error with [topic]" - Debugging help

**Topics I know well:**
✓ Flask, Django, Node.js, Express
✓ React, Vue, Angular
✓ MongoDB, SQL, Databases
✓ APIs & REST
✓ Python, JavaScript
✓ And much more!

**Current lesson:** ${topic}

Just ask me anything about your course material! I'll explain it in a simple, understandable way. 🚀`;
    } else {
      // Universal response - ChatGPT style
      response = `🤔 **Great question about "${query}"!**

Here's what I think:

**Even if this isn't today's lesson**, understanding related topics is super helpful for your growth!

**Here's my approach:**
1. **Connect the dots** - See how this relates to ${topic}
2. **Build strong foundations** - Fundamental concepts help everywhere
3. **Practical learning** - Try to use this knowledge in a project

**Want me to dive deeper?**
Try asking:
• "What is [concept]?" - I'll explain clearly
• "How do I use [concept]?" - Step-by-step walkthrough
• "Why is [concept] important?" - Real-world relevance
• "Show me examples" - Real-world applications

**Your weak area:**
Focus on strengthening fundamentals first, then move to advanced concepts. That's the fastest path to mastery! 💡

*Feel free to ask me anything - I'm here to help you succeed!* ✨`;
    }
    
    return response;
  },

  async generateFinalAssessment(profile: UserProfile, skillLevel: SkillLevel): Promise<FinalAssessmentQuestion[]> {
    // Mock final assessment questions
    const finalQuestions: FinalAssessmentQuestion[] = [
      {
        id: "final1",
        question: `Describe the key concepts of ${profile.role} and how they apply in production.`,
        options: [
          "Theoretical knowledge only",
          "Practical application with real-world scenarios",
          "Advanced algorithms",
          "Historical context"
        ],
        correctAnswer: 1,
        explanation: "Production applications require understanding practical implementations, not just theory."
      },
      {
        id: "final2",
        question: "What is the most important aspect of writing maintainable code?",
        options: [
          "Code length",
          "Clarity and documentation",
          "Number of features",
          "Execution speed alone"
        ],
        correctAnswer: 1,
        explanation: "Clear, well-documented code is easier to maintain and debug over time."
      },
      {
        id: "final3",
        question: "How do you approach debugging a complex issue?",
        options: [
          "Random changes",
          "Systematic analysis and testing",
          "Copy solutions from online",
          "Restart everything"
        ],
        correctAnswer: 1,
        explanation: "Systematic debugging with clear testing leads to finding and fixing root causes."
      },
      {
        id: "final4",
        question: "What is essential for professional development?",
        options: [
          "Stopping at basic knowledge",
          "Continuous learning and adaptation",
          "Avoiding new technologies",
          "Working in isolation"
        ],
        correctAnswer: 1,
        explanation: "The tech field evolves constantly, requiring continuous learning and adaptation."
      },
      {
        id: "final5",
        question: "How should you handle project requirements?",
        options: [
          "Ignore edge cases",
          "Understand requirements, ask questions, communicate",
          "Code first, clarify later",
          "Assume you know everything"
        ],
        correctAnswer: 1,
        explanation: "Clear communication and understanding requirements prevents costly mistakes."
      },
      {
        id: "final6",
        question: "What role do tests play in development?",
        options: [
          "Unnecessary overhead",
          "Ensure code quality and prevent regressions",
          "Only for large projects",
          "Marketing tool"
        ],
        correctAnswer: 1,
        explanation: "Tests provide confidence that code works correctly and prevent introducing bugs."
      },
      {
        id: "final7",
        question: "How do you stay current with best practices?",
        options: [
          "Stop learning after course",
          "Read blogs, contribute to open source, experiment",
          "Follow only one resource",
          "Never review past work"
        ],
        correctAnswer: 1,
        explanation: "Active engagement through reading, coding, and community involvement keeps skills sharp."
      },
      {
        id: "final8",
        question: "What is your approach to code review feedback?",
        options: [
          "Defensive and dismissive",
          "Constructive learning opportunity",
          "Ignore feedback",
          "Argue with reviewers"
        ],
        correctAnswer: 1,
        explanation: "Code reviews help improve skills and code quality through constructive feedback."
      },
      {
        id: "final9",
        question: "How do you handle technical debt?",
        options: [
          "Ignore it forever",
          "Address it proactively to maintain code quality",
          "Only address emergencies",
          "Blame previous developers"
        ],
        correctAnswer: 1,
        explanation: "Managing technical debt prevents it from accumulating and slowing development."
      },
      {
        id: "final10",
        question: "What defines a successful professional in ${profile.role}?",
        options: [
          "Only knowing one technology",
          "Problem-solving, collaboration, and continuous growth",
          "Working without help",
          "Speed over quality"
        ],
        correctAnswer: 1,
        explanation: "Success comes from a combination of technical skills, collaboration, and adaptability."
      }
    ];
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return finalQuestions;
  },

  async evaluateFinalAssessment(
    profile: UserProfile, 
    answers: { questionId: string; answerIndex: number; correct: boolean }[],
    skillLevel: SkillLevel
  ): Promise<{ result: FinalAssessmentResult; certificate: Certificate | null }> {
    const score = answers.filter(a => a.correct).length;
    const maxScore = answers.length;
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70; // 70% pass score

    const certificate = passed ? {
      id: `cert-${Date.now()}`,
      userId: profile.id,
      userName: profile.email.split('@')[0],
      userEmail: profile.email,
      courseName: `${profile.role} Professional Course`,
      skillLevel: skillLevel,
      finalScore: score,
      percentage: percentage,
      completionDate: new Date().toISOString().split('T')[0],
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      issueDate: new Date().toISOString().split('T')[0]
    } : null;

    const result: FinalAssessmentResult = {
      score,
      maxScore,
      percentage,
      passed,
      attemptNumber: 1,
      feedback: passed 
        ? `Congratulations! You passed with ${percentage}%. You have successfully completed the course!`
        : `You scored ${percentage}%. A minimum of 70% is required to pass. Please review the material and try again.`,
      completedAt: new Date().toISOString()
    };

    return { result, certificate };
  }
};
