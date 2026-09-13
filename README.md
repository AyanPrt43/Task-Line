# Task-Line 📝

> A modern full-stack task management application built to help users organize, prioritize, and manage their daily tasks with a clean, responsive, and intuitive experience.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-API-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🌐 Live Application

**Live Demo:**  
[Add your deployed frontend URL here]

**Backend API:**  
[Add your deployed backend URL here]

**GitHub Repository:**  
https://github.com/AyanPrt43/Task-Line

---

# 📌 About The Project

**Task-Line** is a full-stack task management application designed to provide users with a simple yet powerful way to organize and manage their daily tasks.

The application combines a modern React frontend with a Node.js and Express.js backend. MongoDB is used as the primary database for persistent task and user data, while Firebase Authentication provides secure user authentication.

The application focuses on:

- Clean and modern UI/UX
- Responsive design
- Secure authentication
- RESTful API architecture
- Persistent database storage
- Efficient task management
- User profile customization
- Light and dark theme support

Task-Line is built as a practical full-stack project with a production-oriented architecture and is designed to be extended with advanced productivity features in future releases.

---

# ✨ Key Features

## 🔐 Authentication

Task-Line uses Firebase Authentication to provide a secure authentication experience.

Users can:

- Create an account
- Sign in securely
- Maintain an authenticated session
- Access their personalized task data
- Manage their profile

---

## 📝 Smart Task Management

Users can manage their tasks from a centralized interface.

### Supported operations:

- Add new tasks
- Edit existing tasks
- Complete tasks
- Mark tasks as important
- Delete tasks
- Restore deleted tasks
- Permanently delete tasks
- Set task dates
- Organize tasks according to their status

---

## ⭐ Important Tasks

Users can mark tasks as **Important** using the star functionality.

This makes it easier to prioritize high-value or urgent tasks.

---

## 📅 Task Planning

Task-Line provides date-based task organization.

Users can organize tasks around:

- Today
- Tomorrow
- Planned tasks
- Completed tasks

This makes it easier to plan daily activities and upcoming work.

---

## 🗑️ Trash & Recovery

Task-Line implements a soft-delete workflow.

Instead of immediately removing a task from the database, deleted tasks can be moved to a dedicated **Trash** section.

Users can:

- View deleted tasks
- Restore deleted tasks
- Permanently delete tasks

This provides an additional layer of safety against accidental deletion.

---

## 🔎 Search & Filtering

Users can quickly find and organize tasks using filtering and search functionality.

Available task views include:

- All Tasks
- Today
- Important
- Planned
- Completed
- Trash

The application also provides an inline search functionality for quickly locating tasks.

---

## 👤 Profile Customization

Users can personalize their profile.

Profile functionality includes:

- Profile information management
- Custom avatar/profile image
- Profile settings
- Theme preferences

---

## 🎨 Modern UI/UX

Task-Line uses a modern glassmorphism-inspired visual design.

The interface includes:

- Glassmorphism UI
- Dark theme
- Light theme
- Smooth theme transitions
- Modern task cards
- Clean navigation
- Responsive layouts
- Intuitive interactions

---

## 📱 Fully Responsive

The application is designed to work across different screen sizes.

Supported experiences include:

- Desktop
- Laptop
- Tablet
- Mobile

The layout adapts according to the available screen size while maintaining usability and visual consistency.

---

# 🛠️ Technology Stack

## Frontend

- **React.js** — UI development
- **Vite** — Development server and build tool
- **Tailwind CSS** — Styling and responsive design
- **React Context API** — Global state management
- **Axios** — HTTP requests
- **JavaScript (ES6+)**

## Backend

- **Node.js** — Server-side runtime
- **Express.js** — REST API framework
- **JavaScript (ES Modules)**
- **RESTful API architecture**

## Database

- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling

## Authentication

- **Firebase Authentication**

## Development Tools

- Git
- GitHub
- npm
- VS Code
- Postman

---

# 🏗️ Application Architecture

Task-Line follows a **client-server architecture** where the frontend and backend are maintained as separate layers.

