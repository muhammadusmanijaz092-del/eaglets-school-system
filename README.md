# 🦅 EAGLETS SCHOOLS — Enterprise Management System (ERP)
> **"Rebirth Of Knowledge & Character"**  
> *Production-Ready, 100% Free-Tier Architecture (Next.js, Tailwind CSS, Supabase, Vercel)*

Designed and scaffolded to precision matching the **Google Stitch UI Prototype (`5888034074671141571`)**. Built specifically for Pakistani educational institutions with support for **NADRA B-Form validation, 3-part A4 printable Bank Fee Challans (HBL & Meezan Bank), 80mm POS Thermal Cash Desk Receipts, BISE Lahore compliant examination result cards, and State Bank of Pakistan / Raast payroll disbursements.**

---

## 🌟 Key Highlights & Modules

### 1. 📊 Executive Admin Overview (`/`)
* **Live KPI Cards:** Enrolled Students (with retention rate), Faculty strength (staff-to-student ratio), Monthly Fee Recovery in PKR, and Daily Attendance percentages.
* **PKR Live Ledger Feed:** Real-time stream of banking challans, counter cash deposits, and transactions pending bank reconciliation.
* **Academic Snapshot:** Active timetable period indicator, Examination Date Sheet alert banner, and Daily Diary publication tracker.
* **Admissions Approvals:** Instant review and approval table for newly submitted applications.

### 2. 🎓 Student Admissions & B-Form Registry (`/students`)
* **Quick Admission Modal:** Full validation for Student Name, NADRA B-Form (`35201-XXXXXXX-X`), Date of Birth, Gender, Father/Guardian Name & CNIC, Emergency Phone/WhatsApp, Class & Section.
* **Dossier & File Uploads:** Storage integration for profile pictures and scanned B-Form records.
* **Instant CSV Export:** Export complete student rosters with full demographic columns in one click.
* **Student Profile View:** View student credentials, contact info, and generate admission fee vouchers.

### 3. 💼 Faculty Hiring & Monthly Payroll (`/faculty`)
* **Staff Directory & Onboarding:** Employee ID (`EAG-FAC-XXX`), CNIC, highest academic qualification, assigned classes, and subject specializations.
* **Salary & Compensation:** Basic monthly pay in PKR + allowances breakdown.
* **Disbursement Channels:** Bank Transfer (HBL / Meezan), Raast / Mobile Wallet, or Cash.
* **Salary Slip Generator:** Instant generation of authenticated monthly salary credit vouchers.

### 4. 💳 Multi-Channel Fee Finance Engine (`/finance`)
* **Statutory Tuition Matrix:** Pre-configured tuition slabs for Early Years, Primary, Middle, Matric Science, and Cambridge O-Levels.
* **Batch Invoice Generation:** Generate monthly fee dues for entire cohorts with one click.
* **3 Settlement Channels:**
  1. **Direct Cash Counter:** Instant invoice clearance + automatic **80mm POS thermal receipt generation**.
  2. **Bank Transfer / Challan:** Selector for Habib Bank Limited, Meezan Bank, Allied Bank, or Bank Alfalah with deposit slip reference tracking.
  3. **JazzCash / Mobile:** Transaction ID (TID), sender mobile number, and payment mode logging.
* **Printable Layouts:**
  * **3-Part Perforated A4 Bank Challan:** Part 1 (Bank Copy), Part 2 (School Copy), and Part 3 (Student Copy) with barcodes, account numbers, and fee breakdown.
  * **80mm Thermal Cash Receipt:** Compact receipt for cash counter transactions.

### 5. 📋 Daily Attendance System (`/attendance`)
* **Segmented Toggle:** Switch between `[Student Attendance]` and `[Faculty Attendance]`.
* **One-Click Shortcuts:** "Mark All Present" button.
* **Status Flags:** `Present`, `Absent`, `Late`, `Leave` with automatic arrival timestamp tracking.
* **Parent SMS Alerts:** Automated absentee notification trigger simulation.

### 6. 📚 Academics, Timetable & Daily Diary (`/academics`)
* **Weekly Timetable Grid:** 8-period daily schedule (Monday–Saturday) with teacher and room assignments.
* **Syllabus Repository:** Tabbed repository for 1st Term and 2nd Term curriculum outlines with downloadable PDF attachments.
* **Daily Diary:** Teacher submission form (Classwork, Homework, Special Notes) rendering a clean parent-facing feed.

