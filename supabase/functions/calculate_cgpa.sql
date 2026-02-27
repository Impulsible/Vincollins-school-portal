CREATE OR REPLACE FUNCTION calculate_cgpa(
    student_id_param UUID
)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    total_credits INTEGER;
    total_grade_points DECIMAL(10,2);
    cgpa DECIMAL(3,2);
BEGIN
    -- Calculate total credits and grade points across all terms
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
    AND r.status = 'published';

    -- Calculate CGPA
    IF total_credits > 0 THEN
        cgpa := total_grade_points / total_credits;
    ELSE
        cgpa := 0.00;
    END IF;

    RETURN ROUND(cgpa, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;