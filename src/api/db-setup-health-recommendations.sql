-- Health Recommendations tables for BMI Tracker application

-- Recommendations categories table
CREATE TABLE IF NOT EXISTS recommendation_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id VARCHAR(36) PRIMARY KEY,
    category_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    content TEXT NOT NULL,
    target_bmi_min FLOAT,
    target_bmi_max FLOAT,
    target_body_fat_min FLOAT,
    target_body_fat_max FLOAT,
    target_sport VARCHAR(50),
    target_activity_level VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES recommendation_categories(id)
);

-- User saved recommendations table
CREATE TABLE IF NOT EXISTS user_saved_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    recommendation_id VARCHAR(36) NOT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE
);

-- User recommendation preferences table
CREATE TABLE IF NOT EXISTS user_recommendation_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    nutrition_enabled TINYINT(1) DEFAULT 1,
    training_enabled TINYINT(1) DEFAULT 1,
    recovery_enabled TINYINT(1) DEFAULT 1,
    mental_enabled TINYINT(1) DEFAULT 1,
    frequency VARCHAR(20) DEFAULT 'weekly',
    detail_level VARCHAR(20) DEFAULT 'detailed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX idx_recommendations_category ON recommendations(category_id);
CREATE INDEX idx_recommendations_target_bmi ON recommendations(target_bmi_min, target_bmi_max);
CREATE INDEX idx_recommendations_target_sport ON recommendations(target_sport);
CREATE INDEX idx_user_saved_recommendations_user ON user_saved_recommendations(user_id);

-- Insert default recommendation categories
INSERT INTO recommendation_categories (name, description, icon) VALUES
('Nutrition', 'Diet, hydration, and nutrient timing recommendations', 'apple'),
('Training', 'Workout plans, exercise selection, and training periodization', 'dumbbell'),
('Recovery', 'Sleep optimization, stress management, and recovery techniques', 'heart'),
('Mental', 'Mental performance strategies and emotional wellness techniques', 'brain');

-- Insert sample recommendations
INSERT INTO recommendations (id, category_id, title, subtitle, content, target_bmi_min, target_bmi_max, target_sport) VALUES
('nutrition-1', 1, 'Protein Optimization', 'Macronutrients', '{"daily_target":"1.8g per kg of body weight","timing":"20-30g every 3-4 hours","sources":"Lean meats, eggs, dairy, legumes"}', 18.5, 30, 'running'),
('nutrition-2', 1, 'Pre-Workout Nutrition', 'Meal Timing', '{"timing":"1-2 hours before workout","composition":"30-40g carbs, 15-20g protein, low fat","examples":"Greek yogurt with berries, oatmeal with protein"}', 18.5, 30, 'general'),
('nutrition-3', 1, 'Optimal Hydration Strategy', 'Hydration', '{"daily_target":"3.5-4 liters total","during_exercise":"500-750ml per hour","electrolytes":"Add for sessions over 60 minutes"}', 18.5, 30, 'general'),
('training-1', 2, 'Progressive Overload Plan', 'Strength Training', '{"frequency":"3-4 strength sessions per week","progression":"Increase weight by 2.5-5% when you can complete all sets","focus":"Compound movements: squats, deadlifts, presses"}', 20, 28, 'weightlifting'),
('training-2', 2, 'Zone 2 Training Protocol', 'Cardio Training', '{"heart_rate":"60-70% of max heart rate (120-140 bpm)","duration":"30-60 minutes per session","frequency":"2-3 sessions per week"}', 18.5, 25, 'running'),
('recovery-1', 3, 'Sleep Optimization Protocol', 'Sleep', '{"duration":"7.5-8.5 hours per night","environment":"Dark room, 65-68°F (18-20°C), minimal noise","routine":"No screens 60 min before bed, relaxation techniques"}', 18.5, 30, 'general'),
('mental-1', 4, 'Performance Visualization', 'Focus', '{"frequency":"5-10 minutes daily","focus_areas":"Technical execution, overcoming challenges","method":"Multi-sensory visualization with emotional engagement"}', 18.5, 30, 'general');

-- Insert sample user recommendation preferences
INSERT INTO user_recommendation_preferences (user_id, nutrition_enabled, training_enabled, recovery_enabled, mental_enabled, frequency, detail_level) VALUES
('user123', 1, 1, 1, 1, 'weekly', 'detailed');

-- Insert sample saved recommendations
INSERT INTO user_saved_recommendations (user_id, recommendation_id) VALUES
('user123', 'nutrition-1'),
('user123', 'recovery-1');
