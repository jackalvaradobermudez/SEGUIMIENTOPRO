-- ============================================================
-- BILLING — Plan PRO vía Wompi
-- ============================================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS payment_transactions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id           UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    reference             TEXT NOT NULL UNIQUE,
    wompi_transaction_id  TEXT,
    amount_in_cents       BIGINT NOT NULL,
    currency              TEXT NOT NULL DEFAULT 'COP',
    status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'voided', 'error')),
    plan                  TEXT NOT NULL DEFAULT 'pro',
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_business_id ON payment_transactions(business_id);

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY payment_transactions_policy ON payment_transactions FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
