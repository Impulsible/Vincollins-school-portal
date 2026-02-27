-- Students can view their own data
CREATE POLICY "Students view own data" ON students
    FOR SELECT USING (auth.uid() = user_id);

-- Staff can view students in their classes
CREATE POLICY "Staff view class students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM class_subjects cs
            WHERE cs.class_id = students.class_id
            AND cs.teacher_id = (SELECT id FROM staff WHERE user_id = auth.uid())
        )
    );

-- Admin can view all students
CREATE POLICY "Admin view all students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin can insert/update students
CREATE POLICY "Admin manage students" ON students
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );