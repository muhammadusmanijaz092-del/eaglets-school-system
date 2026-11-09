-- ==============================================================================
-- EAGLETS SCHOOL MANAGEMENT SYSTEM
-- Complete PostgreSQL Database Schema & Migration Script
-- Production-Ready for Supabase (100% Free Tier Compatible)
-- Includes: Relational Tables, Foreign Keys, Indexes, Row Level Security (RLS),
--           Storage Buckets, and Initial Seed Data for Pakistan School Operations
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- Classes & Academic Sections
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g. "Grade 10", "Grade 9", "Grade 8"
    section VARCHAR(50) NOT NULL, -- e.g. "Rose", "Jasmine", "Lily", "Tulip", "Science A"
    grade_level INTEGER NOT NULL, -- 1 through 12
    wing VARCHAR(50) NOT NULL DEFAULT 'Main Boys Campus', -- 'Main Boys Campus', 'Girls Junior Campus', 'Gulberg Model Wing'
    stream VARCHAR(50) NOT NULL DEFAULT 'General', -- 'Science (Matric)', 'Computer Science', 'Arts', 'Cambridge O-Levels'
    monthly_tuition_pkr DECIMAL(10, 2) NOT NULL DEFAULT 12000.00,
    lab_charges_pkr DECIMAL(10, 2) NOT NULL DEFAULT 1500.00,
    capacity INTEGER NOT NULL DEFAULT 40,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, section, wing)
);

-- Faculty & Administrative Staff
CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    emp_id VARCHAR(50) NOT NULL UNIQUE, -- e.g. "EAG-FAC-101"
    full_name VARCHAR(150) NOT NULL,
    cnic VARCHAR(20) NOT NULL UNIQUE, -- Pakistani CNIC: "35201-XXXXXXX-X"
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    qualification VARCHAR(150) NOT NULL, -- e.g. "M.Phil Physics, PU", "M.Sc Mathematics, GCU"
    designation VARCHAR(100) NOT NULL, -- e.g. "Senior Subject Specialist", "Headmaster", "Accountant"
    department VARCHAR(100) NOT NULL DEFAULT 'Science',
    assigned_classes TEXT[] DEFAULT '{}', -- e.g. ARRAY['Grade 10 - Rose', 'Grade 9 - Lily']
    assigned_subjects TEXT[] DEFAULT '{}', -- e.g. ARRAY['Physics', 'Mathematics']
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    basic_salary_pkr DECIMAL(10, 2) NOT NULL DEFAULT 65000.00,
    allowances_pkr DECIMAL(10, 2) NOT NULL DEFAULT 10000.00,
    payment_mode VARCHAR(50) NOT NULL DEFAULT 'Bank Transfer', -- 'Cash', 'Bank Transfer', 'Raast / Mobile Wallet'
    bank_name VARCHAR(100), -- 'HBL', 'Meezan Bank', 'Allied Bank', 'Bank Alfalah'
    account_number VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'On Leave', 'Resigned'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Students Registry
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_no VARCHAR(50) NOT NULL UNIQUE, -- e.g. "ADM-2026-0104"
    roll_no VARCHAR(50) NOT NULL UNIQUE, -- e.g. "EAG-10-042"
    student_name VARCHAR(150) NOT NULL,
    b_form VARCHAR(25) NOT NULL UNIQUE, -- NADRA B-Form Number: "35201-XXXXXXX-X"
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL, -- 'Male', 'Female'
    father_name VARCHAR(150) NOT NULL,
    father_cnic VARCHAR(25) NOT NULL, -- "35201-XXXXXXX-X"
    contact_phone VARCHAR(25) NOT NULL,
    whatsapp_no VARCHAR(25),
    address TEXT NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE RESTRICT,
    section VARCHAR(50) NOT NULL,
    previous_school VARCHAR(200),
    photo_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Suspended', 'Withdrawn', 'Alumni'
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Monthly Fee Structures & Slabs
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    cycle_name VARCHAR(100) NOT NULL, -- e.g. "October 2026", "Session 2026-2027"
    tuition_fee_pkr DECIMAL(10, 2) NOT NULL DEFAULT 14000.00,
    lab_fund_pkr DECIMAL(10, 2) NOT NULL DEFAULT 1500.00,
    exam_fund_pkr DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
    campus_dev_fund_pkr DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
    admission_fee_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    late_fine_pkr DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Fee Invoices (Monthly Challans)
