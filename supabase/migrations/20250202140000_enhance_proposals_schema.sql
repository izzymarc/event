-- Add cover_letter column to proposals table
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS cover_letter TEXT;

-- Create proposal_portfolio_items table to link proposals to portfolio items
CREATE TABLE IF NOT EXISTS proposal_portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    portfolio_item_id UUID NOT NULL REFERENCES portfolio_items(id) ON DELETE CASCADE,
    UNIQUE(proposal_id, portfolio_item_id) -- Ensure a portfolio item is not linked multiple times to the same proposal
);
ALTER TABLE proposal_portfolio_items ENABLE ROW LEVEL SECURITY;
-- RLS policies for proposal_portfolio_items can be added later based on access control requirements