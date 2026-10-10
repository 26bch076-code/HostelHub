# 🏢 HostelHub - Smart Hostel Management Platform

A modern, responsive web application designed for college hostel students in India. Built with **React** and **Vite**, featuring a clean college-tech aesthetic, intuitive dashboard, authentication flow, and browser persistence.

---

## 🌟 Features Overview

### 1. 🔐 Complete Authentication Flow (Login & Registration)
- **Modern Student Login Page:** College email, password, show/hide password toggle, and direct navigation to register.
- **Student Registration Page:** Full Name, College Email, Student ID/Roll Number, Hostel Residence selection, Room Number, Password, and Confirm Password with validation.
- **Supabase Auth Ready:** Designed for seamless integration with Supabase Auth using environment variables.
- **Zero-Friction Demo Mode:** If Supabase keys are not set in `.env`, the app automatically runs in a clearly labeled **Demo Auth Mode** with interactive local student accounts.
- **Protected Views:** Unauthenticated visitors are automatically routed to the Login page.
- **Live User Profile:** The dashboard, sidebar, complaints, and mess feedback dynamically display the authenticated student's real name, student ID, and room number.
- **One-Click Sign Out:** Logout button available in both the sidebar footer and the top navigation header.

### 2. 📊 Interactive Dashboard
- **Personalized Student Greeting:** Displays resident name (e.g. *Aarav Sharma* or newly registered student), room, and hostel.
- **Top Announcement Bar:** Important alerts (e.g. Hackathon curfew extension).
- **Stat Counters:** Live counts for Pending, In Progress, and Resolved complaints, plus active notices.
- **Quick-Access Action Cards:** Shortcuts to Complaints, Mess Menu, Notice Board, and Lost & Found.
- **Recent Complaints Summary:** Quick view of the latest filed complaints.
- **Today's Meal Snapshot:** Quick glance at today's breakfast, lunch, and dinner.
- **Emergency Helplines:** 24x7 contact details for the Warden, Caretaker, Electrician, Security Gate, and Medical Unit.

### 3. 🛠️ Complaint Management (With Google Gemma AI)
- **AI-Powered Categorization (Feature 1):** Students can click **"✨ Auto-Categorize with Gemma"** after typing an issue description. Google Gemma 2 analyzes the issue and suggests:
  - Appropriate **Category**
  - Short **Title / Summary**
  - Extracted **Location / Room** (if mentioned in text)
  - Suggested **Priority** based on safety rules
- **Student Review & Edit:** Students review AI suggestions and can apply, adjust, or manually edit any field before submitting.
- **8 Comprehensive Categories:** `Electrical`, `Water and Plumbing`, `Mess and Food`, `Cleanliness`, `Maintenance`, `Internet and Wi-Fi`, `Security`, and `Other`.
- **Input Fields:** Category, Subject, Room Number (pre-filled with student's room), Urgency Priority, and Description.
- **Status Badges:** Clearly labels complaints as **Pending** (Amber), **In Progress** (Blue), and **Resolved** (Emerald).
- **Interactive Filtering:** Filter by status tabs and category dropdown.
- **Demo Status Changer:** Switch complaint statuses directly from the UI during hackathon judging presentations.

### 4. 📢 Notice Board
- **Circulars & Alerts:** Realistic Indian college hostel notices (Wi-Fi upgrades, water tank cleaning, festive dinners, tournaments).
- **Keyword Search:** Instant live search across notice titles, descriptions, and authors.
- **Category Filter Pills:** Administrative, Facility, Maintenance, Mess Committee, Sports & Cultural.
- **Demo Notice Publisher:** Create and publish new notices on the fly.

### 5. 🍽️ Mess Menu & Reviews
- **Day-Wise Schedule:** Full 7-day schedule (Monday to Sunday) auto-defaulted to the current day.
- **4 Meals Daily:** Breakfast, Lunch, Evening Snacks (High Tea), and Dinner with authentic Indian dishes.
- **Interactive Feedback Form:** Students can rate meals (1 to 5 stars), pre-filled with the authenticated student's name and room.
- **Community Review Wall:** Displays recent resident reviews stored directly in browser storage.

### 6. 🔍 Lost and Found Desk
- **Community Reporting:** Report lost or found items with location, date, description, and contact info.
- **Filters:** All Items, Lost (Red), and Found (Green).
- **Claim Toggle:** Easily mark items as "Claimed / Resolved" or reopen them.

---

## 🔑 Authentication & Supabase Configuration

HostelHub supports both **Live Supabase Auth** and **Local Demo Mode**:

### Option A: Running in Demo Mode (Default, Zero Setup)
- Works immediately out of the box!
- Comes pre-configured with a sample student account:
  - **Email:** `aarav.sharma@college.edu`
  - **Password:** `password123`
  - (A 1-click **"Auto-Fill Demo Student"** button is provided on the Login page).
- You can also register any new student with custom details on the Sign Up page. Registered accounts persist in `localStorage`.

### Option B: Connecting Live Supabase Backend
To connect a real Supabase backend:
1. Create a project at [https://supabase.com](https://supabase.com).
2. Go to **Project Settings** -> **API**.
3. Create a `.env` file in the project root (or copy from `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
   ```
4. Restart the development server (`npm run dev`).
5. HostelHub will automatically detect the credentials and switch from Demo Mode to **Supabase Auth Active**!

> **Security Note:** Only the public `anon` key should ever be placed in `.env` with the `VITE_` prefix. Never expose your Supabase `service_role` secret key in frontend code.

---

## 🚀 How to Run the Project

### Prerequisites
Make sure **Node.js** (v18 or higher) is installed.

### Step 1: Open Terminal in Project Folder
```powershell
cd c:\Users\MK1025\Desktop\hostelhub
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 🏗️ Project Structure

```
hostelhub/
├── .env.example                # Supabase configuration template with instructions
├── .env                        # Local environment variables (kept private)
├── .gitignore                  # Git ignore rules protecting keys and build files
├── index.html                  # HTML template with Plus Jakarta Sans font
├── vite.config.js              # Vite configuration
├── package.json                # Project dependencies (React, Supabase, Lucide icons)
├── README.md                   # Project documentation
│
└── src/
    ├── main.jsx                # Application root entry point
    ├── index.css               # Design system, CSS variables, typography, buttons
    ├── App.jsx                 # Top-level state, session guard, view switcher
    ├── App.css                 # Layout grids, sidebar, auth forms, media queries
    │
    ├── services/
    │   ├── supabase.js         # Supabase client setup & configuration detector
    │   └── authService.js      # Register, login, logout, and session tracker
    │
    ├── components/
    │   ├── Sidebar.jsx         # Desktop sidebar with user profile & logout
    │   ├── MobileBottomNav.jsx # Bottom navigation bar for mobile phone screens
    │   └── DemoBanner.jsx      # Top demo mode indicator with reset button
    │
    ├── pages/
    │   ├── Login.jsx           # Student login page with show/hide password
    │   ├── Register.jsx        # Student registration page with full validation
    │   ├── Dashboard.jsx       # Overview, stats, shortcuts & helplines
    │   ├── Complaints.jsx      # Complaint filing, status filters & list
    │   ├── NoticeBoard.jsx     # Circulars, search filter & demo notice creation
    │   ├── MessMenu.jsx        # 7-day meal schedule & feedback form
    │   └── LostAndFound.jsx    # Lost/found items, contact info & claim status
    │
    └── data/
        ├── initialData.js      # Realistic Indian college hostel mock data
        └── storage.js          # Clean helper functions to get/set localStorage
```