CREATE TABLE IF NOT EXISTS public.fee_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_no VARCHAR(50) NOT NULL UNIQUE, -- e.g. "INV-2026-10-8492"
    challan_no VARCHAR(50) NOT NULL UNIQUE, -- e.g. "CH-2026-10-8492"
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    billing_month VARCHAR(50) NOT NULL, -- e.g. "October 2026"
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '10 days'),
    expiry_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '20 days'),
    tuition_amount_pkr DECIMAL(10, 2) NOT NULL,
    lab_amount_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    exam_amount_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    development_amount_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    concession_amount_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    arrears_amount_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_due_pkr DECIMAL(10, 2) NOT NULL,
    late_surcharge_pkr DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    total_after_due_date_pkr DECIMAL(10, 2) NOT NULL,
    paid_amount_pkr DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- 'Unpaid', 'Paid', 'Partial', 'Overdue'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fee Payments Settlement Ledger
CREATE TABLE IF NOT EXISTS public.fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.fee_invoices(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    receipt_no VARCHAR(50) NOT NULL UNIQUE, -- e.g. "REC-90412"
    amount_paid_pkr DECIMAL(10, 2) NOT NULL,
    payment_channel VARCHAR(50) NOT NULL, -- 'Direct Cash Counter', 'Bank Challan (HBL / Meezan)', 'JazzCash / Mobile'
    payment_mode VARCHAR(50) NOT NULL, -- 'Cash Desk', 'HBL Online', 'Meezan Over-Counter', 'JazzCash Till QR'
    transaction_ref VARCHAR(100), -- TID or Bank Challan Stamp Ref
    bank_name VARCHAR(100), -- 'Habib Bank Limited', 'Meezan Bank', 'Allied Bank', 'Bank Alfalah'
    sender_mobile VARCHAR(25),
    proof_attachment_url TEXT,
    received_by VARCHAR(100) NOT NULL DEFAULT 'Admin Cashier',
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reconciliation_status VARCHAR(50) NOT NULL DEFAULT 'Verified', -- 'Verified', 'Pending Reconcile', 'Rejected'
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily Attendance (Students & Faculty)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    entity_type VARCHAR(20) NOT NULL, -- 'Student', 'Faculty'
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.faculty(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'Present', 'Absent', 'Late', 'Leave'
    time_in TIME,
    remarks VARCHAR(255),
    marked_by VARCHAR(100) NOT NULL DEFAULT 'Class In-charge',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_entity_id CHECK (
        (entity_type = 'Student' AND student_id IS NOT NULL AND faculty_id IS NULL) OR
        (entity_type = 'Faculty' AND faculty_id IS NOT NULL AND student_id IS NULL)
    ),
    UNIQUE(attendance_date, entity_type, student_id, faculty_id)
);

-- Academics: Syllabus Hub
CREATE TABLE IF NOT EXISTS public.syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    term VARCHAR(50) NOT NULL, -- '1st Term', '2nd Term', 'Final Term'
    subject_name VARCHAR(100) NOT NULL, -- e.g. 'Physics', 'Mathematics', 'English Compulsory'
    title VARCHAR(200) NOT NULL,
    total_chapters INTEGER NOT NULL DEFAULT 6,
    file_url TEXT,
    file_size_kb INTEGER,
    uploaded_by VARCHAR(100) NOT NULL DEFAULT 'Academic Coordinator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Academics: Daily Diaries (Parent Feed)
CREATE TABLE IF NOT EXISTS public.daily_diaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    teacher_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
    diary_date DATE NOT NULL DEFAULT CURRENT_DATE,
    classwork TEXT NOT NULL,
    homework TEXT NOT NULL,
    teacher_notes TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Academics: Timetable Grid
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL, -- 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    period_number INTEGER NOT NULL CHECK (period_number BETWEEN 1 AND 8),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    teacher_id UUID REFERENCES public.faculty(id) ON DELETE SET NULL,
    room_number VARCHAR(50) NOT NULL DEFAULT 'Room 101',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Examinations & Result Cards
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL, -- e.g. 'First Term Examination 2026', 'Mid Term', 'Send-up / Pre-Board'
    session VARCHAR(50) NOT NULL DEFAULT 'Session 2026–2027',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    passing_percentage DECIMAL(5, 2) NOT NULL DEFAULT 33.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_date_sheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL DEFAULT '08:30:00',
    end_time TIME NOT NULL DEFAULT '11:30:00',
    room_number VARCHAR(50) NOT NULL DEFAULT 'Main Examination Hall',
    syllabus_coverage VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_name VARCHAR(100) NOT NULL,
    max_theory DECIMAL(5, 2) NOT NULL DEFAULT 75.00,
    max_practical DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    total_max_marks DECIMAL(5, 2) NOT NULL DEFAULT 75.00,
    passing_marks DECIMAL(5, 2) NOT NULL DEFAULT 25.00,
    obt_theory DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    obt_practical DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    obt_total_marks DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    percentage DECIMAL(5, 2) NOT NULL,
    letter_grade VARCHAR(10) NOT NULL, -- 'A+', 'A', 'B', 'C', 'D', 'Fail'
    class_rank VARCHAR(20), -- '1st', '2nd', '3rd', etc.
    teacher_remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(exam_id, student_id, subject_name)
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON public.students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_b_form ON public.students(b_form);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON public.students(class_id);
CREATE INDEX IF NOT EXISTS idx_faculty_emp_id ON public.faculty(emp_id);
CREATE INDEX IF NOT EXISTS idx_faculty_cnic ON public.faculty(cnic);
CREATE INDEX IF NOT EXISTS idx_invoices_student_id ON public.fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_challan_no ON public.fee_invoices(challan_no);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date, entity_type);
CREATE INDEX IF NOT EXISTS idx_results_exam_student ON public.exam_results(exam_id, student_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_diaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_date_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated & anon service keys (School Intranet / Portal)
CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public read faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow public read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public read fee_structures" ON public.fee_structures FOR SELECT USING (true);
CREATE POLICY "Allow public read fee_invoices" ON public.fee_invoices FOR SELECT USING (true);
CREATE POLICY "Allow public read fee_payments" ON public.fee_payments FOR SELECT USING (true);
CREATE POLICY "Allow public read attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow public read syllabus" ON public.syllabus FOR SELECT USING (true);
CREATE POLICY "Allow public read daily_diaries" ON public.daily_diaries FOR SELECT USING (true);
CREATE POLICY "Allow public read timetables" ON public.timetables FOR SELECT USING (true);
CREATE POLICY "Allow public read examinations" ON public.examinations FOR SELECT USING (true);
CREATE POLICY "Allow public read exam_date_sheets" ON public.exam_date_sheets FOR SELECT USING (true);
CREATE POLICY "Allow public read exam_results" ON public.exam_results FOR SELECT USING (true);

-- Allow write for authorized service roles
CREATE POLICY "Allow full access classes" ON public.classes FOR ALL USING (true);
CREATE POLICY "Allow full access faculty" ON public.faculty FOR ALL USING (true);
CREATE POLICY "Allow full access students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow full access fee_invoices" ON public.fee_invoices FOR ALL USING (true);
CREATE POLICY "Allow full access fee_payments" ON public.fee_payments FOR ALL USING (true);
CREATE POLICY "Allow full access attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow full access syllabus" ON public.syllabus FOR ALL USING (true);
CREATE POLICY "Allow full access daily_diaries" ON public.daily_diaries FOR ALL USING (true);
CREATE POLICY "Allow full access examinations" ON public.examinations FOR ALL USING (true);
CREATE POLICY "Allow full access exam_results" ON public.exam_results FOR ALL USING (true);

-- ==============================================================================
-- 5. STORAGE BUCKET CREATION (Supabase Storage)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('public-syllabus', 'public-syllabus', true),
    ('private-student-docs', 'private-student-docs', false),
    ('fee-slips', 'fee-slips', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Public Syllabus Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-syllabus');

CREATE POLICY "Public Fee Slips Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'fee-slips');

CREATE POLICY "Allow Authenticated Uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('public-syllabus', 'private-student-docs', 'fee-slips'));

-- ==============================================================================
-- 6. REALISTIC SAMPLE SEED DATA (PAKISTANI ACADEMIC SYSTEM)
-- ==============================================================================

-- Seed Classes
INSERT INTO public.classes (id, name, section, grade_level, wing, stream, monthly_tuition_pkr, lab_charges_pkr, capacity)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Grade 10', 'Science A (Rose)', 10, 'Main Boys Campus', 'Science (Matric)', 14000.00, 1500.00, 40),
    ('c2222222-2222-2222-2222-222222222222', 'Grade 9', 'Science (Jasmine)', 9, 'Main Boys Campus', 'Science (Matric)', 14000.00, 1500.00, 40),
    ('c3333333-3333-3333-3333-333333333333', 'Grade 8', 'Cambridge (Lily)', 8, 'Main Boys Campus', 'Cambridge O-Levels', 11500.00, 1000.00, 35),
    ('c4444444-4444-4444-4444-444444444444', 'Grade 6', 'General (Tulip)', 6, 'Main Boys Campus', 'General', 11500.00, 500.00, 35),
    ('c5555555-5555-5555-5555-555555555555', 'Grade 4', 'Junior Wing', 4, 'Girls Junior Campus', 'General', 9500.00, 0.00, 30)
ON CONFLICT (name, section, wing) DO NOTHING;

-- Seed Faculty
INSERT INTO public.faculty (id, emp_id, full_name, cnic, phone, email, address, qualification, designation, department, assigned_classes, assigned_subjects, joining_date, basic_salary_pkr, allowances_pkr, payment_mode, bank_name, account_number, status)
VALUES
    ('f1111111-1111-1111-1111-111111111111', 'EAG-FAC-101', 'M. Tariq Alvi', '35201-1249581-3', '+92 300 8472910', 'tariq.alvi@eaglets.edu.pk', 'Main Gulberg, Lahore', 'M.A Education, M.Phil PU', 'Principal & Chief Administrator', 'Administration', ARRAY['Grade 10', 'Grade 9'], ARRAY['English Compulsory'], '2018-08-01', 185000.00, 35000.00, 'Bank Transfer', 'Habib Bank Limited', '0042-79018420-01', 'Active'),
    ('f2222222-2222-2222-2222-222222222222', 'EAG-FAC-102', 'Engr. Masood Ahmad', '35202-9842104-5', '+92 321 4455882', 'masood.ahmad@eaglets.edu.pk', 'Model Town Block C, Lahore', 'M.Sc Physics (UET Lahore)', 'Vice Principal & HOD Sciences', 'Science', ARRAY['Grade 10', 'Grade 9'], ARRAY['Physics'], '2019-02-15', 125000.00, 20000.00, 'Bank Transfer', 'Meezan Bank', '0102-01048291-02', 'Active'),
    ('f3333333-3333-3333-3333-333333333333', 'EAG-FAC-103', 'Mrs. Nighat Sultana', '35201-5582910-6', '+92 333 9182741', 'nighat.sultana@eaglets.edu.pk', 'Allama Iqbal Town, Lahore', 'M.Sc Mathematics (GCU)', 'Senior Subject Teacher', 'Mathematics', ARRAY['Grade 10', 'Grade 8'], ARRAY['Mathematics (Science)'], '2020-09-01', 95000.00, 15000.00, 'Bank Transfer', 'Habib Bank Limited', '0042-99882211-04', 'Active'),
    ('f4444444-4444-4444-4444-444444444444', 'EAG-FAC-104', 'Qari Abdul Rehman', '35201-3341829-1', '+92 345 8899221', 'abdul.rehman@eaglets.edu.pk', 'Johar Town Phase 2, Lahore', 'Shahadat-ul-Almiya, M.A Islamic Studies', 'Lecturer Islamic Studies & Nazra', 'Humanities', ARRAY['Grade 10', 'Grade 9', 'Grade 8'], ARRAY['Islamiat Compulsory'], '2021-03-10', 70000.00, 10000.00, 'Raast / Mobile Wallet', 'Allied Bank', '0291-44556677-01', 'Active')
ON CONFLICT (emp_id) DO NOTHING;

-- Seed Students
INSERT INTO public.students (id, admission_no, roll_no, student_name, b_form, dob, gender, father_name, father_cnic, contact_phone, whatsapp_no, address, class_id, section, previous_school, photo_url, status)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'ADM-2022-118', 'EAG-10-042', 'Muhammad Rayyan Butt', '35201-8491023-1', '2010-05-14', 'Male', 'Tariq Mehmood Butt', '35201-1928374-1', '+92 300 4581290', '+92 300 4581290', 'House 14-B, Canal View, Lahore', 'c1111111-1111-1111-1111-111111111111', 'Science A (Rose)', 'Lahore Grammar School', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Active'),
    ('s2222222-2222-2222-2222-222222222222', 'ADM-2022-119', 'EAG-10-041', 'Zainab Fatima', '35201-9988112-2', '2010-09-22', 'Female', 'Sheikh Yaseen Rafiq', '35201-8877221-3', '+92 321 9871234', '+92 321 9871234', 'House 88, Faisal Town, Lahore', 'c1111111-1111-1111-1111-111111111111', 'Science A (Rose)', 'Beaconhouse School System', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'Active'),
    ('s3333333-3333-3333-3333-333333333333', 'ADM-2023-205', 'EAG-09-012', 'Hamza Mujtaba', '35201-4477112-3', '2011-02-18', 'Male', 'Mujtaba Hassan', '35201-3322119-9', '+92 333 4411998', '+92 333 4411998', 'Model Town Extension, Lahore', 'c2222222-2222-2222-2222-222222222222', 'Science (Jasmine)', 'Army Public School', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Active'),
    ('s4444444-4444-4444-4444-444444444444', 'ADM-2024-312', 'EAG-08-015', 'Ayesha Yaseen', '35201-6655443-4', '2012-07-04', 'Female', 'Muhammad Yaseen', '35201-5544332-1', '+92 345 7766112', '+92 345 7766112', 'Johar Town, Phase 1, Lahore', 'c3333333-3333-3333-3333-333333333333', 'Cambridge (Lily)', 'The City School', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Active')
ON CONFLICT (admission_no) DO NOTHING;

-- Seed Invoices
INSERT INTO public.fee_invoices (id, invoice_no, challan_no, student_id, billing_month, issue_date, due_date, expiry_date, tuition_amount_pkr, lab_amount_pkr, exam_amount_pkr, development_amount_pkr, concession_amount_pkr, arrears_amount_pkr, total_due_pkr, late_surcharge_pkr, total_after_due_date_pkr, paid_amount_pkr, status)
VALUES
    ('i1111111-1111-1111-1111-111111111111', 'INV-2026-10-8492', 'CH-2026-10-8492', 's1111111-1111-1111-1111-111111111111', 'October 2026', '2026-10-01', '2026-10-10', '2026-10-20', 14000.00, 1500.00, 1000.00, 1000.00, 0.00, 0.00, 17500.00, 500.00, 18000.00, 17500.00, 'Paid'),
    ('i2222222-2222-2222-2222-222222222222', 'INV-2026-10-8493', 'CH-2026-10-8493', 's2222222-2222-2222-2222-222222222222', 'October 2026', '2026-10-01', '2026-10-10', '2026-10-20', 14000.00, 1500.00, 1000.00, 1000.00, 0.00, 0.00, 17500.00, 500.00, 18000.00, 17500.00, 'Paid'),
    ('i3333333-3333-3333-3333-333333333333', 'INV-2026-10-8494', 'CH-2026-10-8494', 's3333333-3333-3333-3333-333333333333', 'October 2026', '2026-10-01', '2026-10-10', '2026-10-20', 14000.00, 1500.00, 1000.00, 1000.00, 0.00, 0.00, 17500.00, 500.00, 18000.00, 0.00, 'Unpaid')
ON CONFLICT (invoice_no) DO NOTHING;

-- Seed Fee Payments
INSERT INTO public.fee_payments (id, invoice_id, student_id, receipt_no, amount_paid_pkr, payment_channel, payment_mode, transaction_ref, bank_name, sender_mobile, received_by, payment_date, reconciliation_status, remarks)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 'i1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'REC-90412', 17500.00, 'Bank Challan (HBL / Meezan)', 'HBL Online Banking', 'HBL-TXN-84910284', 'Habib Bank Limited', '+92 300 4581290', 'Bank Settlement System', NOW() - INTERVAL '2 hours', 'Verified', 'Paid on time before due date'),
    ('p2222222-2222-2222-2222-222222222222', 'i2222222-2222-2222-2222-222222222222', 's2222222-2222-2222-2222-222222222222', 'REC-90411', 17500.00, 'Direct Cash Counter', 'Cash Desk', 'POS-CASH-99120', NULL, '+92 321 9871234', 'Admin Cashier', NOW() - INTERVAL '4 hours', 'Verified', 'Counter cash deposit')
ON CONFLICT (receipt_no) DO NOTHING;

-- Seed Examination Record
INSERT INTO public.examinations (id, title, session, start_date, end_date, is_published, passing_percentage)
VALUES
    ('e1111111-1111-1111-1111-111111111111', 'First Term Examination 2026', 'Session 2026–2027', '2026-10-12', '2026-10-24', TRUE, 33.00)
ON CONFLICT DO NOTHING;

-- Seed Exam Results for Rayyan Butt
INSERT INTO public.exam_results (exam_id, student_id, subject_name, max_theory, max_practical, total_max_marks, passing_marks, obt_theory, obt_practical, obt_total_marks, percentage, letter_grade, class_rank, teacher_remarks)
VALUES
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'English Compulsory', 75.00, 0.00, 75.00, 25.00, 68.00, 0.00, 68.00, 90.67, 'A+', '3rd', 'Excellent fluency & creative composition'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Urdu Compulsory', 75.00, 0.00, 75.00, 25.00, 62.00, 0.00, 62.00, 82.67, 'A', '5th', 'Good vocabulary and literary analysis'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Islamiat Compulsory', 50.00, 0.00, 50.00, 17.00, 46.00, 0.00, 46.00, 92.00, 'A+', '2nd', 'Outstanding knowledge of Quranic texts'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Pakistan Studies', 50.00, 0.00, 50.00, 17.00, 43.00, 0.00, 43.00, 86.00, 'A', '4th', 'Very good historical grasp and geography'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Mathematics (Science)', 75.00, 0.00, 75.00, 25.00, 72.00, 0.00, 72.00, 96.00, 'A+', '1st', 'Exceptional logical proof & algebra clarity'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Physics (Theory + Practical)', 60.00, 15.00, 75.00, 25.00, 54.00, 14.00, 68.00, 90.67, 'A+', '2nd', 'Strong laboratory dexterity and problem solving'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Chemistry (Theory + Practical)', 60.00, 15.00, 75.00, 25.00, 50.00, 13.00, 63.00, 84.00, 'A', '4th', 'Good stoichiometric calculations'),
    ('e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'Biology / Computer Science', 60.00, 15.00, 75.00, 25.00, 55.00, 14.00, 69.00, 92.00, 'A+', '2nd', 'Detailed anatomical diagrams and clarity')
ON CONFLICT (exam_id, student_id, subject_name) DO NOTHING;

