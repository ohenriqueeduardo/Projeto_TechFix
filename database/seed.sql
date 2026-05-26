-- Dados de Semente (Seed Data) - TechFix
-- SGBD Recomendado: PostgreSQL

-- Certificar de limpar as tabelas antes de popular para evitar violação de UNIQUE constraints
-- (útil para rodar o script múltiplas vezes)
TRUNCATE TABLE messages CASCADE;
TRUNCATE TABLE review_tags CASCADE;
TRUNCATE TABLE reviews CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE service_tags CASCADE;
TRUNCATE TABLE services CASCADE;
TRUNCATE TABLE professional_portfolio_items CASCADE;
TRUNCATE TABLE professionals CASCADE;
TRUNCATE TABLE users CASCADE;

--------------------------------------------------------------------------------
-- 1. POPULANDO A TABELA: users
--------------------------------------------------------------------------------
INSERT INTO users (id, name, email, role, avatar, level, status) VALUES
('u1', 'Sofia Spencer', 'sofia@example.com', 'client', 'https://i.pravatar.cc/150?u=sofia', NULL, 'active'),
('p1', 'Carlos Mendes', 'carlos@example.com', 'professional', 'https://i.pravatar.cc/150?u=carlos', NULL, 'active'),
('p2', 'Diego Faria', 'diego@example.com', 'professional', 'https://i.pravatar.cc/150?u=diego', NULL, 'active'),
('u3', 'Henrique Eduardo', 'admin@techfix.com', 'admin', NULL, 'Adamantium', 'active'),
('u_temp1', 'Mariana Silva', 'mariana@example.com', 'client', 'https://i.pravatar.cc/150?u=mariana', NULL, 'active'),
('u_temp2', 'Pedro Rocha', 'pedro@example.com', 'client', 'https://i.pravatar.cc/150?u=pedro', NULL, 'active'),
('u_temp3', 'Lucas Santos', 'lucas@example.com', 'client', 'https://i.pravatar.cc/150?u=lucas', NULL, 'active');

--------------------------------------------------------------------------------
-- 2. POPULANDO A TABELA: professionals
--------------------------------------------------------------------------------
INSERT INTO professionals (user_id, specialty, city, rating, review_count, jobs, years_experience, satisfaction, bio) VALUES
('p1', 'Técnico em Hardware', 'São Paulo, SP', 4.90, 128, 234, 8, 98, 'Especialista em montagem de PCs Gamer de alto desempenho e manutenção preventiva.'),
('p2', 'Redes e Segurança', 'Rio de Janeiro, RJ', 4.80, 85, 150, 5, 95, 'Configuração de redes domésticas e empresariais, Wi-Fi e segurança digital.');

