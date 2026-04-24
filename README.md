# Vlearn Frontend

![Vlearn Logo](./public/images/vlearn_logo.png)

> A modern, full-featured e-learning platform built with **React 18** and **Vite** — delivering video lessons, interactive quizzes, science simulations, resource libraries, and M-Pesa-powered subscriptions.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Building for Production](#building-for-production)
- [Routing & Pages](#routing--pages)
- [Subscription Plans & Access Control](#subscription-plans--access-control)
- [Science Simulations](#science-simulations)
- [Admin Dashboard](#admin-dashboard)
- [Component Library](#component-library)
- [Configuration](#configuration)
- [Contributing](#contributing)

---

## Overview

**Vlearn** is an interactive e-learning web application aimed at students and academic institutions. It supports structured course delivery through video content, downloadable resources, multiple-choice quizzes, and hands-on science simulations. The platform has two distinct portals — a **Student Dashboard** and an **Admin Dashboard** — with subscription-based access control integrated with **M-Pesa** payments.

---

## Features

### Student Portal
- 🎬 **Video Lessons** — Stream course videos using a built-in media player
- 📚 **Course Detail Pages** — Browse course content and enroll
- 📝 **Quizzes** — Attempt quizzes, submit answers, and view results
- 🔬 **Science Simulations** — Interact with 7 subject-specific simulations covering Chemistry
- 📂 **Resources** — Access and download supplementary learning materials
- 💳 **Subscription Plans** — `Free Trial`, `Explorer Plan`, `Pro Plan`, and `Daily` tiers

### Admin Portal
- 📊 **Analytics Dashboard** — View platform-wide usage and learning metrics
- 👥 **User Management** — View, manage, and moderate learner accounts
- 🎓 **Course Management** — Full CRUD for courses, videos, files, questions, and question groups

### Platform-Wide
- 🔐 **Authentication** — JWT-based login/signup with protected and subscription-restricted routes
- 🔔 **Notification System** — In-app alerts, dialogs, and notification bars
- 📱 **Responsive Design** — Mobile-friendly layouts using Tailwind CSS v4
- 🎨 **Internal Component Library** — A rich set of reusable UI components covering forms, tables, navigation, billing, and more

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.3 | UI framework |
| [Vite](https://vitejs.dev/) | 5.4 | Build tool & dev server |
| [React Router](https://reactrouter.com/) | 7.8 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1 | Utility-first styling |
| [Axios](https://axios-http.com/) | 1.7 | HTTP client for API calls |
| [Framer Motion](https://www.framer.com/motion/) | 12.10 | Animations and transitions |
| [react-player](https://github.com/cookpete/react-player) | 2.16 | Video playback |
| [react-multi-carousel](https://github.com/YIZHUANG/react-multi-carousel) | 2.8 | Responsive carousels |
| [react-wavify](https://github.com/geobde/react-wavify) | 1.11 | Animated wave UI effects |
| [SweetAlert2](https://sweetalert2.github.io/) | 11.15 | Alert and modal dialogs |
| [tus-js-client](https://github.com/tus/tus-js-client) | 4.3 | Resumable file/video uploads |
| [EmailJS](https://www.emailjs.com/) | 4.4 | Contact form email delivery |
| [jwt-decode](https://github.com/auth0/jwt-decode) | 4.0 | Decoding JWT tokens client-side |
| [Headless UI](https://headlessui.com/) | 2.2 | Accessible unstyled UI primitives |
| [Lucide React](https://lucide.dev/) | 0.469 | Icon library |
| [Font Awesome](https://fontawesome.com/) | 6.7 | Additional icon set |
| [Heroicons](https://heroicons.com/) | 2.2 | Heroicons icon set |
| [Lodash](https://lodash.com/) | 4.17 | Utility functions (debounce, etc.) |

---

## Project Structure

```
Vlearn_frontend/
├── public/
│   └── images/                        # Static assets (logos, backgrounds)
│       ├── vlearn_logo.png
│       ├── Vlearn_bg.png
│       └── ...
│
├── src/
│   ├── App.jsx                        # Root component — full router configuration
│   ├── main.jsx                       # Application entry point
│   ├── index.css                      # Global CSS / Tailwind base styles
│   │
│   ├── Pages/
│   │   ├── Home.jsx                   # Public landing page
│   │   ├── ContactUs.jsx              # Contact form page
│   │   │
│   │   ├── User/                      # Student-facing pages
│   │   │   ├── User.jsx               # User profile & settings
│   │   │   ├── Dashboard.jsx          # Main student dashboard
│   │   │   ├── DashboardOutlet.jsx    # Nested layout wrapper for dashboard
│   │   │   ├── CourseDetail.jsx       # Individual course view
│   │   │   ├── Quizzes.jsx            # Quiz listing page
│   │   │   ├── Quiz.jsx               # Single quiz view
│   │   │   ├── QuizAttempt.jsx        # Active quiz-taking interface
│   │   │   ├── Results.jsx            # Quiz results & scores
│   │   │   ├── Resources.jsx          # Downloadable course resources
│   │   │   ├── Simulations.jsx        # Simulation selection/landing page
│   │   │   └── Simulations/           # Individual simulation components
│   │   │       ├── CharlesLawSim.jsx
│   │   │       ├── ChemicalSim.jsx
│   │   │       ├── CircuitSim.jsx
│   │   │       ├── ElectrolysisSim.jsx
│   │   │       ├── FreefallSim.jsx
│   │   │       ├── OpticsSim.jsx
│   │   │       └── ReactionRatesim.jsx
│   │   │
│   │   └── Admin/                     # Admin-facing pages
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminDashboardOutlet.jsx
│   │       ├── Analytics.jsx
│   │       ├── UserManagement.jsx
│   │       └── CourseManagement/
│   │           ├── CourseManagement.jsx
│   │           ├── VideoManagement.jsx
│   │           ├── FileManagement.jsx
│   │           ├── QuestionManagement.jsx
│   │           └── QuestionGroupManagement.jsx
│   │
│   ├── Components/                    # Shared page-level UI components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── SubscriptionPlan.jsx
│   │   ├── Admin/
│   │   │   └── AdminSideNav.jsx
│   │   └── User/
│   │       └── SideNav.jsx
│   │
│   ├── Context/
│   │   └── UserContext.jsx            # Global user authentication state
│   │
│   ├── component-library/             # Internal reusable design system
│   │   ├── account-management/        # Auth flows, protected routes, user profiles
│   │   │   ├── authentication/        # SignInForm, SignUpForm, ProtectedRoute, etc.
│   │   │   ├── routes/                # AccountRouter, AuthenticationRouter, etc.
│   │   │   └── users/user-profiles/   # UserProfile, PasswordChangeForm, etc.
│   │   ├── alerts/                    # Alert, AlertDialog, Notification, NotificationBar
│   │   ├── billing-and-payments/
│   │   │   ├── billing/               # BillingAddressForm, InvoiceDetails
│   │   │   ├── payments/              # MpesaPaymentForm, PaymentForm
│   │   │   └── subscriptions/         # SubscriptionList, SubscriptionPlanList, etc.
│   │   ├── breadcrumbs/
│   │   ├── butttons/
│   │   ├── cards/
│   │   ├── chips/
│   │   ├── context-providers/         # MessagesContextProvider
│   │   ├── dashboards/                # DashboardStats
│   │   ├── delete-button/
│   │   ├── dialogs/                   # CenteredDialog, SideDialog
│   │   ├── draggable-list/
│   │   ├── dropdown-menus/
│   │   ├── forms/                     # TextInput, SelectField, RichTextEditor, FileInput, etc.
│   │   ├── images/
│   │   ├── layout/                    # Scaffold, sidebars, headers, footers
│   │   ├── logos/
│   │   ├── navigation/                # Horizontal, vertical, nested, tab navigation
│   │   ├── pagination/
│   │   ├── query-filters/
│   │   ├── sliders/
│   │   ├── tables/
│   │   ├── tabs/
│   │   └── utils/                     # EmptyState, ErrorPage, LoadingScreen, Socials
│   │
│   ├── config/
│   │   └── constantVariables.js       # API base URLs, plan names, app-wide constants
│   │
│   └── util-functions/
│       ├── requestTemplates.js        # Reusable API request builders
│       └── responseFormater.js        # API response parsing & formatting helpers
│
├── index.html
├── vite.config.js
├── package.json
└── .eslintrc
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) **v18 or higher**
- [npm](https://www.npmjs.com/) **v9 or higher** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Griffin-Ndede/Vlearn_frontend.git

# 2. Navigate into the project directory
cd Vlearn_frontend

# 3. Install all dependencies
npm install
```

### Running the App

```bash
npm run dev
```

The development server will start at [http://localhost:5173](http://localhost:5173) by default.

### Building for Production

```bash
npm run build
```

The production-ready files are output to the `dist/` folder. To preview the production build locally before deploying:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Routing & Pages

All routes are defined in `src/App.jsx` using React Router v7's `createBrowserRouter`. The entire app is wrapped in a `SubscriptionContextProvider` at the root so subscription state is available everywhere.

| Route | Page | Access Level |
|---|---|---|
| `/` | Home (Landing Page) | Public |
| `/login` | Login | Public |
| `/register` | Sign Up | Public |
| `/contact` | Contact Us | Public |
| `/subscription` | Subscription Plans | Public |
| `/coursedetails/:id` | Course Detail | Public |
| `/dashboard` | Student Dashboard (index) | 🔒 Auth + Subscription |
| `/dashboard/home` | Dashboard Home | 🔒 Auth + Subscription |
| `/dashboard/user` | User Profile | 🔒 Auth |
| `/dashboard/resources` | Learning Resources | 🔒 Auth + Subscription |
| `/dashboard/quizzes` | Quiz List | 🔒 Auth + Subscription |
| `/dashboard/quiz/:id` | Quiz Attempt | 🔒 Auth |
| `/dashboard/results` | Quiz Results | 🔒 Auth + Subscription |
| `/dashboard/simulations` | Science Simulations | 🔒 Auth + Subscription |
| `/admin-dashboard` | Admin Overview | 🛡️ Admin |
| `/admin-dashboard/course-management` | Course Management | 🛡️ Admin |
| `/admin-dashboard/user-management` | User Management | 🛡️ Admin |
| `/admin-dashboard/analytics` | Analytics | 🛡️ Admin |

---

## Subscription Plans & Access Control

Vlearn gates content behind an active subscription using two key components:

- **`SubscriptionContextProvider`** — wraps the app root and makes subscription state globally available
- **`SubscriptionRestricted`** — wraps individual routes and blocks access if the user's plan isn't in the `allowedSubscriptionPlans` list

The following subscription tiers are currently supported:

| Plan Name | Key |
|---|---|
| Free Trial | `free_trial` |
| Explorer Plan | `explorer_plan` |
| Pro Plan | `pro_plan` |
| Daily | `daily` |

Routes without a subscription wrapper (e.g. `/dashboard/user`) are accessible to any authenticated user regardless of plan. Routes without `ProtectedRoute` are fully public.

---

## Science Simulations

Vlearn includes **7 interactive science simulations** accessible from the `/dashboard/simulations` route. Each simulation is a self-contained React component located in `src/Pages/User/Simulations/`:

| Simulation | Subject |
|---|---|
| Charles's Law | Physics / Chemistry |
| Chemical Reactions | Chemistry |
| Electric Circuits | Physics |
| Electrolysis | Chemistry |
| Free Fall | Physics |
| Optics | Physics |
| Reaction Rates | Chemistry |

---

## Admin Dashboard

The admin portal (`/admin-dashboard`) provides full content and user management:

- **AdminDashboard** — Overview summary with key platform statistics
- **Analytics** — Detailed metrics on user engagement and course performance
- **UserManagement** — View and manage all registered learner accounts
- **CourseManagement** — Manage courses and their sub-resources:
  - `VideoManagement` — Upload and manage video lessons (uses `tus-js-client` for resumable uploads)
  - `FileManagement` — Attach downloadable files to courses
  - `QuestionManagement` — Create and edit individual quiz questions
  - `QuestionGroupManagement` — Organise questions into groups and quizzes

---

## Component Library

The `src/component-library/` directory is an internal design system of categorised, reusable components. Below are the key areas:

**Account Management**
`SignInForm`, `SignUpForm`, `ProtectedRoute`, `RestrictedRoute`, `UserProfile`, `PasswordChangeForm`, `ResetPasswordForm`, `SetNewPasswordForm`

**Billing & Payments**
`MpesaPaymentForm`, `PaymentForm`, `SubscriptionList`, `SubscriptionPlanList`, `SubscriptionRestricted`, `InvoiceDetails`, `BillingAddressForm`

**Forms**
`TextInput`, `SelectField`, `FileInput`, `RichTextEditor`, `CheckBox`, `ToggleSwitch`, `ListInputField`, `JSONFormWrapper`, `FormDialog`, `FormWrapper`, `TemplateTextField`

**Layout**
`ScaffoldWithSideBar`, `AppSideBar`, `SimpleSideBar`, `PageHeader`, `SectionHeader`, `FooterOne`, `Container`

**Navigation**
`HorizontalNavigation`, `VerticalNavigation`, `NestedNavigationItems`, `NavigationItem`, `PageTabs`

**Dialogs & Alerts**
`Alert`, `AlertDialog`, `Notification`, `NotificationBar`, `CenteredDialog`, `SideDialog`

**Utilities**
`LoadingScreen`, `EmptyState`, `ErrorPage`, `Socials`, `GetFetcherData`, `UseLoaderData`

---

## Configuration

App-wide constants such as API base URLs, environment flags, and plan identifiers are stored in:

```
src/config/constantVariables.js
```

Update this file to point to your backend API before running or deploying the app.

API request patterns are abstracted in `src/util-functions/requestTemplates.js`, and response parsing/formatting helpers live in `src/util-functions/responseFormater.js`.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against the `main` branch

Please ensure there are no linting errors before submitting (`npm run lint`) and follow the existing code style throughout.

---

*Built with ❤️ for learners.*
