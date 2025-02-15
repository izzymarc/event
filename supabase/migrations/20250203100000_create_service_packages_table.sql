-- Create service_packages table
CREATE TABLE IF NOT EXISTS service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL CHECK (price >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_packages table
CREATE POLICY "Service packages are viewable by everyone"
    ON service_packages
    FOR SELECT
    USING (TRUE);

CREATE POLICY "Vendors can manage their own service packages"
    ON service_packages
    FOR ALL
    TO authenticated
    USING (auth.uid() = vendor_id)
    WITH CHECK (auth.uid() = vendor_id);
