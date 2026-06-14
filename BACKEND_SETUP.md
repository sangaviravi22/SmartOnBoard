# SmartOnboard AI - Backend Setup Guide

## Prerequisites

- Node.js 16+ installed
- MySQL 8.0+ server running locally or remotely
- npm package manager

## Database Setup

### 1. Create MySQL Database

Open MySQL terminal or MySQL Workbench and run:

```sql
CREATE DATABASE smartonboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Create Database User (Optional but Recommended)

```sql
CREATE USER 'smartonboard'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON smartonboard.* TO 'smartonboard'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root (or your_user)
DB_PASSWORD=your_password
DB_NAME=smartonboard
NODE_ENV=development
PORT=3000
```

## Installation & Running

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The server will:

- Connect to MySQL
- Automatically create all database tables
- Start on http://localhost:3000

### 3. Build for Production

```bash
npm run build
npm start
```

## Database Schema

The server automatically creates these tables:

### `users`

- User accounts and profiles
- Settings (language, dark mode, notifications)
- Onboarding status

### `learning_plans`

- Course plans assigned to users
- Target skill and current progress

### `learning_days`

- Individual learning modules
- Quiz data and completion status
- Time tracking

### `project_submissions`

- Student project submissions
- AI review status and feedback

### `user_activities`

- Activity log of all user actions
- Used for analytics and tracking

### `certificates`

- Earned certificates
- Course completion records

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login/signup

### User Management

- `GET /api/user/:userId` - Get user profile
- `PUT /api/user/:userId/settings` - Update user settings

### Learning

- `POST /api/learning-plan` - Create learning plan
- `GET /api/learning-plan/:userId` - Get user's learning plan
- `PUT /api/learning-day/:dayId` - Update day completion/quiz

### Projects

- `POST /api/project-submission` - Submit project
- `GET /api/project-submissions/:userId` - Get user submissions

### Certificates

- `POST /api/certificate` - Award certificate

### Activities

- `GET /api/activities/:userId` - Get activity log

### Support

- `POST /api/support/contact` - Submit support request

### Health

- `GET /api/health` - Check server status

## Features

✅ **Complete Data Persistence** - All user actions stored in MySQL
✅ **Activity Logging** - Every step tracked in user_activities table
✅ **Real-time Sync** - Frontend syncs with backend automatically
✅ **Multi-user Support** - Multiple users can use the platform
✅ **Analytics Ready** - All data available for reporting and analytics

## Troubleshooting

### "Cannot connect to database"

- Ensure MySQL server is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Verify database exists with: `SHOW DATABASES;`

### "Table already exists"

- This is normal on restart - server skips creation if tables exist
- To reset: `DROP DATABASE smartonboard;` then restart

### Port 3000 already in use

- Change PORT in .env to another port
- Or kill process: `lsof -i :3000` then `kill -9 <PID>`

## Production Deployment

1. Use a managed MySQL service (AWS RDS, DigitalOcean, etc.)
2. Set `NODE_ENV=production`
3. Use environment variables for sensitive data
4. Enable SSL/TLS for database connections
5. Set up regular database backups
6. Configure connection pooling for high traffic

## Example Integration in Frontend

```typescript
import { apiService } from "./services/apiService";

// Login
const user = await apiService.login("user@example.com");

// Update learning progress
await apiService.updateLearningDay(dayId, userId, true, 95);

// Submit project
await apiService.submitProject(userId, planId, projectId, title, content);

// Get activities
const activities = await apiService.getActivities(userId);
```

## Support

For issues or questions:

1. Check database logs
2. Verify MySQL connection
3. Check server console for errors
4. Review `.env` configuration
