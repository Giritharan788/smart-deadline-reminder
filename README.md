# Deadline Reminder

A Full Stack web application (college mini project) to help students track academic deadlines (assignments, tests, exams). The application provides user authentication, user-specific deadlines, sorting and prioritisation, visual status indicators, and a responsive UI. It is built with React (Vite), styled with Tailwind CSS, uses Firebase for authentication and Firestore for data persistence, and is deployed using Firebase Hosting.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Folder Structure & File Roles](#folder-structure--file-roles)
- [Component & File Descriptions](#component--file-descriptions)
- [Key Concepts Explained](#key-concepts-explained)
- [Installation & Setup](#installation--setup)
- [Run Locally](#run-locally)
- [Build & Deploy to Firebase Hosting](#build--deploy-to-firebase-hosting)
- [Usage & Manual Test Cases](#usage--manual-test-cases)
- [Screenshots (Placeholders)](#screenshots-placeholders)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting & Notes](#troubleshooting--notes)
- [Conclusion](#conclusion)
- [Acknowledgements & License](#acknowledgements--license)

---

## Project Overview

This project addresses the common problem of missed academic deadlines by providing a simple web application where students can add, edit, delete, and mark deadlines as completed. Deadlines are stored in Firestore and scoped to the authenticated user, ensuring privacy and user-specific views. The UI sorts deadlines by nearest due date and uses priority ordering when dates are identical.

## Problem Statement

Students often forget academic deadlines such as assignments, tests, and exams. This application helps students track deadlines, prioritise tasks, and stay organized through an easy-to-use interface and reliable backend storage.

## Key Features

1. User authentication (Signup, Login, Logout)
2. User-specific deadlines (each user sees only their own data)
3. Add deadline with:
   - Title
   - Description
   - Due date
   - Priority (Low / Medium / High)
4. Edit existing deadlines
5. Delete deadlines
6. Mark deadline as completed
7. Automatic sorting:
   - Nearest due dates first
   - Priority-based ordering when dates are the same
8. Visual indicators:
   - Overdue
   - Due soon
   - Upcoming
9. Responsive design (works on desktop and mobile)
10. Empty-state UI message for first-time users
11. Data persistence using Firestore
12. Deployed live using Firebase Hosting

## Tech Stack

- Frontend: React (Vite)
- Styling: Tailwind CSS
- Backend: Firebase
- Authentication: Firebase Authentication (Email & Password)
- Database: Firebase Firestore
- Hosting: Firebase Hosting
- Version Control: Git & GitHub

---

## Folder Structure & File Roles

Explaination of the most relevant folders and files (as present in the project):

- `src/components/`  
  Contains reusable UI components such as cards, forms, buttons, and small widgets used across pages.

- `src/pages/`  
  Page-level components representing major routes/views (for example `Dashboard.jsx`). They typically assemble components to render full pages.

- `src/auth/`  
  Authentication-related UI components and pages (e.g., `Login.jsx`, `Signup.jsx`) and any authentication helpers.

- `src/firebase/`  
  Firebase initialization and exported Firebase utilities (for example `firebase.js`), including configured `auth` and `db` exports.

- `App.jsx`  
  Root React component. Sets up routes and application-level providers (for authentication state and route protection). It is the entry point for page routing.

- `Dashboard.jsx`  
  Main authenticated view that lists the current user’s deadlines and provides actions for adding, editing, and deleting deadlines.

- `DeadlineCard.jsx`  
  Component that renders a single deadline item with its title, due date, priority, status indicator, and action buttons (edit, delete, toggle complete).

- `EditDeadlineForm.jsx`  
  Form component used for both creating and editing deadlines. It handles validation and submits data to Firestore.

---

## Component & File Descriptions (Detailed)

### App.jsx
- Sets up routing (using `react-router-dom`) and global context such as `AuthContext`.
- Protects routes (redirect unauthenticated users to login).

### Dashboard.jsx
- Subscribes to Firestore collection for the current user’s deadlines (using `onSnapshot` or equivalent).
- Displays deadlines with `DeadlineCard` components.
- Provides UI to add new deadlines (modal or inline form) and to filter/sort the list.
- Implements sorting by `dueDate` ascending and by `priority` when due dates match.

### DeadlineCard.jsx
- Displays the deadline data (title, due date, priority, and a short description).
- Shows visual status badges: Overdue, Due Soon (e.g., within 48 hours), Upcoming.
- Provides actions to edit, delete, and toggle completion.

### EditDeadlineForm.jsx
- Fields: Title (required), Description (optional), Due Date (required), Priority (Low/Medium/High).
- Validates required fields before submitting to Firestore.
- Used for both creating and updating deadlines by accepting an optional `initialValues` prop.

---

## Key Concepts Explained

### React state and props
- **State** is mutable data that a component manages locally (using `useState`). It controls component behaviour and rendering.
- **Props** are read-only values passed from parent to child components. They are used to configure child components and provide callbacks for events.

### useState and useEffect
- `useState` creates reactive state variables that cause re-renders when updated.
- `useEffect` runs side effects (such as fetching data, subscribing to listeners, or performing cleanup). It accepts a dependency array to control when the effect runs and can return a cleanup function.

### Conditional rendering
- Rendering different UI based on state, e.g., showing a loading spinner while fetching or displaying an empty-state message when there are no deadlines.
- Common patterns include ternaries and logical `&&` for concise conditions.

### Event handling
- Use event handlers such as `onClick`, `onChange`, and `onSubmit` to respond to user actions.
- Prevent default form submit behaviour with `event.preventDefault()` and manage validation and data submission programmatically.

### Firebase authentication flow
- **Sign up**: `createUserWithEmailAndPassword(auth, email, password)` creates a new user account.
- **Sign in**: `signInWithEmailAndPassword(auth, email, password)` authenticates an existing user.
- **Auth state**: Use `onAuthStateChanged(auth, user => { ... })` to respond to authentication changes and to persist user session state in the app.
- Use the authenticated `user.uid` to associate data with the current user and to enforce access control.

### Firestore CRUD operations
- **Create**: `addDoc(collection(db, 'deadlines'), { title, description, dueDate, priority, completed: false, userId: user.uid })`
- **Read**: Query `collection(db, 'deadlines')` with `where('userId', '==', user.uid')` and optionally `orderBy('dueDate', 'asc')` to get user-specific deadlines.
- **Update**: `updateDoc(doc(db, 'deadlines', id), { ...updatedFields })`
- **Delete**: `deleteDoc(doc(db, 'deadlines', id))`
- **Real-time updates**: Use `onSnapshot` to listen to changes and update the UI instantly.

### One document = one deadline logic
- Each deadline is represented by a single Firestore document that contains all fields (title, description, dueDate, priority, completed, userId).
- This structure makes reads/writes efficient and simple to reason about.
- To improve sorting by priority, persist a numeric `priorityNumber` (e.g., High: 1, Medium: 2, Low: 3) and perform compound queries such as `orderBy('dueDate', 'asc').orderBy('priorityNumber', 'asc')`.

### Why GitHub and Firebase Hosting are used
- **GitHub**: Provides version control, change history, and a platform for evaluation and collaboration recommended for academic projects.
- **Firebase Hosting**: Simplifies deployment for single-page applications. It integrates well with Firebase services (Auth, Firestore) and provides fast, secure hosting with a global CDN.

---

## Installation & Setup

Prerequisites:
- Node.js (LTS) and npm or yarn
- Git
- A Firebase project (create at https://console.firebase.google.com/)

1. Clone the repository

```bash
git clone https://github.com/<username>/<repo>.git
cd <repo>
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Firebase setup

- Create or open a Firebase project in the Firebase console.
- Enable **Authentication** → Email/Password.
- Create a **Firestore** database (start in test mode for development).
- (Optional) Configure **Hosting** if you will deploy.
- Add a web app in the Firebase console and copy the Firebase config object.

Add your Firebase config to `src/firebase/firebase.js` or use environment variables. Example `src/firebase/firebase.js`:

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "PROJECT_ID.firebaseapp.com",
  projectId: "PROJECT_ID",
  // ...other config
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

4. (Recommended) Firestore security rules example

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /deadlines/{deadlineId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

5. Run the application locally

```bash
npm run dev
# or
yarn dev
```

Visit the URL shown in the console (commonly `http://localhost:5173`) to test the app locally.

---

## Build & Deploy to Firebase Hosting

1. Build the application

```bash
npm run build
# or
yarn build
```

2. Initialize Firebase Hosting (first time)

```bash
firebase login
firebase init hosting
# - select the Firebase project
# - set the build output directory (Vite default: "dist") as the public directory
# - configure as a single-page app (yes)
```

3. Deploy

```bash
firebase deploy --only hosting
```

Firebase will provide a hosting URL after successful deployment.

---

## Usage & Manual Test Cases

Manual test checklist:

- Authentication
  - Sign up with a new email and password.
  - Login with valid credentials.
  - Log out and verify protected routes are not accessible.
- Create deadline
  - Add deadlines with varying due dates and priorities.
  - Confirm documents in Firestore include the `userId` field.
- Edit deadline
  - Update values and verify persistence.
- Delete deadline
  - Remove a deadline and confirm it is deleted from Firestore and the UI.
- Mark complete
  - Toggle completed status and observe UI updates and sorting changes.
- Sorting & status badges
  - Verify earliest due date appears first; ties are broken by priority (High before Medium before Low).
  - Confirm statuses: Overdue, Due Soon (threshold), Upcoming.
- Responsive UI
  - Validate layout on desktop and mobile screen sizes.
- Empty state
  - Confirm a helpful message appears when no deadlines exist.

Edge cases to test:
- Time zone handling and date comparisons.
- Invalid inputs and client-side validations.

---

## Screenshots (Placeholders)

Replace the placeholder paths with actual images in `public/` or the repository when available.

- **Login Page**  
  ![Login Page](./public/screenshots/login.png)

- **Dashboard**  
  ![Dashboard](./public/screenshots/dashboard.png)

- **Add Deadline Modal**  
  ![Add Deadline Modal](./public/screenshots/add-deadline.png)

- **Mobile View**  
  ![Mobile View](./public/screenshots/mobile.png)

---

## Future Enhancements

Suggested improvements for future versions or an extended project:

- Email reminders using Cloud Functions to send scheduled emails.
- Push notifications (web push or mobile) to alert users about upcoming deadlines.
- Calendar integration (for example, Google Calendar sync/export).
- Recurring/Repeating deadlines support.
- Dark mode and user-specific preferences.
- Bulk import/export (CSV) of deadlines.
- Advanced filtering, search, and tagging.
- Unit and integration tests (Jest + React Testing Library).

---

## Troubleshooting & Notes

- If authentication fails, verify the Firebase config values and that Email/Password auth is enabled.
- Firestore queries may require composite indexes for compound `orderBy` operations; create indexes from Firebase console when prompted.
- Ensure the build output directory matches the directory configured for Firebase Hosting.
- Do not commit sensitive Firebase credentials to a public repository; prefer environment variables for production.

---

## Conclusion

This Deadline Reminder application is a concise full-stack project suitable for a college mini project. It demonstrates modern frontend development with React and Vite, client-side state management with React hooks, user authentication with Firebase Authentication, and real-time data persistence using Firestore. The codebase is structured for readability and extensibility, making it suitable for further enhancements such as notifications and calendar integration.

---

## Acknowledgements & License

- Built with React, Vite, Tailwind CSS, and Firebase.
- Consider using the MIT License for this project or follow your institution's licensing guidance.


---