```text
                         ┌──────────────────────┐
                         │         User         │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │                      │
                         │ Components           │
                         │ Context              │
                         │ UI / State           │
                         └──────────┬───────────┘
                                    │
                              Axios / HTTP
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express.js API     │
                         │                      │
                         │ Routes               │
                         │ Middleware           │
                         │ Controllers / Logic  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Mongoose        │
                         │                      │
                         │ Database Operations  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       MongoDB        │
                         │                      │
                         │ Users / Tasks        │
                         └──────────────────────┘


                         ┌──────────────────────┐
                         │ Firebase             │
                         │ Authentication       │
                         └──────────────────────┘
```

---

# 🔄 Application Flow

The complete application request flow can be summarized as:

```text
User
 │
 ▼
React UI
 │
 │ User Action
 │
 ▼
Context / Application Logic
 │
 ▼
Axios HTTP Request
 │
 ▼
Express.js Server
 │
 ▼
API Route
 │
 ▼
Authentication Middleware
 │
 ▼
Controller / Business Logic
 │
 ▼
Mongoose Model
 │
 ▼
MongoDB
 │
 ▼
Database Response
 │
 ▼
Express API Response
 │
 ▼
Axios
 │
 ▼
React State / Context
 │
 ▼
UI Update
```

### Authentication Flow

```text
User
 │
 ▼
Authentication Screen
 │
 ▼
Firebase Authentication
 │
 ├── Sign Up
 ├── Sign In
 └── Authentication State
 │
 ▼
Authenticated User
 │
 ▼
Task-Line Application
```

---

# 📂 Project Structure

The project is organized into separate frontend and backend layers.

```text
Task-Line/
│
├── backend/
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── tasks.js
│   │   └── users.js
│   │
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── components/
│   │   ├── AuthScreen.jsx
│   │   ├── BottomNav.jsx
│   │   ├── Header.jsx
│   │   ├── MainContent.jsx
│   │   ├── NewTasks.jsx
│   │   ├── ProfileSettingsModal.jsx
│   │   └── Sidebar.jsx
│   │
│   ├── context/
│   │   └── Context.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🧩 Backend Architecture

The backend is structured around routes, middleware, models, and server configuration.

```text
backend/
│
├── server.js
│
├── routes/
│   ├── users.js
│   └── tasks.js
│
├── models/
│   ├── User.js
│   └── Task.js
│
└── middleware/
    └── auth.js
```

### Backend Request Flow

```text
Client Request
      │
      ▼
Express Server
      │
      ▼
Route
      │
      ▼
Authentication Middleware
      │
      ▼
Controller / Route Logic
      │
      ▼
Mongoose Model
      │
      ▼
MongoDB
      │
      ▼
JSON Response
```

---

# 🗄️ Database

Task-Line uses **MongoDB** for persistent data storage.

Mongoose is used as the object modeling layer between the Express backend and MongoDB.

The backend contains dedicated models for:

- Users
- Tasks

The task data is associated with authenticated users so that users can manage their own tasks.

---

# 🔑 Environment Variables

Sensitive configuration values are stored in environment variables instead of being hardcoded into the application.

## Frontend `.env`

Create a `.env` file in the project root.

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_API_URL=http://localhost:5001
```

## Backend `.env`

Create a `.env` file inside the `backend` directory.

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173

# Other backend configuration values
# Add the required project-specific variables here
```

> **Security:** Never commit `.env` files, database credentials, API secrets, or private configuration values to GitHub.

---

# 🚀 Getting Started

Follow the steps below to run Task-Line locally.

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- Git installed
- MongoDB database
- Firebase project configured

---

## 1. Clone the Repository

```bash
git clone https://github.com/AyanPrt43/Task-Line.git
```

Move into the project directory:

```bash
cd Task-Line
```

---

## 2. Install Frontend Dependencies

From the project root:

```bash
npm install
```

---

## 3. Configure Frontend Environment Variables

Create a `.env` file in the root directory and add the required Firebase configuration and backend API URL.

Example:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_API_URL=http://localhost:5001
```

---

## 4. Install Backend Dependencies

