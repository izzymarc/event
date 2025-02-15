-- Add event_type to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Enhance milestones table to include payment_amount
ALTER TABLE milestones ADD COLUMN IF NOT EXISTS payment_amount NUMERIC CHECK (payment_amount >= 0) DEFAULT 0;
ALTER TABLE milestones ALTER COLUMN due_date SET NOT NULL;
ALTER TABLE milestones ALTER COLUMN payment_amount SET NOT NULL;