--------------------------------------------------------------------------------
-- 3. POPULANDO A TABELA: services
--------------------------------------------------------------------------------
INSERT INTO services (id, title, category, description, price, duration, rating, professional_id, badge, image) VALUES
('s1', 'Manutenção Preventiva PC', 'Manutenção', 'Limpeza completa, troca de pasta térmica e otimização de software.', 180.00, '2h', 4.90, 'p1', 'Mais Vendido', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop'),
('s2', 'Montagem Completa PC Gamer', 'Montagem', 'Montagem profissional com cable management e teste de stress.', 350.00, '4h', 5.00, 'p1', NULL, 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop'),
('s3', 'Upgrade de SSD & RAM em Notebook', 'Manutenção', 'Instalação de SSD de alta velocidade e expansão de memória RAM para ganho instantâneo de desempenho.', 250.00, '1h30', 4.80, 'p1', 'Recomendado', 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop'),
('s4', 'Configuração de Rede Wi-Fi Mesh', 'Redes', 'Instalação e otimização de roteadores Wi-Fi Mesh para cobertura total de sinal sem pontos cegos.', 290.00, '3h', 4.90, 'p2', NULL, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop'),
('s5', 'Otimização de S.O. & Softwares', 'Software', 'Formatação completa ou limpeza de registro, remoção de lixo digital e reinstalação de sistema operacional.', 150.00, '2h', 4.70, 'p2', NULL, 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop'),
('s6', 'Manutenção Gamer & Refrigeração', 'Manutenção', 'Troca de elastômeros, pasta térmica de alta performance e alinhamento de fans para menor ruído e temperatura.', 200.00, '2h', 5.00, 'p1', 'Destaque', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop'),
('s7', 'Configuração de Impressora & Servidor', 'Redes', 'Instalação física e lógica de impressoras multifuncionais compartilhadas na rede local.', 120.00, '1h', 4.60, 'p2', NULL, 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop'),
('s8', 'Remoção de Malware & Varredura', 'Software', 'Escaneamento profundo, remoção de vírus, trojans, adwares e instalação de proteção antivírus permanente.', 160.00, '1h30', 4.90, 'p2', 'Segurança', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop');

--------------------------------------------------------------------------------
-- 4. POPULANDO A TABELA: service_tags
--------------------------------------------------------------------------------
INSERT INTO service_tags (service_id, tag) VALUES
('s1', 'Limpeza'),
('s1', 'Hardware'),
('s1', 'Otimização'),
('s2', 'Gamer'),
('s2', 'Hardware'),
('s2', 'Performance'),
('s3', 'Upgrade'),
('s3', 'Notebook'),
('s3', 'Velocidade'),
('s4', 'Wi-Fi'),
('s4', 'Mesh'),
('s4', 'Internet'),
('s5', 'Windows'),
('s5', 'Otimização'),
('s5', 'Software'),
('s6', 'Watercooler'),
('s6', 'Repasta'),
('s6', 'Gamer'),
('s7', 'Impressora'),
('s7', 'Rede'),
('s7', 'Escritório'),
('s8', 'Antivírus'),
('s8', 'Segurança'),
('s8', 'Malware');

--------------------------------------------------------------------------------
-- 5. POPULANDO A TABELA: orders
--------------------------------------------------------------------------------
INSERT INTO orders (id, code, service_id, service_title, client_id, professional_id, date, time, status, price, payment_method, address) VALUES
('o1', 'TF-2024-00842', 's1', 'Manutenção Preventiva PC', 'u1', 'p1', '2024-05-20', '14:00:00', 'scheduled', 180.00, 'pix', 'Av. Paulista, 1000 - São Paulo, SP'),
('o2', 'TF-2024-00711', 's3', 'Upgrade de SSD & RAM em Notebook', 'u1', 'p1', '2024-05-10', '10:30:00', 'completed', 250.00, 'credit', 'Av. Paulista, 1000 - São Paulo, SP'),
('o3', 'TF-2024-00609', 's4', 'Configuração de Rede Wi-Fi Mesh', 'u1', 'p2', '2024-05-05', '16:00:00', 'cancelled', 290.00, 'debit', 'Av. Paulista, 1000 - São Paulo, SP'),
('o4', 'TF-2024-00890', 's5', 'Otimização de S.O. & Softwares', 'u1', 'p2', '2024-05-19', '11:00:00', 'in_progress', 150.00, 'pix', 'Av. Paulista, 1000 - São Paulo, SP'),
('o5', 'TF-2024-00912', 's3', 'Upgrade de SSD & RAM em Notebook', 'u_temp1', 'p1', '2024-05-21', '09:00:00', 'pending', 250.00, 'pix', 'Rua Augusta, 450 - Consolação, São Paulo - SP'),
('o6', 'TF-2024-00923', 's2', 'Montagem Completa PC Gamer', 'u_temp2', 'p1', '2024-05-22', '14:30:00', 'scheduled', 350.00, 'credit', 'Av. Rebouças, 1800 - Pinheiros, São Paulo - SP'),
('o7', 'TF-2024-00810', 's5', 'Otimização de S.O. & Softwares', 'u_temp3', 'p1', '2024-05-15', '13:00:00', 'completed', 150.00, 'pix', 'Rua Pamplona, 900 - Jardim Paulista, São Paulo - SP');

--------------------------------------------------------------------------------
-- 6. POPULANDO A TABELA: transactions
--------------------------------------------------------------------------------
INSERT INTO transactions (id, professional_id, type, title, value, date, status) VALUES
('t1', 'p1', 'income', 'Serviço: Upgrade Notebook (Mariana S.)', 250.00, '2024-05-21', 'completed'),
('t2', 'p1', 'income', 'Serviço: Manutenção PC (Sofia S.)', 180.00, '2024-05-20', 'completed'),
('t3', 'p1', 'income', 'Serviço: Otimização S.O. (Lucas S.)', 150.00, '2024-05-15', 'completed'),
('t4', 'p1', 'expense', 'Saque via PIX para Conta Corrente', 300.00, '2024-05-17', 'completed'),
('t5', 'p1', 'expense', 'Saque via PIX para Conta Corrente', 200.00, '2024-05-12', 'completed');

--------------------------------------------------------------------------------
-- 7. POPULANDO A TABELA: messages
--------------------------------------------------------------------------------
INSERT INTO messages (sender_id, receiver_id, text, time, date) VALUES
('p1', 'u1', 'Olá Sofia! Recebi seu pedido de manutenção preventiva.', '10:30:00', '2024-05-20'),
('u1', 'p1', 'Oi Carlos! Que bom. Você consegue vir amanhã à tarde?', '10:32:00', '2024-05-20'),
('p1', 'u1', 'Consigo sim. Por volta das 14h está bom para você?', '10:35:00', '2024-05-20'),
('u1', 'p1', 'Perfeito! Já deixarei tudo pronto aqui.', '10:36:00', '2024-05-20'),
('p1', 'u1', 'Combinado. Até amanhã!', '10:40:00', '2024-05-20');