Navigate into the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 5. Configure Backend Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
```

Add any additional environment variables required by the backend.

---

## 6. Start the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend will start on the configured port.

---

## 7. Start the Frontend

Open another terminal and return to the project root:

```bash
cd Task-Line
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite, typically:

```text
http://localhost:5173
```

---

# 🔌 API Integration

The React frontend communicates with the Express backend through HTTP requests using Axios.

```text
React Frontend
      │
      │ Axios
      ▼
Express REST API
      │
      ▼
MongoDB
```

The API is responsible for operations such as:

- Creating tasks
- Fetching tasks
- Updating tasks
- Completing tasks
- Marking tasks as important
- Deleting tasks
- Restoring tasks
- Managing user-related data

---

# 🧪 API Testing

The backend APIs can be tested using **Postman**.

A typical request lifecycle is:

```text
Postman / React
      │
      ▼
HTTP Request
      │
      ▼
Express Route
      │
      ▼
Authentication Middleware
      │
      ▼
Backend Logic
      │
      ▼
Mongoose
      │
      ▼
MongoDB
      │
      ▼
JSON Response
```

---

# 🏃 Available Scripts

## Frontend

From the project root:

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs ESLint to check the source code.

---

## Backend

From the `backend` directory:

```bash
npm run dev
```

Starts the backend development server.

> Backend scripts may vary depending on the current `backend/package.json` configuration.

---

# ☁️ Deployment

Task-Line uses a separated deployment architecture.

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Deployed Frontend  │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                               HTTPS / API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  Deployed Backend   │
                         │  Node + Express.js  │
                         └──────────┬──────────┘
                                    │
                               Mongoose
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      MongoDB        │
                         │      Database       │
                         └─────────────────────┘

                         ┌─────────────────────┐
                         │ Firebase            │
                         │ Authentication      │
                         └─────────────────────┘
