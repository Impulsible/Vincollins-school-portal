CREATE OR REPLACE FUNCTION calculate_gpa(
    student_id_param UUID,
    term_param VARCHAR(20)
)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    total_credits INTEGER;
    total_grade_points DECIMAL(10,2);
    gpa DECIMAL(3,2);
BEGIN
    -- Calculate total credits and grade points
    SELECT 
        SUM(s.credit_units),
        SUM(
            s.credit_units * 
            CASE r.grade
                WHEN 'A' THEN 4.0
                WHEN 'B' THEN 3.5
                WHEN 'C' THEN 3.0
                WHEN 'D' THEN 2.5
                WHEN 'E' THEN 2.0
                ELSE 0.0
            END
        )
    INTO total_credits, total_grade_points
    FROM results r
    JOIN subjects s ON r.subject_id = s.id
    WHERE r.student_id = student_id_param
    AND r.academic_term = term_param
    AND r.status = 'published';

    -- Calculate GPA
    IF total_credits > 0 THEN
        gpa := total_grade_points / total_credits;
    ELSE
        gpa := 0.00;
    END IF;

    RETURN ROUND(gpa, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;