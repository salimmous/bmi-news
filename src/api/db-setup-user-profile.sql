-- User profile tables for BMI Tracker application

-- Users table (extend existing users table if needed)
ALTER TABLE users
ADD COLUMN bio TEXT DEFAULT NULL,
ADD COLUMN profession VARCHAR(100) DEFAULT NULL,
ADD COLUMN location VARCHAR(100) DEFAULT NULL,
ADD COLUMN avatar VARCHAR(255) DEFAULT NULL,
ADD COLUMN last_login DATETIME DEFAULT CURRENT_TIMESTAMP;

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    notifications TINYINT(1) DEFAULT 1,
    newsletter TINYINT(1) DEFAULT 1,
    dark_mode TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User history table
CREATE TABLE IF NOT EXISTS user_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    details JSON,
    saved TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    streak INT DEFAULT 0,
    last_activity_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_user_history_type ON user_history(type);
CREATE INDEX idx_user_history_date ON user_history(date);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

-- Sample data for testing
INSERT INTO user_preferences (user_id, notifications, newsletter, dark_mode)
VALUES ('user123', 1, 1, 0);

INSERT INTO user_stats (user_id, streak, last_activity_date)
VALUES ('user123', 7, CURRENT_DATE());

-- Sample history items
INSERT INTO user_history (id, user_id, type, date, details, saved)
VALUES 
('hist1', 'user123', 'bmi_calculation', '2023-08-09 14:30:00', '{"height": 175, "weight": 70, "bmi": 22.9, "category": "Normal weight"}', 1),
('hist2', 'user123', 'sport_bmi_calculation', '2023-08-07 10:15:00', '{"height": 175, "weight": 70, "sport": "running", "bmi": 22.9, "sportSpecificCategory": "Optimal"}', 1),
('hist3', 'user123', 'professional_calculation', '2023-08-05 16:45:00', '{"height": 175, "weight": 70, "bodyFat": 15.2, "bmi": 22.9, "bmr": 1680, "tdee": 2520, "sport": "running", "performanceScore": 85}', 1),
('hist4', 'user123', 'bmi_calculation', '2023-08-02 09:20:00', '{"height": 175, "weight": 71, "bmi": 23.2, "category": "Normal weight"}', 0),
('hist5', 'user123', 'professional_calculation', '2023-07-28 11:30:00', '{"height": 175, "weight": 71, "bodyFat": 15.5, "bmi": 23.2, "bmr": 1685, "tdee": 2530, "sport": "running", "performanceScore": 83}', 1);