```

## Deployment Configuration

When deploying the frontend, configure the production API URL through the frontend environment variables.

```env
VITE_API_URL=https://your-production-backend-url
```

When deploying the backend, configure:

```env
PORT=your_production_port
MONGO_URI=your_production_mongodb_uri
CORS_ORIGIN=https://your-production-frontend-url
```

> Make sure the production backend allows requests from the deployed frontend through the configured CORS origin.

---

# 🔒 Security & Best Practices

The project follows several important development practices:

- Environment variables are used for sensitive configuration
- `.env` files are excluded from version control
- Database credentials are not hardcoded
- Firebase is used for authentication
- CORS is configured for frontend-backend communication
- Frontend and backend are separated
- Database operations are handled through Mongoose
- Authentication middleware protects backend resources
- REST API architecture keeps client and server responsibilities separated

---

# 📸 Screenshots

Add application screenshots here to showcase the UI.

## Dashboard

```text
Add dashboard screenshot here
```

## Task Management

```text
Add task management screenshot here
```

## Mobile Responsive View

```text
Add mobile screenshot here
```

> Screenshots are recommended because they allow recruiters to quickly understand the application's UI and overall quality without running the project.

---

# 🔮 Future Improvements

Task-Line is designed to evolve into a more complete productivity and collaboration platform.

## 🔔 Reminders & Notifications — Coming Soon!

Implementation of:

- Push notifications
- Email alerts
- In-app reminders
- Upcoming task notifications
- Overdue task notifications

The goal is to notify users before important tasks are due and when tasks become overdue.

---

## 🤝 Collaboration

Future collaboration functionality will allow users to work together on shared task lists.

Planned functionality includes:

- Share task lists with other users
- Assign tasks to teammates
- Track task ownership
- Collaborate on shared tasks
- Manage team-based workflows
- Task assignment notifications

---

## 📊 Analytics Dashboard

A dedicated analytics dashboard will provide users with meaningful productivity insights.

Planned functionality includes:

- Productivity trends
- Completed tasks over time
- Pending vs completed tasks
- Weekly productivity statistics
- Monthly productivity statistics
- Task completion rate
- Time spent on tasks
- Visual charts and graphs

---

## 🌐 Offline Support — PWA

Task-Line will be enhanced with Progressive Web App capabilities.

Planned functionality includes:

- Manage tasks without an internet connection
- Cache application resources
- Create and update tasks offline
- Store changes locally
- Automatically synchronize changes when back online
- Install Task-Line as a Progressive Web App

---

## 🎨 Custom Categories & Tags

Users will be able to create their own task organization system.

Planned functionality includes:

- Create custom categories
- Create custom tags
- Color-coded tags
- Assign multiple tags to tasks
- Filter tasks by category
- Filter tasks by tags
- Search tasks using tags and categories

---

# 🗺️ Project Roadmap

## Completed

- [x] React frontend
- [x] Vite setup
- [x] Tailwind CSS
- [x] Responsive UI
- [x] Firebase Authentication
- [x] User profile functionality
- [x] Task creation
- [x] Task editing
- [x] Task deletion
- [x] Task completion
- [x] Important tasks
- [x] Task planning
- [x] Search
- [x] Task filtering
- [x] Trash functionality
- [x] Task restoration
- [x] MongoDB integration
- [x] Mongoose integration
- [x] Express.js backend
- [x] REST API
- [x] Authentication middleware
- [x] Frontend-backend integration
- [x] Environment configuration
- [x] Git/GitHub integration
- [x] Deployment

## Planned

- [ ] Reminders & Notifications
- [ ] Push Notifications
- [ ] Email Alerts
- [ ] In-App Reminders
- [ ] Collaboration
- [ ] Task Assignment
- [ ] Analytics Dashboard
- [ ] Productivity Charts
- [ ] PWA Support
- [ ] Offline Task Management
- [ ] Automatic Synchronization
- [ ] Custom Categories
- [ ] Custom Tags
- [ ] Advanced Filtering
- [ ] Advanced Search

---

# 🎯 Learning Objectives

This project demonstrates practical experience in full-stack web development.

### Frontend Development

- React component-based architecture
- React Context API
- State management
- API integration
- Responsive UI development
- Tailwind CSS
- Modern UI/UX design
- Firebase integration

### Backend Development

- Node.js
- Express.js
- REST API development
- Route handling
- Middleware
- Authentication middleware
- CORS configuration
- Environment configuration
- Backend architecture

### Database

- MongoDB
- Mongoose
- Database schemas
- CRUD operations
- User-task relationships
- Persistent data storage

### Authentication

- Firebase Authentication
- Authentication state management
- Protected backend resources
- User-specific data handling

### Development Workflow

- Git
- GitHub
- Postman
- Environment variables
- Frontend deployment
- Backend deployment

---

# 💡 Key Takeaways

Building Task-Line provided hands-on experience in designing and developing a complete full-stack application.

The project demonstrates the ability to:

- Build a modern React application
- Design responsive user interfaces
- Develop RESTful APIs
- Connect frontend applications with backend services
- Work with MongoDB and Mongoose
- Integrate Firebase Authentication
- Implement authentication middleware
- Manage application state using Context API
- Handle CRUD operations
- Configure environment variables
- Test APIs using Postman
- Use Git and GitHub
- Deploy frontend and backend applications independently

---

# 👨‍💻 About the Developer

## Ayan Pratap Sonker

**B.Tech — Computer Science & Engineering**

Full-Stack Web Developer interested in building modern, scalable, and user-focused web applications.

Task-Line was developed as a practical full-stack project to demonstrate experience with modern frontend development, backend API development, database integration, authentication, and deployment.

### Connect With Me

- **GitHub:** https://github.com/AyanPrt43
- **LinkedIn:** www.linkedin.com/in/ayan-pratap

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Your support is greatly appreciated!

---

# 📄 License

This project is developed for educational, learning, and portfolio purposes.

---

# 🚀 Future Vision

Task-Line is intended to evolve beyond a basic task manager into a complete productivity platform.

The long-term vision is:

```text
                         TASK-LINE
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
     Task Manager      Collaboration      Analytics
          │                 │                 │
          ▼                 ▼                 ▼
     Reminders         Team Tasks       Productivity
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                            ▼
                     PWA / Offline
                            │
                            ▼
                  Complete Productivity
                        Platform
```

The goal is to make Task-Line a reliable productivity platform that helps individuals and teams plan, organize, prioritize, and complete their work efficiently.