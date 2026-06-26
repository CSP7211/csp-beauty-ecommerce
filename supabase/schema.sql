-- CSP Beauty Hyper-Local E-commerce Platform
-- Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==================== CORE TABLES ====================

-- Products table (master catalog, synced from ClickUp source of truth)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL,
    size VARCHAR(50),
    cost_price DECIMAL(10,2) NOT NULL,
    wholesale_price DECIMAL(10,2) NOT NULL,
    margin_percent INT DEFAULT 25,
    stock_status VARCHAR(20) NOT NULL DEFAULT 'In Stock' CHECK (stock_status IN ('In Stock', 'Low Stock', 'On Order')),
    moq INT DEFAULT 1,
    origin VARCHAR(100),
    gs1_barcode VARCHAR(50) UNIQUE,
    clickup_task_id VARCHAR(50),
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands table
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    country VARCHAR(100),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    emoji VARCHAR(10),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== CUSTOMER & ORDERS ====================

-- Customers table (B2B wholesale accounts)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    contact_name VARCHAR(200),
    email VARCHAR(200) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'South Africa',
    postal_code VARCHAR(20),
    vat_number VARCHAR(50),
    kycd_status VARCHAR(20) DEFAULT 'pending' CHECK (kycd_status IN ('pending', 'approved', 'rejected')),
    credit_limit DECIMAL(12,2) DEFAULT 0,
    stripe_customer_id VARCHAR(100),
    clickup_list_id VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal DECIMAL(12,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_country VARCHAR(100),
    shipping_postal VARCHAR(20),
    clickup_task_id VARCHAR(50),
    stripe_payment_intent_id VARCHAR(100),
    stripe_charge_id VARCHAR(100),
    gs1_refs TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    sku VARCHAR(50) NOT NULL,
    product_name VARCHAR(500) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    margin_amount DECIMAL(10,2) NOT NULL,
    gs1_barcode VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== STRIPE LEDGER ====================

-- Stripe payment ledger (audit trail)
CREATE TABLE stripe_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    stripe_payment_intent_id VARCHAR(100) NOT NULL,
    stripe_charge_id VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    card_last4 VARCHAR(4),
    card_brand VARCHAR(20),
    receipt_url TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- ==================== CLICKUP SYNC ====================

-- ClickUp sync log
CREATE TABLE clickup_sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('product', 'order', 'customer')),
    local_id UUID NOT NULL,
    clickup_task_id VARCHAR(50),
    clickup_list_id VARCHAR(50),
    sync_action VARCHAR(20) NOT NULL CHECK (sync_action IN ('create', 'update', 'delete')),
    sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ
);

-- ==================== INVENTORY & AUDIT ====================

-- Inventory movements (stock tracking)
CREATE TABLE inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('inbound', 'outbound', 'adjustment', 'reserved')),
    quantity INT NOT NULL,
    reference_type VARCHAR(20),
    reference_id UUID,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trail (compliance)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    performed_by UUID,
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- ==================== REALTIME SUBSCRIPTIONS ====================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory_movements;

-- ==================== INDEXES ====================

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock_status);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_clickup ON orders(clickup_task_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_stripe_ledger_order ON stripe_ledger(order_id);
CREATE INDEX idx_stripe_ledger_intent ON stripe_ledger(stripe_payment_intent_id);
CREATE INDEX idx_inventory_product ON inventory_movements(product_id);
CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);

-- ==================== FUNCTIONS & TRIGGERS ====================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate order totals automatically
CREATE OR REPLACE FUNCTION calculate_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders 
    SET subtotal = (
        SELECT COALESCE(SUM(quantity * unit_price), 0) 
        FROM order_items 
        WHERE order_id = NEW.order_id
    ),
    total_amount = subtotal + shipping_cost + tax_amount
    WHERE id = NEW.order_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_order_totals AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION calculate_order_totals();

-- Audit trigger
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, performed_at)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, performed_at)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_log (table_name, record_id, action, new_data, performed_at)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER products_audit AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER orders_audit AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER customers_audit AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'CSP-ORD-' || EXTRACT(EPOCH FROM NOW())::BIGINT;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ==================== ROW LEVEL SECURITY (RLS) ====================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- Products: readable by all, writable by admin only
CREATE POLICY "Products readable by all" ON products FOR SELECT USING (true);
CREATE POLICY "Products writable by admin" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Customers: users can only see their own
CREATE POLICY "Customers self access" ON customers FOR ALL USING (auth.uid() = id);

-- Orders: customers see their own, admins see all
CREATE POLICY "Orders customer view" ON orders FOR SELECT USING (
    auth.uid() = customer_id OR auth.role() = 'authenticated'
);
CREATE POLICY "Orders customer insert" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Order items: linked to order policy
CREATE POLICY "Order items view" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.customer_id = auth.uid() OR auth.role() = 'authenticated'))
);

-- ==================== SEED DATA ====================

INSERT INTO categories (name, emoji, sort_order) VALUES
('Fragrance', '🌹', 1),
('Skincare', '✨', 2),
('Makeup', '💄', 3),
('Haircare', '💇', 4),
('Body Care', '🧴', 5),
('Men's Grooming', '🧔', 6),
('Sun Care', '☀️', 7),
('Tools & Brushes', '🖌️', 8),
('Sets & Kits', '🎁', 9);

INSERT INTO brands (name, country) VALUES
('Kiko Milano', 'Italy'), ('Guerlain', 'France'), ('Babor', 'Germany'), 
('Uriage', 'France'), ('Medik8', 'UK'), ('Dior', 'France'), ('Chanel', 'France'),
('Lancôme', 'France'), ('Estée Lauder', 'USA'), ('Clarins', 'France'),
('La Roche-Posay', 'France'), ('Vichy', 'France'), ('CeraVe', 'USA'),
('The Ordinary', 'Canada'), ('Nuxe', 'France'), ('L'Oréal Paris', 'France'),
('Maybelline', 'USA'), ('NYX', 'USA'), ('MAC', 'Canada'), ('Bobbi Brown', 'USA'),
('Tom Ford', 'USA'), ('YSL Beauty', 'France'), ('Givenchy', 'France'),
('Armani Beauty', 'Italy'), ('Shiseido', 'Japan'), ('SK-II', 'Japan'),
('Kiehl's', 'USA'), ('Clinique', 'USA'), ('Origins', 'USA'), ('Aesop', 'Australia');
