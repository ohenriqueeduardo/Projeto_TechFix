-- Schema de Banco de Dados Relacional - TechFix
-- SGBD Recomendado: PostgreSQL

-- Habilitar extensões úteis se necessário (por exemplo, para UUIDs em produção)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--------------------------------------------------------------------------------
-- 1. TABELA: users (Clientes, Profissionais, Administradores)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'professional', 'admin')),
    avatar VARCHAR(500),
    level VARCHAR(50), -- Nível de acesso/privilégio (Ex: 'Adamantium' para Admin)
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON COLUMN users.id IS 'Identificador do usuário. Em produção, sugere-se UUID.';
COMMENT ON COLUMN users.role IS 'Funções permitidas no sistema: client, professional, admin.';
COMMENT ON COLUMN users.level IS 'Identificação de nível de privilégio (ex: nível de fidelidade ou administrativo).';

--------------------------------------------------------------------------------
-- 2. TABELA: professionals (Extensão de users - Herança 1:1)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professionals (
    user_id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 0.0 NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
    review_count INTEGER DEFAULT 0 NOT NULL CHECK (review_count >= 0),
    jobs INTEGER DEFAULT 0 NOT NULL CHECK (jobs >= 0),
    years_experience INTEGER DEFAULT 0 NOT NULL CHECK (years_experience >= 0),
    satisfaction INTEGER DEFAULT 100 NOT NULL CHECK (satisfaction >= 0 AND satisfaction <= 100),
    bio TEXT
);

COMMENT ON TABLE professionals IS 'Tabela de especialização de usuários com perfil profissional.';

--------------------------------------------------------------------------------
-- 3. TABELA: professional_portfolio_items (Galeria de imagens do profissional)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professional_portfolio_items (
    id SERIAL PRIMARY KEY,
    professional_id VARCHAR(50) NOT NULL REFERENCES professionals(user_id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL
);

--------------------------------------------------------------------------------
-- 4. TABELA: services (Serviços cadastrados pelos profissionais)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.0),
    duration VARCHAR(20) NOT NULL, -- Ex: "2h", "1h30"
    rating NUMERIC(3, 2) DEFAULT 0.0 NOT NULL CHECK (rating >= 0.0 AND rating <= 5.0),
    professional_id VARCHAR(50) NOT NULL REFERENCES professionals(user_id) ON DELETE CASCADE,
    badge VARCHAR(50), -- Destaques como 'Mais Vendido', 'Recomendado'
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--------------------------------------------------------------------------------
-- 5. TABELA: service_tags (Relações n:m de tags dos serviços)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS service_tags (
    service_id VARCHAR(50) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (service_id, tag)
);

--------------------------------------------------------------------------------
-- 6. TABELA: orders (Contratações de serviços/Pedidos)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- Código humanizado ex: 'TF-2024-00842'
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE RESTRICT,
    service_title VARCHAR(150) NOT NULL, -- Histórico: armazena o título na data da compra
    client_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    professional_id VARCHAR(50) NOT NULL REFERENCES professionals(user_id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0.0), -- Histórico: armazena o preço cobrado na data da compra
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('pix', 'debit', 'credit')),
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

COMMENT ON COLUMN orders.service_title IS 'Título redundante e histórico para evitar que alterações no serviço afetem o pedido passado.';
COMMENT ON COLUMN orders.price IS 'Preço cobrado historicamente pelo pedido, mesmo se o preço do serviço mudar posteriormente.';

--------------------------------------------------------------------------------
-- 7. TABELA: transactions (Histórico financeiro para os profissionais/plataforma)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    professional_id VARCHAR(50) REFERENCES professionals(user_id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    title VARCHAR(255) NOT NULL,
    value NUMERIC(10, 2) NOT NULL CHECK (value >= 0.0),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--------------------------------------------------------------------------------
-- 8. TABELA: reviews (Avaliações dos serviços prestados)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(50) PRIMARY KEY,
    service_id VARCHAR(50) NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    professional_id VARCHAR(50) NOT NULL REFERENCES professionals(user_id) ON DELETE CASCADE,
    client_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--------------------------------------------------------------------------------
-- 9. TABELA: review_tags (Relações n:m de tags para as avaliações)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS review_tags (
    review_id VARCHAR(50) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    PRIMARY KEY (review_id, tag)
);

--------------------------------------------------------------------------------
-- 10. TABELA: messages (Conversas e chats diretos entre Clientes e Profissionais)
--------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    time TIME NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

--------------------------------------------------------------------------------
-- ÍNDICES RECOMENDADOS PARA PERFORMANCE
--------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_professional ON services(professional_id);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_professional ON orders(professional_id);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_transactions_professional ON transactions(professional_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_professional ON reviews(professional_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
