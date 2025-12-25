# Task Manager ✅

A simple, modern task manager web app built with **React**, **Vite**, and **Firebase**. The app demonstrates authentication, task CRUD, theming, and smooth UI animations with **Framer Motion**.

---

## 🚀 Features

- User authentication (Email / Password) using **Firebase Authentication**
- Create, read, update, and delete tasks (client-side / Firebase backend)
- Theme toggling via `ThemeContext` (light/dark)
- Animated UI with **Framer Motion**
- Fast dev experience using **Vite**
- Linting with **ESLint**

---

## 🧩 Tech Stack

- React ^19
- Vite
- Firebase
- Framer Motion
- ESLint

---

## 📁 Project Structure (important files)

```
src/
  ├─ components/
  │   ├─ Auth.jsx            # Authentication UI
  │   └─ TaskManager.jsx     # Main task management UI
  ├─ context/
  │   └─ ThemeContext.jsx    # Theme provider
  ├─ assets/
  ├─ App.jsx
  └─ main.jsx

firebase.js                   # Firebase initialization (uses environment vars)
netlify.toml                  # Netlify deploy configuration
package.json                  # Scripts & dependencies
```

---

## ⚙️ Getting Started

### Requirements

- Node.js 18+ (or compatible)
- npm or yarn

### Install

```bash
# Clone
git clone <repo-url>
cd daily-task-manager

# Install dependencies
npm install
# or
# yarn
```

### Environment

This project expects Firebase credentials to be available. Create a `.env` file at the project root or configure environment variables in your hosting provider (Netlify). Example variables (prefix VITE_ for Vite):

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

The project reads these in `firebase.js` to initialize Firebase. Keep these values secret for production.

### Scripts

- `npm run dev` — Start development server (Vite)
- `npm run build` — Build production bundle
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint

---

## 🧪 Development Notes

- The project uses **React** with functional components and hooks.
- If you add TypeScript, keep `.d.ts` or migrate files step-by-step.
- Keep ESLint passing before committing; run `npm run lint`.

---

## 📦 Deployment

### Netlify

This repo includes a `netlify.toml` file. To deploy:

1. Push to GitHub (or Git provider)
2. Connect the repo in Netlify
3. Set the environment variables in the Netlify dashboard (use the `VITE_` prefixed vars)
4. Set the build command to `npm run build` and publish directory to `dist`

### Firebase (optional)

If you use Firebase Hosting, add the Firebase CLI, run `firebase init` and deploy with `firebase deploy` (replace hosting configuration as needed).

---

## 🤝 Contributing

Contributions are welcome! Please open issues for bugs or feature requests and send pull requests for fixes.

1. Fork the repo
2. Create a branch for your feature/fix
3. Run tests / lint locally
4. Open a PR with a clear description

---

## 📄 License

This project is available under the **MIT License**. See `LICENSE` for details.

---

If you'd like, I can also add a short demo GIF, update `netlify.toml` notes, or add a Contribution file and PR template. 🔧   