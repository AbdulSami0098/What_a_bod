# WhatABod — Gym Management System

A modern, fully responsive frontend-only gym management platform built with React + Tailwind CSS. Designed as a portfolio project demonstrating role-based authentication, data management, charts, and clean UI/UX.

## Live Demo

> Deploy to Vercel/Netlify and add link here.

## Features

| Feature | Description |
|---|---|
| **Authentication** | Role-based login for Admin, Trainer, and Member with demo credentials |
| **Dashboard** | Stats cards, revenue area chart, member growth bar chart, plan distribution pie, activity feed |
| **Member Management** | Full CRUD table with search/filter, member profile pages |
| **Membership Plans** | Pricing cards (Monthly / Quarterly / Annual), comparison table, assign-to-member modal |
| **Attendance** | Daily register with Present/Late/Absent marking, history per member with attendance rates |
| **Payments** | Payment history table with Paid/Pending badges, record new payments, mark as paid |
| **Trainer Management** | Trainer profiles with certifications, expandable client lists, assign members |

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@whatabod.com | admin123 |
| Trainer | trainer@whatabod.com | trainer123 |
| Member | member@whatabod.com | member123 |

## Tech Stack

- **React 18** + **Vite** — fast development & builds
- **Tailwind CSS v3** — utility-first styling
- **React Router v6** — client-side routing with role guards
- **Recharts** — Area, Bar, Pie charts
- **Lucide React** — icon library
- **Context API** — global auth & data state (no backend needed)

## Getting Started

```bash
# Clone the repository
git clone git@github.com:AbdulSami0098/What_a_bod.git
cd What_a_bod

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   └── common/        # Layout, Sidebar, Header, Modal, StatCard
├── context/
│   ├── AuthContext    # Auth state + login/logout
│   └── DataContext    # Members, attendance, payments state
├── data/
│   └── mockData.js    # All demo data
├── pages/
│   ├── LoginPage
│   ├── DashboardPage
│   ├── MembersPage + MemberProfilePage
│   ├── PlansPage
│   ├── AttendancePage
│   ├── PaymentsPage
│   └── TrainersPage
└── routes/
    └── ProtectedRoute # Role-based route guards
```

## Role Permissions

- **Admin** — full access to all pages, can add/edit/delete members, assign trainers & plans, record payments
- **Trainer** — dashboard, their assigned members, attendance marking
- **Member** — personal dashboard, own plan/attendance/payment history

---

Built by **Abdul Sami** · [GitHub](https://github.com/AbdulSami0098)
