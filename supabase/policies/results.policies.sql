-- Students can view their own published results
CREATE POLICY "Students view own results" ON results
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM students WHERE user_id = auth.uid()
        )
        AND status = 'published'
    );

-- Staff can view results they entered
CREATE POLICY "Staff view own entered results" ON results
    FOR SELECT USING (
        entered_by = auth.uid()
    );

-- Staff can view results for their classes
CREATE POLICY "Staff view class results" ON results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM class_subjects cs
            WHERE cs.class_id = results.class_id
            AND cs.subject_id = results.subject_id
            AND cs.teacher_id = (SELECT id FROM staff WHERE user_id = auth.uid())
        )
    );

-- Staff can insert results for their classes
CREATE POLICY "Staff insert results" ON results
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM class_subjects cs
            WHERE cs.class_id = results.class_id
            AND cs.subject_id = results.subject_id
            AND cs.teacher_id = (SELECT id FROM staff WHERE user_id = auth.uid())
        )
    );

-- Staff can update their own draft results
CREATE POLICY "Staff update own results" ON results
    FOR UPDATE USING (
        entered_by = auth.uid() AND status = 'draft'
    );

-- Admin can view all results
CREATE POLICY "Admin view all results" ON results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admin can approve/publish results
CREATE POLICY "Admin approve results" ON results
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );