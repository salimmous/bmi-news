-- Settings table for storing site configuration
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(50) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (setting_key),
    INDEX (setting_group)
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_group, is_public, created_at, updated_at)
VALUES
-- General settings
('site_name', 'BMI Tracker', 'general', TRUE, NOW(), NOW()),
('site_description', 'Track your Body Mass Index and improve your health', 'general', TRUE, NOW(), NOW()),
('contact_email', 'contact@bmitracker.com', 'general', TRUE, NOW(), NOW()),
('footer_text', '© 2023 BMI Tracker. All rights reserved.', 'general', TRUE, NOW(), NOW()),

-- Social media links
('social_facebook', 'https://facebook.com/bmitracker', 'social', TRUE, NOW(), NOW()),
('social_twitter', 'https://twitter.com/bmitracker', 'social', TRUE, NOW(), NOW()),
('social_instagram', 'https://instagram.com/bmitracker', 'social', TRUE, NOW(), NOW()),
('social_linkedin', 'https://linkedin.com/company/bmitracker', 'social', TRUE, NOW(), NOW()),

-- Appearance settings
('primary_color', '#3b82f6', 'appearance', TRUE, NOW(), NOW()),
('secondary_color', '#10b981', 'appearance', TRUE, NOW(), NOW()),
('font_family', 'Inter', 'appearance', TRUE, NOW(), NOW()),
('dark_mode', '0', 'appearance', TRUE, NOW(), NOW()),

-- Navigation settings
('nav_items', '[{"id":"home","label":"Home","url":"/","isExternal":false,"isVisible":true,"requiresAuth":false,"roles":[]},{"id":"about","label":"About","url":"/about","isExternal":false,"isVisible":true,"requiresAuth":false,"roles":[]},{"id":"dashboard","label":"Dashboard","url":"/pro-dashboard","isExternal":false,"isVisible":true,"requiresAuth":true,"roles":[]},{"id":"admin","label":"Admin Panel","url":"/admin","isExternal":false,"isVisible":true,"requiresAuth":true,"roles":["admin"]}]', 'navigation', TRUE, NOW(), NOW()),
('show_logo', '1', 'navigation', TRUE, NOW(), NOW()),
('logo_alignment', 'left', 'navigation', TRUE, NOW(), NOW()),
('mobile_menu_type', 'slide', 'navigation', TRUE, NOW(), NOW()),
('dark_mode', '0', 'appearance', TRUE, NOW(), NOW()),

-- Layout settings
('show_hero', '1', 'layout', TRUE, NOW(), NOW()),
('show_testimonials', '1', 'layout', TRUE, NOW(), NOW()),
('show_features', '1', 'layout', TRUE, NOW(), NOW()),
('show_blog', '0', 'layout', TRUE, NOW(), NOW()),

-- API settings
('api_enabled', '1', 'api', FALSE, NOW(), NOW()),
('api_rate_limit', '100', 'api', FALSE, NOW(), NOW()),
('webhook_url', '', 'api', FALSE, NOW(), NOW()),
('webhook_secret', '', 'api', FALSE, NOW(), NOW());

-- Create webhooks table for advanced system integration
CREATE TABLE IF NOT EXISTS webhooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    secret_key VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (event_type),
    INDEX (is_active)
);

-- Create API keys table for external app development
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    permissions TEXT,
    last_used_at DATETIME,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (api_key),
    INDEX (is_active)
);

-- Create API request logs table
CREATE TABLE IF NOT EXISTS api_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    api_key_id INT,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    ip_address VARCHAR(45),
    request_data TEXT,
    response_code INT,
    response_time FLOAT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE SET NULL,
    INDEX (endpoint),
    INDEX (created_at)
);

-- Create widgets table for admin and user dashboards
CREATE TABLE IF NOT EXISTS widgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    widget_type VARCHAR(50) NOT NULL,
    dashboard_type ENUM('admin', 'user', 'both') NOT NULL,
    settings TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (widget_type),
    INDEX (dashboard_type),
    INDEX (is_active)
);

-- Create user widget preferences table
CREATE TABLE IF NOT EXISTS user_widgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    widget_id INT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    settings TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (widget_id) REFERENCES widgets(id) ON DELETE CASCADE,
    UNIQUE KEY (user_id, widget_id),
    INDEX (is_enabled)
);