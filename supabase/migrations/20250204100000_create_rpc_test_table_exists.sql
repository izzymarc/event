-- Create a function to test if a table exists
CREATE OR REPLACE FUNCTION test_table_exists(table_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'  -- Assuming your table is in the public schema
      AND table_name = test_table_exists.table_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated role (adjust if needed)
GRANT EXECUTE ON FUNCTION test_table_exists(TEXT) TO authenticated;
