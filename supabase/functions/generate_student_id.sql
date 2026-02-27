CREATE OR REPLACE FUNCTION generate_admission_number(
    class_code VARCHAR
)
RETURNS VARCHAR AS $$
DECLARE
    year_prefix VARCHAR(4);
    sequence_num INTEGER;
    new_admission_number VARCHAR(50);
BEGIN
    -- Get current year (last 2 digits)
    year_prefix := TO_CHAR(CURRENT_DATE, 'YY');
    
    -- Get next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(admission_number FROM '\d+$') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM students
    WHERE admission_number LIKE 'VSP-' || year_prefix || '-' || class_code || '-%';
    
    -- Format: VSP-YY-CLASS-XXXX
    new_admission_number := 'VSP-' || year_prefix || '-' || class_code || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_admission_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;