### 7. 🏆 Examination Portal & Result Cards (`/examinations`)
* **Date Sheet Builder:** Schedule examination windows, room allocations, and syllabus coverage.
* **Master Gazette Spreadsheet:** Multi-subject marks entry grid (English, Urdu, Islamiat, Pak Studies, Math, Physics, Chemistry, Biology/CS) calculating total obtained marks, percentages, and letter grades.
* **Official Printable Term Result Card:** Authentic collegiate layout with BISE Lahore accreditation headers, theory/practical breakdown, letter grades (A+ to Fail), attendance percentage, teacher remarks, and signature stamp blocks.

### 8. ⚙️ Settings & Access Control (`/settings`)
* Campus metadata, BISE affiliation records, partner bank account numbers, late fee policies, and Role-Based Access Control (RBAC) tiers.

### 9. 🔐 Authentication Portal (`/login`)
* Role switcher for Admin/Principal, Teacher, Accountant/Cashier, and Parent.

### 10. ⚡ Global Command Palette (`Ctrl + K`)
* Press `Ctrl + K` anywhere in the application to search students by Roll No/B-Form, search faculty, or jump to any module instantly.

---

## 🛠️ Technology Stack (100% Free Production Tier)

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (App Router)** | Server Components, fast Turbopack builds, SEO & pre-rendering |
| **Styling & Design** | **Tailwind CSS v4** | Oxford Navy & Crimson styling, custom print media queries |
| **Typography** | **Domine & Plus Jakarta Sans** | Traditional editorial academic gravitas paired with dense tabular figures |
| **Icons** | **Material Symbols Outlined** | Clean, recognizable administrative and status iconography |
| **Database & Auth** | **Supabase (Managed PostgreSQL)** | Relational schema, indexes, RLS policies, and Auth |
| **File Storage** | **Supabase Storage** | `public-syllabus`, `private-student-docs`, and `fee-slips` buckets |
| **Hosting & CI/CD** | **Vercel (Hobby Tier)** | Zero-config deployment connected to GitHub |

---

## 🚀 Getting Started

### 1. Local Development
```bash
# Navigate to the project directory
cd "D:\Eaglets School Management System\eaglets-school"

# Start the development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

### 2. Connecting Supabase Database & Storage

1. Create a free account at [supabase.com](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open [`supabase/schema.sql`](file:///D:/Eaglets%20School%20Management%20System/eaglets-school/supabase/schema.sql) from this project, copy the full contents, paste into the SQL Editor, and click **Run**.
   * *This will create all 12 relational tables, foreign keys, indexes, Row Level Security policies, storage buckets, and initial Pakistani seed data.*
4. Copy your project URL and Anon API Key from **Project Settings > API**.
5. Update [`.env.local`](file:///D:/Eaglets%20School%20Management%20System/eaglets-school/.env.local):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_SCHOOL_NAME="Eaglets Schools"
   NEXT_PUBLIC_SCHOOL_CAMPUS="Main Boys Campus, Lahore"
   NEXT_PUBLIC_CURRENT_SESSION="Session 2026–2027"
   ```

*(Note: If Supabase keys are not configured, the app automatically runs in rich offline mode using `lib/mock-data.ts`).*

---

### 3. Deploying to Vercel (100% Free)

1. Push this Git repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/your-username/eaglets-school.git
   git branch -M main
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `eaglets-school` repository.
4. Add your `.env.local` environment variables in the Vercel dashboard.
5. Click **"Deploy"**. Your school portal will be live with free global CDN and SSL!

---

## 🖨️ Printing Guidelines

* **3-Part Bank Challan (`/finance`):**
  * Recommended: **A4 Landscape** with margins set to `None` or `Minimum` in your browser print dialog. Ensure "Background Graphics" is checked.
* **Term Result Card (`/examinations`):**
  * Recommended: **A4 Portrait** with background graphics enabled for official seal watermarks.
* **POS Counter Slip (`/finance`):**
  * Recommended: **80mm Continuous Thermal Roll** printer or standard desktop printer.

---
*Developed for Eaglets Schools — Lahore, Pakistan.*
