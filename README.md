# Task Line 📝

Task Line is a beautifully designed, full-stack task management application that helps you stay productive and organized. Built with a focus on premium aesthetics and responsive design, it features a stunning glassmorphism UI, robust authentication, and real-time task tracking. 

## ✨ Key Features

- **Premium UI/UX:** Stunning glassmorphism design with seamless Light and Dark mode transitions.
- **Secure Authentication:** Integrated with Firebase Auth for reliable user sign-up and login.
- **Robust State Management:** Uses React Context API for lightweight, efficient global state handling.
- **Smart Task Management:** 
  - Add, Edit, Complete, and Star (important) tasks.
  - Set specific dates (Today, Tomorrow) to plan your schedule.
  - Soft-delete functionality with a dedicated Trash view for restoring or permanently deleting tasks.
- **Advanced Filtering & Search:** Instantly filter tasks by All, Today, Important, Planned, or Completed. Includes a fast, inline search bar to find tasks quickly.
- **Profile Customization:** Upload custom avatars, edit profile details, and easily switch themes.
- **Fully Responsive:** Carefully crafted layouts that look amazing and feel intuitive on both large desktop screens and compact mobile devices.

## 🛠️ Technology Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Context API
- **Backend/API:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase Auth
- **HTTP Client:** Axios

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyanPrt43/task-line.git
   cd task-line
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your Firebase and Backend API configurations:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # Add your backend server URL
   VITE_API_URL=http://localhost:5001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   *Your app should now be running on `http://localhost:5173`.*

## 🔮 Future Scopes & Improvements

Task Line is actively being improved. Here is what is on the roadmap for upcoming releases:

- **🔔 Reminders & Notifications (Coming Soon!):** Implementation of push notifications, email alerts, and in-app reminders to notify users of upcoming and overdue tasks.
- **🤝 Collaboration:** Ability to share task lists with other users and assign tasks to teammates.
- **📊 Analytics Dashboard:** A visual breakdown of productivity trends, completed tasks over time, and time spent on tasks.
- **🌐 Offline Support (PWA):** Enhanced Progressive Web App support to allow users to manage tasks even without an internet connection, syncing automatically when back online.
- **🎨 Custom Categories/Tags:** Allow users to create custom color-coded tags to organize tasks beyond the default categories.

## 👨‍💻 About the Developer

Developed with ❤️ by **Ayan Pratap**. 
Passionate about building scalable web applications with premium user experiences.

- **LinkedIn:** [linkedin.com/in/ayan-pratap](https://www.linkedin.com/in/ayan-pratap)
- **GitHub:** [github.com/AyanPrt43](https://github.com/AyanPrt43)
- **Instagram:** [@_ayan_pratap_](https://www.instagram.com/_ayan_pratap_)

---

*This project was built to demonstrate proficiency in modern React, Tailwind CSS, API integration, and full-stack architecture. Perfect for recruiters looking for clean code, solid logic, and excellent UI sensibilities.*
