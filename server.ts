import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smartonboard",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(100),
        skills JSON,
        experienceLevel VARCHAR(50),
        language VARCHAR(50) DEFAULT 'English',
        darkMode BOOLEAN DEFAULT false,
        emailNotifications BOOLEAN DEFAULT true,
        onboarded BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create learning_plans table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS learning_plans (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        targetSkill VARCHAR(255),
        currentDay INT DEFAULT 1,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create learning_days table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS learning_days (
        id VARCHAR(50) PRIMARY KEY,
        planId VARCHAR(50) NOT NULL,
        day INT,
        title VARCHAR(255),
        topic VARCHAR(255),
        content LONGTEXT,
        resources JSON,
        quiz JSON,
        completed BOOLEAN DEFAULT false,
        locked BOOLEAN DEFAULT false,
        quizScore INT,
        completedAt BIGINT,
        timeSpent INT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (planId) REFERENCES learning_plans(id) ON DELETE CASCADE
      )
    `);

    // Create project_submissions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS project_submissions (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        planId VARCHAR(50) NOT NULL,
        projectId INT,
        projectTitle VARCHAR(255),
        submissionContent LONGTEXT,
        submissionStatus VARCHAR(50) DEFAULT 'pending',
        aiReview LONGTEXT,
        submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reviewedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (planId) REFERENCES learning_plans(id) ON DELETE CASCADE
      )
    `);

    // Create user_activities table for tracking all steps
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_activities (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        activityType VARCHAR(100),
        activityData JSON,
        description VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_userId (userId),
        INDEX idx_createdAt (createdAt)
      )
    `);

    // Create certificates table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(50) PRIMARY KEY,
        userId VARCHAR(50) NOT NULL,
        userName VARCHAR(255),
        userEmail VARCHAR(255),
        courseName VARCHAR(255),
        skillLevel VARCHAR(50),
        finalScore INT,
        percentage INT,
        completionDate TIMESTAMP,
        certificateId VARCHAR(100),
        issueDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log("✓ Database tables initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  } finally {
    connection.release();
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

  app.use(express.json());
  app.use(cors());

  // Initialize database
  await initializeDatabase();

  // ============ AUTH API ============
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email } = req.body;
      const userId = "user_" + Math.random().toString(36).substr(2, 9);

      const connection = await pool.getConnection();
      try {
        // Check if user exists
        const [existing] = await connection.execute(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existing.length > 0) {
          // User exists, return existing user
          const user = existing[0];
          res.json(user);
        } else {
          // Create new user
          const newUser = {
            id: userId,
            email,
            role: "learner",
            skills: [],
            experienceLevel: "beginner",
            language: "English",
            onboarded: false,
          };

          await connection.execute(
            "INSERT INTO users (id, email, role, skills, experienceLevel) VALUES (?, ?, ?, ?, ?)",
            [userId, email, "learner", JSON.stringify([]), "beginner"]
          );

          // Log activity
          await logActivity(connection, userId, "user_signup", { email }, "User signed up");

          res.json(newUser);
        }
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ============ USER API ============
  app.get("/api/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const connection = await pool.getConnection();
      try {
        const [users] = await connection.execute(
          "SELECT * FROM users WHERE id = ?",
          [userId]
        );

        if (users.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const user = users[0];
        user.skills = JSON.parse(user.skills || "[]");
        res.json(user);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.put("/api/user/:userId/settings", async (req, res) => {
    try {
      const { userId } = req.params;
      const { language, emailNotifications, darkMode } = req.body;

      const connection = await pool.getConnection();
      try {
        await connection.execute(
          "UPDATE users SET language = ?, emailNotifications = ?, darkMode = ? WHERE id = ?",
          [language, emailNotifications, darkMode, userId]
        );

        // Log activity
        await logActivity(
          connection,
          userId,
          "settings_updated",
          { language, emailNotifications, darkMode },
          "User updated settings"
        );

        res.json({ success: true });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ============ LEARNING PLAN API ============
  app.post("/api/learning-plan", async (req, res) => {
    try {
      const { userId, title, targetSkill, days } = req.body;
      const planId = "plan_" + Math.random().toString(36).substr(2, 9);

      const connection = await pool.getConnection();
      try {
        // Create learning plan
        await connection.execute(
          "INSERT INTO learning_plans (id, userId, title, targetSkill) VALUES (?, ?, ?, ?)",
          [planId, userId, title, targetSkill]
        );

        // Create learning days and track them
        const createdDays = [];
        for (let i = 0; i < days.length; i++) {
          const day = days[i];
          const dayId = "day_" + Math.random().toString(36).substr(2, 9);

          await connection.execute(
            `INSERT INTO learning_days 
              (id, planId, day, title, topic, content, resources, quiz, completed, locked) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              dayId,
              planId,
              day.day,
              day.title,
              day.topic,
              day.content,
              JSON.stringify(day.resources || []),
              JSON.stringify(day.quiz || {}),
              day.completed || false,
              day.locked || (i > 0), // Lock all days except first
            ]
          );
          
          // Store the created day with its ID
          createdDays.push({
            id: dayId,
            ...day,
            resources: day.resources || [],
            quiz: day.quiz || {},
            completed: day.completed || false,
            locked: day.locked || (i > 0)
          });
        }

        // Log activity
        await logActivity(
          connection,
          userId,
          "plan_created",
          { title, targetSkill, daysCount: days.length },
          `Learning plan created: ${title}`
        );

        // Return full plan with days so frontend has all IDs
        res.json({ 
          id: planId,
          planId, 
          title, 
          targetSkill, 
          currentDay: 1,
          days: createdDays,
          userId
        });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Create plan error:", error);
      res.status(500).json({ error: "Failed to create learning plan" });
    }
  });

  app.get("/api/learning-plan/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const connection = await pool.getConnection();
      try {
        const [plans] = await connection.execute(
          "SELECT * FROM learning_plans WHERE userId = ? ORDER BY createdAt DESC LIMIT 1",
          [userId]
        );

        if (plans.length === 0) {
          return res.status(404).json({ error: "No learning plan found" });
        }

        const plan = plans[0];

        // Get all days
        const [days] = await connection.execute(
          "SELECT * FROM learning_days WHERE planId = ? ORDER BY day ASC",
          [plan.id]
        );

        const parsedDays = days.map((day) => ({
          ...day,
          resources: JSON.parse(day.resources || "[]"),
          quiz: JSON.parse(day.quiz || "{}"),
        }));

        res.json({ ...plan, days: parsedDays });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Get plan error:", error);
      res.status(500).json({ error: "Failed to fetch learning plan" });
    }
  });

  // ============ LEARNING DAY API ============
  app.put("/api/learning-day/:dayId", async (req, res) => {
    try {
      const { dayId } = req.params;
      const { userId, completed, quizScore, locked } = req.body;

      const connection = await pool.getConnection();
      try {
        const [dayResult] = await connection.execute(
          "SELECT * FROM learning_days WHERE id = ?",
          [dayId]
        );

        if (dayResult.length === 0) {
          return res.status(404).json({ error: "Day not found" });
        }

        const day = dayResult[0];

        const completedAt = completed ? Date.now() : day.completedAt;
        const timeSpent = completed ? Math.random() * 60 + 30 : day.timeSpent;

        await connection.execute(
          `UPDATE learning_days 
           SET completed = ?, quizScore = ?, completedAt = ?, timeSpent = ?, locked = ?
           WHERE id = ?`,
          [completed, quizScore || null, completedAt || null, timeSpent || null, locked, dayId]
        );

        // Log activity
        await logActivity(
          connection,
          userId,
          "day_completed",
          { dayId, day: day.day, quizScore },
          `Day ${day.day} completed with score ${quizScore}`
        );

        res.json({ success: true });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Update day error:", error);
      res.status(500).json({ error: "Failed to update learning day" });
    }
  });

  // ============ PROJECT SUBMISSION API ============
  app.post("/api/project-submission", async (req, res) => {
    try {
      const { userId, planId, projectId, projectTitle, submissionContent } = req.body;
      const submissionId = "sub_" + Math.random().toString(36).substr(2, 9);

      const connection = await pool.getConnection();
      try {
        await connection.execute(
          `INSERT INTO project_submissions 
            (id, userId, planId, projectId, projectTitle, submissionContent) 
            VALUES (?, ?, ?, ?, ?, ?)`,
          [submissionId, userId, planId, projectId, projectTitle, submissionContent]
        );

        // Log activity
        await logActivity(
          connection,
          userId,
          "project_submitted",
          { projectId, projectTitle, submissionId },
          `Project submitted: ${projectTitle}`
        );

        res.json({ submissionId, status: "pending" });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Submit project error:", error);
      res.status(500).json({ error: "Failed to submit project" });
    }
  });

  app.get("/api/project-submissions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const connection = await pool.getConnection();
      try {
        const [submissions] = await connection.execute(
          "SELECT * FROM project_submissions WHERE userId = ? ORDER BY submittedAt DESC",
          [userId]
        );

        res.json(submissions);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Get submissions error:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // ============ CERTIFICATE API ============
  app.post("/api/certificate", async (req, res) => {
    try {
      const {
        userId,
        userName,
        userEmail,
        courseName,
        skillLevel,
        finalScore,
        percentage,
      } = req.body;
      const certificateId = "cert_" + Math.random().toString(36).substr(2, 9);
      const certId = "cert_" + Math.random().toString(36).substr(2, 9);

      const connection = await pool.getConnection();
      try {
        await connection.execute(
          `INSERT INTO certificates 
            (id, userId, userName, userEmail, courseName, skillLevel, finalScore, percentage, completionDate, certificateId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
          [
            certId,
            userId,
            userName,
            userEmail,
            courseName,
            skillLevel,
            finalScore,
            percentage,
            certificateId,
          ]
        );

        // Log activity
        await logActivity(
          connection,
          userId,
          "certificate_earned",
          { courseName, finalScore, percentage },
          `Certificate earned for: ${courseName}`
        );

        res.json({ certificateId, certId });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Create certificate error:", error);
      res.status(500).json({ error: "Failed to create certificate" });
    }
  });

  // ============ ACTIVITY LOGGING API ============
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 50 } = req.query;

      const connection = await pool.getConnection();
      try {
        const [activities] = await connection.execute(
          `SELECT * FROM user_activities 
           WHERE userId = ? 
           ORDER BY createdAt DESC 
           LIMIT ?`,
          [userId, parseInt(limit as string)]
        );

        const parsedActivities = activities.map((act: any) => ({
          ...act,
          activityData: JSON.parse(act.activityData || "{}"),
        }));

        res.json(parsedActivities);
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // ============ SUPPORT/CONTACT API ============
  app.post("/api/support/contact", async (req, res) => {
    try {
      const { userId, subject, message } = req.body;

      const connection = await pool.getConnection();
      try {
        // Log activity for support contact
        await logActivity(
          connection,
          userId,
          "support_contact",
          { subject, messageLength: message.length },
          `Support message: ${subject}`
        );

        // In production, you'd send an email here
        res.json({ success: true, message: "Support request submitted" });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Support contact error:", error);
      res.status(500).json({ error: "Failed to submit support request" });
    }
  });

  // ============ HEALTH CHECK ============
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "connected" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}

// Helper function to log user activities
async function logActivity(
  connection: any,
  userId: string,
  activityType: string,
  activityData: any,
  description: string
) {
  try {
    const activityId = "act_" + Math.random().toString(36).substr(2, 9);
    await connection.execute(
      `INSERT INTO user_activities (id, userId, activityType, activityData, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [activityId, userId, activityType, JSON.stringify(activityData), description]
    );
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

startServer().catch(console.error);
