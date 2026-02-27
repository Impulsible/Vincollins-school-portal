-- PostgreSQL functions for student ID generation

-- Function to generate standard student ID (VSP-YY-CLASS-XXXX)
CREATE OR REPLACE FUNCTION generate_standard_student_id(
    class_code VARCHAR,
    admission_year INTEGER DEFAULT NULL
)
RETURNS VARCHAR AS $$
DECLARE
    year_suffix VARCHAR(2);
    sequence_num INTEGER;
    new_student_id VARCHAR(50);
BEGIN
    -- Get year suffix
    IF admission_year IS NULL THEN
        year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    ELSE
        year_suffix := SUBSTRING(admission_year::TEXT FROM 3 FOR 2);
    END IF;
    
    -- Get next sequence number for this year and class
    SELECT COALESCE(MAX(CAST(SUBSTRING(admission_number FROM '(\d{4})$' AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM students
    WHERE admission_number LIKE 'VSP-' || year_suffix || '-' || class_code || '-%';
    
    -- Format: VSP-YY-CLASS-XXXX
    new_student_id := 'VSP-' || year_suffix || '-' || class_code || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate year-only student ID (VSP-YY-XXXXX)
CREATE OR REPLACE FUNCTION generate_year_only_student_id(
    admission_year INTEGER DEFAULT NULL
)
RETURNS VARCHAR AS $$
DECLARE
    year_suffix VARCHAR(2);
    sequence_num INTEGER;
    new_student_id VARCHAR(50);
BEGIN
    -- Get year suffix
    IF admission_year IS NULL THEN
        year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    ELSE
        year_suffix := SUBSTRING(admission_year::TEXT FROM 3 FOR 2);
    END IF;
    
    -- Get next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(admission_number FROM '(\d{5})$' AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM students
    WHERE admission_number LIKE 'VSP-' || year_suffix || '-%'
    AND admission_number !~ 'VSP-' || year_suffix || '-[A-Z]+-';
    
    -- Format: VSP-YY-XXXXX
    new_student_id := 'VSP-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 5, '0');
    
    RETURN new_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate section-based student ID (VSP-SEC-YY-XXXX)
CREATE OR REPLACE FUNCTION generate_section_student_id(
    section_code VARCHAR,
    admission_year INTEGER DEFAULT NULL
)
RETURNS VARCHAR AS $$
DECLARE
    year_suffix VARCHAR(2);
    sequence_num INTEGER;
    new_student_id VARCHAR(50);
BEGIN
    -- Get year suffix
    IF admission_year IS NULL THEN
        year_suffix := TO_CHAR(CURRENT_DATE, 'YY');
    ELSE
        year_suffix := SUBSTRING(admission_year::TEXT FROM 3 FOR 2);
    END IF;
    
    -- Get next sequence number for this section and year
    SELECT COALESCE(MAX(CAST(SUBSTRING(admission_number FROM '(\d{4})$' AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM students
    WHERE admission_number LIKE 'VSP-' || section_code || '-' || year_suffix || '-%';
    
    -- Format: VSP-SEC-YY-XXXX
    new_student_id := 'VSP-' || section_code || '-' || year_suffix || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    RETURN new_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Main function to generate student ID based on type
CREATE OR REPLACE FUNCTION generate_student_id(
    id_type VARCHAR DEFAULT 'standard',
    class_or_section_code VARCHAR DEFAULT NULL,
    admission_year INTEGER DEFAULT NULL
)
RETURNS VARCHAR AS $$
BEGIN
    IF id_type = 'standard' THEN
        IF class_or_section_code IS NULL THEN
            RAISE EXCEPTION 'Class code is required for standard format';
        END IF;
        RETURN generate_standard_student_id(class_or_section_code, admission_year);
    ELSIF id_type = 'year-only' THEN
        RETURN generate_year_only_student_id(admission_year);
    ELSIF id_type = 'section' THEN
        IF class_or_section_code IS NULL THEN
            RAISE EXCEPTION 'Section code is required for section format';
        END IF;
        RETURN generate_section_student_id(class_or_section_code, admission_year);
    ELSE
        RAISE EXCEPTION 'Invalid ID type: %', id_type;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate student ID format
CREATE OR REPLACE FUNCTION validate_student_id(student_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Standard format: VSP-YY-CLASS-XXXX
    IF student_id ~ '^VSP-\d{2}-[A-Z0-9]{3,4}-\d{4}$' THEN
        RETURN TRUE;
    END IF;
    
    -- Year-only format: VSP-YY-XXXXX
    IF student_id ~ '^VSP-\d{2}-\d{5}$' THEN
        RETURN TRUE;
    END IF;
    
    -- Section format: VSP-SEC-YY-XXXX
    IF student_id ~ '^VSP-[A-Z]{3}-\d{2}-\d{4}$' THEN
        RETURN TRUE;
    END IF;
    
    -- Legacy format: VSP-L-*
    IF student_id ~ '^VSP-L-.+$' THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract year from student ID
CREATE OR REPLACE FUNCTION extract_student_year(student_id VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    year_part VARCHAR(2);
BEGIN
    -- For standard format
    IF student_id ~ '^VSP-(\d{2})-[A-Z0-9]{3,4}-\d{4}$' THEN
        year_part := SUBSTRING(student_id FROM 'VSP-(\d{2})-[A-Z0-9]{3,4}-\d{4}$');
        RETURN CAST('20' || year_part AS INTEGER);
    END IF;
    
    -- For year-only format
    IF student_id ~ '^VSP-(\d{2})-\d{5}$' THEN
        year_part := SUBSTRING(student_id FROM 'VSP-(\d{2})-\d{5}$');
        RETURN CAST('20' || year_part AS INTEGER);
    END IF;
    
    -- For section format
    IF student_id ~ '^VSP-[A-Z]{3}-(\d{2})-\d{4}$' THEN
        year_part := SUBSTRING(student_id FROM 'VSP-[A-Z]{3}-(\d{2})-\d{4}$');
        RETURN CAST('20' || year_part AS INTEGER);
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract class from student ID
CREATE OR REPLACE FUNCTION extract_student_class(student_id VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    -- For standard format
    IF student_id ~ '^VSP-\d{2}-([A-Z0-9]{3,4})-\d{4}$' THEN
        RETURN SUBSTRING(student_id FROM 'VSP-\d{2}-([A-Z0-9]{3,4})-\d{4}$');
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract section from student ID
CREATE OR REPLACE FUNCTION extract_student_section(student_id VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    -- For section format
    IF student_id ~ '^VSP-([A-Z]{3})-\d{2}-\d{4}$' THEN
        RETURN SUBSTRING(student_id FROM 'VSP-([A-Z]{3})-\d{2}-\d{4}$');
    END IF;
    
    -- For standard format, derive from class code
    IF student_id ~ '^VSP-\d{2}-([A-Z0-9]{3,4})-\d{4}$' THEN
        DECLARE
            class_code VARCHAR := SUBSTRING(student_id FROM 'VSP-\d{2}-([A-Z0-9]{3,4})-\d{4}$');
        BEGIN
            IF class_code LIKE 'CRE%' THEN RETURN 'CRE';
            ELSIF class_code LIKE 'NUR%' THEN RETURN 'NUR';
            ELSIF class_code LIKE 'PRY%' THEN RETURN 'PRY';
            ELSIF class_code LIKE 'JSS%' OR class_code LIKE 'SSS%' THEN RETURN 'COL';
            ELSE RETURN NULL;
            END IF;
        END;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate bulk student IDs
CREATE OR REPLACE FUNCTION generate_bulk_student_ids(
    count INTEGER,
    id_type VARCHAR DEFAULT 'standard',
    class_or_section_code VARCHAR DEFAULT NULL,
    start_year INTEGER DEFAULT NULL
)
RETURNS TABLE(student_id VARCHAR) AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 1..count LOOP
        RETURN QUERY SELECT generate_student_id(id_type, class_or_section_code, start_year);
    END LOOP;
END;
$$ LANGUAGE plpgsql;