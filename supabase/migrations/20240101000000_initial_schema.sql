-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('student', 'staff', 'admin', 'parent');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE section AS ENUM ('creche', 'nursery', 'primary', 'college');
CREATE TYPE result_status AS ENUM ('draft', 'pending', 'approved', 'published');
CREATE TYPE assignment_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE submission_status AS ENUM ('submitted', 'graded', 'late');
CREATE TYPE cbt_status AS ENUM ('draft', 'scheduled', 'ongoing', 'completed', 'graded');
CREATE TYPE question_type AS ENUM ('objective', 'theory');
CREATE TYPE resource_type AS ENUM ('document', 'video', 'link');
CREATE TYPE resource_status AS ENUM ('draft', 'published');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    class_id UUID,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    address TEXT,
    parent_name VARCHAR(200),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(255),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    current_cgpa DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create staff table
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    staff_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    qualification TEXT,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    address TEXT,
    emergency_contact VARCHAR(20),
    employment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create classes table
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    section section NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    form_teacher_id UUID REFERENCES staff(id),
    capacity INTEGER NOT NULL,
    current_enrollment INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to students
ALTER TABLE students ADD CONSTRAINT fk_students_class 
    FOREIGN KEY (class_id) REFERENCES classes(id);

-- Create subjects table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    section section NOT NULL,
    is_core BOOLEAN DEFAULT false,
    credit_units INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create class_subjects junction table
CREATE TABLE class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES staff(id),
    academic_term VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, subject_id, academic_term)
);

-- Create results table
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    academic_term VARCHAR(20) NOT NULL,
    ca_score DECIMAL(5,2) NOT NULL CHECK (ca_score >= 0 AND ca_score <= 40),
    exam_score DECIMAL(5,2) NOT NULL CHECK (exam_score >= 0 AND exam_score <= 60),
    total_score DECIMAL(5,2) GENERATED ALWAYS AS (ca_score + exam_score) STORED,
    grade VARCHAR(2) NOT NULL,
    remark TEXT,
    entered_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    status result_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES staff(id),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    file_url TEXT,
    total_marks DECIMAL(5,2) NOT NULL,
    status assignment_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignment_submissions table
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_url TEXT,
    comments TEXT,
    marks_obtained DECIMAL(5,2),
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    status submission_status DEFAULT 'submitted',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create timetable_entries table
CREATE TABLE timetable_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES staff(id),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    academic_term VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cbt_exams table
CREATE TABLE cbt_exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    teacher_id UUID REFERENCES staff(id),
    duration_minutes INTEGER NOT NULL,
    total_marks DECIMAL(5,2) NOT NULL,
    pass_mark DECIMAL(5,2) NOT NULL,
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    instructions TEXT,
    status cbt_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cbt_questions table
CREATE TABLE cbt_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES cbt_exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    options JSONB, -- For objective questions: array of options
    correct_answer TEXT, -- For objective: option index/letter, for theory: model answer
    marks DECIMAL(5,2) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cbt_submissions table
CREATE TABLE cbt_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES cbt_exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id),
    answers JSONB NOT NULL,
    objective_score DECIMAL(5,2),
    theory_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    status submission_status DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type resource_type NOT NULL,
    file_url TEXT,
    class_id UUID REFERENCES classes(id),
    subject_id UUID REFERENCES subjects(id),
    uploaded_by UUID REFERENCES users(id),
    status resource_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_staff_staff_number ON staff(staff_number);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX_idx_results_status ON results(status);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_timetable_class ON timetable_entries(class_id, day_of_week);
CREATE INDEX idx_cbt_exams_class ON cbt_exams(class_id, scheduled_start);
CREATE INDEX idx_cbt_submissions_student ON cbt_submissions(student_id, exam_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cbt_exams_updated_at BEFORE UPDATE ON cbt_exams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cbt_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;