-- PostgreSQL function to generate staff ID in the database

CREATE OR REPLACE FUNCTION generate_staff_id(
    dept_code VARCHAR DEFAULT NULL,
    join_year INTEGER DEFAULT NULL
)
RETURNS VARCHAR AS $$
DECLARE
    year_prefix VARCHAR(4);
    sequence_num INTEGER;
    new_staff_id VARCHAR(50);
    dept_part VARCHAR(3);
BEGIN
    -- Get year (provided or current)
    IF join_year IS NULL THEN
        year_prefix := TO_CHAR(CURRENT_DATE, 'YYYY');
    ELSE
        year_prefix := join_year::TEXT;
    END IF;
    
    -- Get department code part
    IF dept_code IS NOT NULL THEN
        dept_part := UPPER(LEFT(dept_code, 3));
    END IF;
    
    -- Get next sequence number
    IF dept_code IS NOT NULL THEN
        -- With department: count IDs for this year and department
        SELECT COALESCE(MAX(CAST(SUBSTRING(staff_number FROM '(\d{4})$' AS INTEGER)), 0) + 1
        INTO sequence_num
        FROM staff
        WHERE staff_number LIKE 'VSP-STF-' || dept_part || '-' || year_prefix || '-%';
        
        -- Format: VSP-STF-DEPT-YYYY-XXXX
        new_staff_id := 'VSP-STF-' || dept_part || '-' || year_prefix || '-' || LPAD(sequence_num::TEXT, 4, '0');
    ELSE
        -- Without department: count all IDs for this year
        SELECT COALESCE(MAX(CAST(SUBSTRING(staff_number FROM '(\d{4})$' AS INTEGER)), 0) + 1
        INTO sequence_num
        FROM staff
        WHERE staff_number LIKE 'VSP-STF-' || year_prefix || '-%';
        
        -- Format: VSP-STF-YYYY-XXXX
        new_staff_id := 'VSP-STF-' || year_prefix || '-' || LPAD(sequence_num::TEXT, 4, '0');
    END IF;
    
    RETURN new_staff_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simplified version (5-digit sequential)
CREATE OR REPLACE FUNCTION generate_simplified_staff_id()
RETURNS VARCHAR AS $$
DECLARE
    sequence_num INTEGER;
    new_staff_id VARCHAR(50);
BEGIN
    -- Get next global sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(staff_number FROM '(\d{5})$' AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM staff
    WHERE staff_number LIKE 'VSP-STF-%';
    
    -- Format: VSP-STF-XXXXX
    new_staff_id := 'VSP-STF-' || LPAD(sequence_num::TEXT, 5, '0');
    
    RETURN new_staff_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate staff ID format
CREATE OR REPLACE FUNCTION validate_staff_id(staff_id VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check standard format: VSP-STF-YYYY-XXXX
    IF staff_id ~ '^VSP-STF-\d{4}-\d{4}$' THEN
        RETURN TRUE;
    END IF;
    
    -- Check department format: VSP-STF-[A-Z]{2,3}-\d{4}-\d{4}
    IF staff_id ~ '^VSP-STF-[A-Z]{2,3}-\d{4}-\d{4}$' THEN
        RETURN TRUE;
    END IF;
    
    -- Check simplified format: VSP-STF-\d{5}
    IF staff_id ~ '^VSP-STF-\d{5}$' THEN
        RETURN TRUE;
    END IF;
    
    -- Check legacy format: VSP-STF-L-\d{4}-\d{4}
    IF staff_id ~ '^VSP-STF-L-\d{4}-\d{4}$' THEN
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract year from staff ID
CREATE OR REPLACE FUNCTION extract_staff_year(staff_id VARCHAR)
RETURNS INTEGER AS $$
BEGIN
    -- For standard format
    IF staff_id ~ '^VSP-STF-\d{4}-\d{4}$' THEN
        RETURN SUBSTRING(staff_id FROM 'VSP-STF-(\d{4})-\d{4}$')::INTEGER;
    END IF;
    
    -- For department format
    IF staff_id ~ '^VSP-STF-[A-Z]{2,3}-\d{4}-\d{4}$' THEN
        RETURN SUBSTRING(staff_id FROM 'VSP-STF-[A-Z]{2,3}-(\d{4})-\d{4}$')::INTEGER;
    END IF;
    
    -- For legacy format
    IF staff_id ~ '^VSP-STF-L-\d{4}-\d{4}$' THEN
        RETURN SUBSTRING(staff_id FROM 'VSP-STF-L-(\d{4})-\d{4}$')::INTEGER;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to extract department from staff ID
CREATE OR REPLACE FUNCTION extract_staff_department(staff_id VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
    -- For department format
    IF staff_id ~ '^VSP-STF-([A-Z]{2,3})-\d{4}-\d{4}$' THEN
        RETURN SUBSTRING(staff_id FROM 'VSP-STF-([A-Z]{2,3})-\d{4}-\d{4}$');
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate bulk staff IDs
CREATE OR REPLACE FUNCTION generate_bulk_staff_ids(
    count INTEGER,
    dept_code VARCHAR DEFAULT NULL,
    start_year INTEGER DEFAULT NULL
)
RETURNS TABLE(staff_id VARCHAR) AS $$
DECLARE
    i INTEGER;
BEGIN
    FOR i IN 1..count LOOP
        RETURN QUERY SELECT generate_staff_id(dept_code, start_year);
    END LOOP;
END;
$$ LANGUAGE plpgsql;