<div align="center">

# ✅ Task Manager Web App  

🚀 **A modern, fast & beautiful task management application**  
Built with **React · Vite · Firebase · Framer Motion**

✨ _Secure · Animated · Responsive · Production-Ready_

---

<!-- BADGES (optional)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-Fast-yellow?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20DB-orange?logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-success) -->

</div>

---

## 🌐 Live Demo

🔗 **Live Website:* https://your-karma-manager.netlify.app/*
🎥 **Demo Preview:**
![Preview Image](<ChatGPT Image Dec 26, 2025, 12_33_33 PM.png>)


✨ Features

🔐 Authentication

Email & Password login using Firebase Authentication

Secure, user-based access

📝 Task Management

Create, edit & delete tasks

User-specific task isolation

Real-time updates

🌗 Theme Support

Light / Dark mode toggle

Global theme state via React Context

🎬 Smooth Animations

Beautiful transitions using Framer Motion

⚡ Performance

Lightning-fast builds with Vite

Optimized production output

📱 Responsive Design

Fully mobile-friendly UI

🧹 Code Quality

ESLint enforced

Clean folder structure

🛠️ Tech Stack
⚙️ Technology	🔍 Purpose
⚛️ React ^19	Frontend UI
⚡ Vite	Development & Build
🔥 Firebase	Auth & Database
🎞️ Framer Motion	Animations
🧹 ESLint	Code Quality
📂 Project Structure
src/
 ├─ components/
 │   ├─ Auth.jsx            # 🔐 Authentication UI
 │   └─ TaskManager.jsx     # 📝 Task CRUD logic
 ├─ context/
 │   └─ ThemeContext.jsx    # 🌗 Theme Provider
 ├─ assets/
 ├─ App.jsx
 └─ main.jsx

firebase.js                   # 🔥 Firebase configuration
netlify.toml                  # 🚀 Netlify deploy config
package.json                  # 📦 Scripts & dependencies

⚙️ Installation & Setup
📌 Prerequisites

✔️ Node.js v18+
✔️ npm or yarn

📥 Clone Repository
git clone <your-repo-url>
cd daily-task-manager

📦 Install Dependencies
npm install
# or
yarn install

🔐 Environment Variables

Create a .env file in the root directory:

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id


⚠️ Security Note:
Firebase config is safe for frontend usage, but Firestore rules must restrict access to authenticated users only.

▶️ Running the Project

🚀 Start Development Server

npm run dev


🌍 App runs at:

http://localhost:5173


📦 Build for Production

npm run build


👀 Preview Production Build

npm run preview


🧹 Run ESLint

npm run lint

🚀 Deployment
🌍 Netlify (Recommended)

1️⃣ Push project to GitHub
2️⃣ Import repository in Netlify
3️⃣ Add environment variables
4️⃣ Set:

Build Command: npm run build

Publish Directory: dist

🎉 Deploy!

🔥 Firebase Hosting (Optional)
firebase init
firebase deploy

🛣️ Roadmap

🚧 Upcoming Features:

⏰ Task deadlines & reminders

📂 Categories & tags

🧲 Drag-and-drop task ordering

🔔 Notifications

🧪 Unit & integration tests

🤝 Contributing

💡 Contributions are welcome!

1️⃣ Fork the repository
2️⃣ Create a feature branch
3️⃣ Run npm run lint
4️⃣ Open a pull request

📄 License

📜 This project is licensed under the MIT License.

<div align="center">
💙 Built with passion using React & Firebase

⭐ If you like this project, give it a star! ⭐

</div> ```