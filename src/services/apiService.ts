// API Service for backend communication
const API_URL = "http://localhost:3001/api";

export const apiService = {
  // ============ AUTH ============
  async login(email: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },

  // ============ USER ============
  async getUser(userId: string) {
    const response = await fetch(`${API_URL}/user/${userId}`);
    return response.json();
  },

  async updateUserSettings(userId: string, settings: any) {
    const response = await fetch(`${API_URL}/user/${userId}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    return response.json();
  },

  // ============ LEARNING PLAN ============
  async createLearningPlan(userId: string, title: string, targetSkill: string, days: any[]) {
    const response = await fetch(`${API_URL}/learning-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title, targetSkill, days }),
    });
    return response.json();
  },

  async getLearningPlan(userId: string) {
    const response = await fetch(`${API_URL}/learning-plan/${userId}`);
    if (!response.ok) {
      throw new Error("No learning plan found");
    }
    return response.json();
  },

  // ============ LEARNING DAY ============
  async updateLearningDay(dayId: string, userId: string, completed: boolean, quizScore: number, locked?: boolean) {
    const response = await fetch(`${API_URL}/learning-day/${dayId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, completed, quizScore, locked }),
    });
    return response.json();
  },

  // ============ PROJECT SUBMISSION ============
  async submitProject(userId: string, planId: string, projectId: number, projectTitle: string, submissionContent: string) {
    const response = await fetch(`${API_URL}/project-submission`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, planId, projectId, projectTitle, submissionContent }),
    });
    return response.json();
  },

  async getProjectSubmissions(userId: string) {
    const response = await fetch(`${API_URL}/project-submissions/${userId}`);
    return response.json();
  },

  // ============ CERTIFICATE ============
  async createCertificate(userId: string, userName: string, userEmail: string, courseName: string, skillLevel: string, finalScore: number, percentage: number) {
    const response = await fetch(`${API_URL}/certificate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, userName, userEmail, courseName, skillLevel, finalScore, percentage }),
    });
    return response.json();
  },

  // ============ ACTIVITIES ============
  async getActivities(userId: string, limit?: number) {
    const url = new URL(`${API_URL}/activities/${userId}`);
    if (limit) url.searchParams.append("limit", limit.toString());
    const response = await fetch(url.toString());
    return response.json();
  },

  // ============ SUPPORT ============
  async submitSupportContact(userId: string, subject: string, message: string) {
    const response = await fetch(`${API_URL}/support/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subject, message }),
    });
    return response.json();
  },

  // ============ HEALTH CHECK ============
  async health() {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
  },
};
