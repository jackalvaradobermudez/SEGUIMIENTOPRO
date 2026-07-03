-- ============================================================
-- SeguimientoPro — Schema v1.0
-- Generado: 2026-07-03
-- Auth: Manejado por Supabase Auth (auth.users)
-- ============================================================

-- ============================================================
-- BUSINESSES: Multi-negocio por usuario
-- ============================================================
CREATE TABLE IF NOT EXISTS businesses (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    currency        TEXT NOT NULL DEFAULT 'COP',
    timezone        TEXT NOT NULL DEFAULT 'America/Bogota',
    logo_url        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    company         TEXT,
    id_number       TEXT,
    birthday        DATE,
    notes           TEXT,
    tags            TEXT[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    sku             TEXT,
    default_price   NUMERIC(15,2) NOT NULL DEFAULT 0,
    cost_price      NUMERIC(15,2),
    unit            TEXT NOT NULL DEFAULT 'unidad',
    track_stock     BOOLEAN NOT NULL DEFAULT FALSE,
    stock           NUMERIC(10,2) DEFAULT 0,
    stock_minimum   NUMERIC(10,2) DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- SALES
-- ============================================================
-- CREATE TYPE no soporta IF NOT EXISTS; se usa DO + duplicate_object para idempotencia
DO $$ BEGIN
    CREATE TYPE sale_status AS ENUM ('paid', 'partial', 'pending', 'overdue', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('cash', 'transfer', 'card', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE TYPE sale_type AS ENUM ('cash', 'credit');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS sales (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    sale_number     SERIAL,
    sale_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    sale_type       sale_type NOT NULL DEFAULT 'cash',
    due_date        DATE,
    installments    INTEGER DEFAULT 1,
    subtotal        NUMERIC(15,2) NOT NULL DEFAULT 0,
    discount        NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount    NUMERIC(15,2) NOT NULL DEFAULT 0,
    paid_amount     NUMERIC(15,2) NOT NULL DEFAULT 0,
    balance         NUMERIC(15,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status          sale_status NOT NULL DEFAULT 'pending',
    payment_method  payment_method_type NOT NULL DEFAULT 'cash',
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- SALE_ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS sale_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id         UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    product_id      UUID REFERENCES products(id) ON DELETE SET NULL,
    description     TEXT NOT NULL,
    quantity        NUMERIC(10,2) NOT NULL DEFAULT 1,
    unit_price      NUMERIC(15,2) NOT NULL,
    subtotal        NUMERIC(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id         UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    amount          NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    payment_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method  payment_method_type NOT NULL DEFAULT 'cash',
    receipt_number  TEXT,
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- COLLECTION_ACTIONS (diferenciador clave)
-- ============================================================
DO $$ BEGIN
    CREATE TYPE collection_type AS ENUM ('call', 'whatsapp', 'sms', 'visit', 'email', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
    CREATE TYPE collection_result AS ENUM (
        'promised', 'paid', 'no_answer', 'refused', 'rescheduled', 'partial_payment', 'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS collection_actions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id         UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    client_id       UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    action_type     collection_type NOT NULL,
    action_date     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    result          collection_result,
    promised_date   DATE,
    promised_amount NUMERIC(15,2),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REMINDERS
-- ============================================================
DO $$ BEGIN
    CREATE TYPE reminder_type AS ENUM (
        'birthday', 'collection', 'follow_up', 'meeting', 'custom'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS reminders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    client_id       UUID REFERENCES clients(id) ON DELETE CASCADE,
    sale_id         UUID REFERENCES sales(id) ON DELETE CASCADE,
    reminder_type   reminder_type NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    remind_at       TIMESTAMPTZ NOT NULL,
    is_completed    BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id         UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    period_year         INTEGER NOT NULL,
    period_month        INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    sales_target        NUMERIC(15,2) DEFAULT 0,
    collection_target   NUMERIC(15,2) DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, period_year, period_month)
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_businesses_user ON businesses(user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_business ON clients(business_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_clients_birthday ON clients(business_id, birthday) WHERE deleted_at IS NULL AND birthday IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_business ON products(business_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_business ON sales(business_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_client ON sales(client_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_status ON sales(business_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_sales_due_date ON sales(business_id, due_date) WHERE deleted_at IS NULL AND status IN ('pending', 'partial', 'overdue');
CREATE INDEX IF NOT EXISTS idx_sale_items_sale ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale ON payments(sale_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payments_business_date ON payments(business_id, payment_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_collections_sale ON collection_actions(sale_id);
CREATE INDEX IF NOT EXISTS idx_collections_business ON collection_actions(business_id, action_date);
CREATE INDEX IF NOT EXISTS idx_reminders_business ON reminders(business_id, remind_at) WHERE is_completed = FALSE;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- updated_at automático
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_businesses_updated BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Actualizar paid_amount y status automáticamente al registrar pago
CREATE OR REPLACE FUNCTION update_sale_on_payment()
RETURNS TRIGGER AS $$
DECLARE
    v_total    NUMERIC(15,2);
    v_paid     NUMERIC(15,2);
    v_due_date DATE;
BEGIN
    SELECT total_amount, due_date INTO v_total, v_due_date
    FROM sales WHERE id = COALESCE(NEW.sale_id, OLD.sale_id);

    SELECT COALESCE(SUM(amount), 0) INTO v_paid
    FROM payments
    WHERE sale_id = COALESCE(NEW.sale_id, OLD.sale_id)
      AND deleted_at IS NULL;

    UPDATE sales SET
        paid_amount = v_paid,
        status = CASE
            WHEN v_paid >= v_total THEN 'paid'
            WHEN v_paid > 0 THEN 'partial'
            WHEN v_due_date IS NOT NULL AND v_due_date < CURRENT_DATE THEN 'overdue'
            ELSE 'pending'
        END,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.sale_id, OLD.sale_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_payment_change
    AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_sale_on_payment();

-- Actualizar total_amount desde los items
CREATE OR REPLACE FUNCTION update_sale_total()
RETURNS TRIGGER AS $$
DECLARE
    v_subtotal NUMERIC(15,2);
    v_discount NUMERIC(15,2);
BEGIN
    SELECT COALESCE(SUM(quantity * unit_price), 0) INTO v_subtotal
    FROM sale_items WHERE sale_id = COALESCE(NEW.sale_id, OLD.sale_id);

    SELECT discount INTO v_discount
    FROM sales WHERE id = COALESCE(NEW.sale_id, OLD.sale_id);

    UPDATE sales SET
        subtotal = v_subtotal,
        total_amount = v_subtotal - COALESCE(v_discount, 0),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.sale_id, OLD.sale_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_sale_items_change
    AFTER INSERT OR UPDATE OR DELETE ON sale_items
    FOR EACH ROW EXECUTE FUNCTION update_sale_total();

-- Stock automático
CREATE OR REPLACE FUNCTION update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.product_id IS NOT NULL THEN
        UPDATE products SET
            stock = stock - NEW.quantity,
            updated_at = NOW()
        WHERE id = NEW.product_id AND track_stock = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_stock_update
    AFTER INSERT ON sale_items
    FOR EACH ROW EXECUTE FUNCTION update_stock_on_sale();

-- ============================================================
-- RLS — Row Level Security
-- ============================================================
ALTER TABLE businesses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales            ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders        ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals            ENABLE ROW LEVEL SECURITY;

CREATE POLICY businesses_policy ON businesses FOR ALL USING (user_id = auth.uid());
CREATE POLICY clients_policy ON clients FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY products_policy ON products FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY sales_policy ON sales FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY sale_items_policy ON sale_items FOR ALL USING (sale_id IN (SELECT s.id FROM sales s JOIN businesses b ON s.business_id = b.id WHERE b.user_id = auth.uid()));
CREATE POLICY payments_policy ON payments FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY collection_actions_policy ON collection_actions FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY reminders_policy ON reminders FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
CREATE POLICY goals_policy ON goals FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- ============================================================
-- VISTAS
-- ============================================================

-- Cartera por edades (aging report)
CREATE OR REPLACE VIEW v_aging_report AS
SELECT
    s.business_id,
    s.client_id,
    c.name AS client_name,
    c.phone AS client_phone,
    s.id AS sale_id,
    s.sale_number,
    s.sale_date,
    s.due_date,
    s.total_amount,
    s.paid_amount,
    s.balance,
    CASE WHEN s.due_date IS NOT NULL THEN CURRENT_DATE - s.due_date ELSE 0 END AS days_overdue,
    CASE
        WHEN s.due_date IS NULL OR s.due_date >= CURRENT_DATE THEN 'current'
        WHEN CURRENT_DATE - s.due_date BETWEEN 1 AND 30 THEN '1_30'
        WHEN CURRENT_DATE - s.due_date BETWEEN 31 AND 60 THEN '31_60'
        WHEN CURRENT_DATE - s.due_date BETWEEN 61 AND 90 THEN '61_90'
        WHEN CURRENT_DATE - s.due_date > 90 THEN '90_plus'
    END AS aging_bucket,
    (SELECT ca.action_date FROM collection_actions ca WHERE ca.sale_id = s.id ORDER BY ca.action_date DESC LIMIT 1) AS last_collection_date,
    (SELECT ca.result FROM collection_actions ca WHERE ca.sale_id = s.id ORDER BY ca.action_date DESC LIMIT 1) AS last_collection_result
FROM sales s
JOIN clients c ON s.client_id = c.id
WHERE s.status IN ('pending', 'partial', 'overdue')
  AND s.deleted_at IS NULL AND c.deleted_at IS NULL;

-- Resumen de portfolio
CREATE OR REPLACE VIEW v_portfolio_summary AS
SELECT
    s.business_id,
    COUNT(DISTINCT s.client_id) AS clients_with_debt,
    COUNT(s.id) AS open_sales,
    COALESCE(SUM(s.total_amount), 0) AS total_sold,
    COALESCE(SUM(s.paid_amount), 0) AS total_collected,
    COALESCE(SUM(s.balance), 0) AS total_pending,
    COALESCE(SUM(CASE WHEN s.status = 'overdue' THEN s.balance ELSE 0 END), 0) AS total_overdue,
    COALESCE(SUM(CASE WHEN s.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 THEN s.balance ELSE 0 END), 0) AS due_next_7_days
FROM sales s
WHERE s.deleted_at IS NULL AND s.status != 'cancelled'
GROUP BY s.business_id;

-- Próximos cobros (7 días)
CREATE OR REPLACE VIEW v_upcoming_collections AS
SELECT
    s.business_id, s.id AS sale_id, s.sale_number,
    s.client_id, c.name AS client_name, c.phone AS client_phone,
    s.due_date, s.balance,
    s.due_date - CURRENT_DATE AS days_until_due
FROM sales s
JOIN clients c ON s.client_id = c.id
WHERE s.status IN ('pending', 'partial')
  AND s.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
  AND s.deleted_at IS NULL AND c.deleted_at IS NULL
ORDER BY s.due_date ASC;

-- Cumpleaños próximos
CREATE OR REPLACE VIEW v_upcoming_birthdays AS
SELECT
    c.business_id, c.id AS client_id, c.name, c.phone, c.birthday,
    EXTRACT(MONTH FROM c.birthday) AS birth_month,
    EXTRACT(DAY FROM c.birthday) AS birth_day
FROM clients c
WHERE c.birthday IS NOT NULL AND c.deleted_at IS NULL
  AND (
    (EXTRACT(MONTH FROM c.birthday) = EXTRACT(MONTH FROM CURRENT_DATE)
     AND EXTRACT(DAY FROM c.birthday) >= EXTRACT(DAY FROM CURRENT_DATE))
    OR
    (EXTRACT(MONTH FROM c.birthday) = EXTRACT(MONTH FROM CURRENT_DATE + INTERVAL '1 month')
     AND EXTRACT(DAY FROM c.birthday) <= EXTRACT(DAY FROM CURRENT_DATE))
  );

-- Productos con bajo stock
CREATE OR REPLACE VIEW v_low_stock_products AS
SELECT
    p.business_id, p.id, p.name, p.sku, p.stock, p.stock_minimum,
    p.stock_minimum - p.stock AS units_needed
FROM products p
WHERE p.track_stock = TRUE
  AND p.stock <= p.stock_minimum
  AND p.is_active = TRUE
  AND p.deleted_at IS NULL;
