# NEU Visitor Management System (Digital Logbook)

An elite, real-time visitor tracking and facility management platform designed exclusively for **New Era University**. This system replaces traditional paper logbooks with a secure, digital gateway for students, faculty, and administrators.

## 🚀 Key Features

### 🏛️ For Visitors (Students & Faculty)
- **Instant Check-in**: Secure digital entry for University Libraries and Dean's Offices.
- **Institutional Verification**: SSO-style access restricted to official `@neu.edu.ph` email domains.
- **Role-Based Profiles**: Automatic designation as Student, Teacher, or Staff based on institutional credentials.
- **Live Status Feedback**: Visual confirmation of check-in status and security token generation.

### 🛡️ For Administrators (Command Center)
- **Real-time Analytics**: Live dashboard showing active campus traffic, facility usage, and visitor demographics.
- **Granular Filtering**: Filter statistics by College Department, Visitor Type, and Reason for Visit.
- **Active Session Monitoring**: Monitor currently logged-in users across mobile and desktop platforms in real-time.
- **Comprehensive Audit Logs**: A searchable, exportable history of all campus check-ins and visitor activity.
- **User Management**: Ability to manage access levels and suspend accounts if security policies are violated.

### 🤖 Intelligence & Security
- **AI Insights (Gemini Powered)**: Generate automated usage reports identifying peak hours and common visit patterns using Google Genkit.
- **Institutional RBAC**: Automatic assignment of administrative privileges to authorized personnel (`jcesperanza@neu.edu.ph`).
- **Glassmorphism UI**: A premium, high-contrast dark aesthetic built for professional institutional environments.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & Styling**: [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase Firestore](https://firebase.google.com/products/firestore) (Real-time sync)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth)
- **Generative AI**: [Google Genkit](https://firebase.google.com/docs/genkit) (Gemini 2.5 Flash)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

- `src/app`: Next.js App Router pages and layouts.
- `src/ai`: Genkit flows and AI prompt definitions for insights.
- `src/firebase`: Client-side Firebase configuration and custom hooks (`useCollection`, `useDoc`).
- `src/lib`: Shared utilities, TypeScript types, and local state management.
- `src/components`: Reusable UI components and layout structures.

## 🚦 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://192.168.1.10:9002) with your browser to see the result.

---
© 2024 New Era University. Official Institutional Tool.
