-- Database setup script for BMI Tracker

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS bmi_tracker;

-- Use the database
USE bmi_tracker;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(50),
    age INT,
    gender VARCHAR(20),
    fitness_goal VARCHAR(50),
    calories_per_day INT,
    diet_preference VARCHAR(50),
    activity_level VARCHAR(50),
    gym_sessions_per_week INT,
    time_in_gym FLOAT,
    hours_of_sleep FLOAT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (email)
);

-- Create BMI records table
CREATE TABLE IF NOT EXISTS bmi_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bmi FLOAT NOT NULL,
    weight FLOAT NOT NULL,
    height FLOAT NOT NULL,
    body_fat_percentage FLOAT,
    bmr INT,
    tdee INT,
    ideal_weight_min FLOAT,
    ideal_weight_max FLOAT,
    macros_protein INT,
    macros_carbs INT,
    macros_fat INT,
    water_intake INT,
    vo2_max INT,
    record_date DATE NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (record_date)
);

-- Create meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    diet_type VARCHAR(50) NOT NULL,
    calorie_range VARCHAR(50),
    protein_percentage INT,
    carbs_percentage INT,
    fat_percentage INT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (diet_type)
);

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meal_plan_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    calories INT,
    protein INT,
    carbs INT,
    fat INT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    INDEX (meal_plan_id)
);

-- Create workout plans table
CREATE TABLE IF NOT EXISTS workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    fitness_level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    goal VARCHAR(50) NOT NULL,
    sessions_per_week INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (fitness_level),
    INDEX (goal)
);

-- Create workout sessions table
CREATE TABLE IF NOT EXISTS workout_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_plan_id INT NOT NULL,
    day_number INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    focus VARCHAR(100),
    duration_minutes INT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    INDEX (workout_plan_id)
);

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_session_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sets INT,
    reps VARCHAR(50),
    rest_seconds INT,
    notes TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    INDEX (workout_session_id)
);

-- Create progress tracking table
CREATE TABLE IF NOT EXISTS progress_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tracking_date DATE NOT NULL,
    weight FLOAT,
    body_fat_percentage FLOAT,
    chest_cm FLOAT,
    waist_cm FLOAT,
    hips_cm FLOAT,
    arms_cm FLOAT,
    thighs_cm FLOAT,
    notes TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (tracking_date)
);

-- Create user meal plan assignments table
CREATE TABLE IF NOT EXISTS user_meal_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (meal_plan_id)
);

-- Create user workout plan assignments table
CREATE TABLE IF NOT EXISTS user_workout_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workout_plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    INDEX (user_id),
    INDEX (workout_plan_id)
);

-- Create email logs table for tracking email communications
CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    status ENUM('sent', 'failed', 'pending') NOT NULL DEFAULT 'pending',
    sent_at DATETIME,
    error TEXT,
    created_at DATETIME NOT NULL,
    INDEX (recipient),
    INDEX (status),
    INDEX (sent_at)
);

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX (type)
);

-- Create SMTP configuration table
CREATE TABLE IF NOT EXISTS smtp_config (
    id INT AUTO_INCREMENT PRIMARY KEY,
    host VARCHAR(255) NOT NULL,
    port INT NOT NULL DEFAULT 587,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255) NOT NULL,
    encryption ENUM('none', 'ssl', 'tls') NOT NULL DEFAULT 'tls',
    auth_method ENUM('plain', 'login', 'cram-md5') NOT NULL DEFAULT 'plain',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

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

-- Insert some sample meal plans
INSERT INTO meal_plans (name, description, diet_type, calorie_range, protein_percentage, carbs_percentage, fat_percentage, created_at, updated_at)
VALUES 
('Balanced Weight Loss Plan', 'A balanced meal plan for healthy weight loss', 'Balanced', '1500-1800', 30, 40, 30, NOW(), NOW()),
('High Protein Muscle Gain', 'High protein plan for muscle building', 'High Protein', '2500-3000', 40, 40, 20, NOW(), NOW()),
('Keto Weight Loss', 'Low carb, high fat ketogenic diet', 'Keto', '1600-2000', 25, 5, 70, NOW(), NOW()),
('Vegan Balanced Plan', 'Plant-based balanced nutrition', 'Vegan', '1800-2200', 20, 60, 20, NOW(), NOW()),
('Mediterranean Diet', 'Heart-healthy Mediterranean style eating', 'Mediterranean', '1800-2200', 20, 50, 30, NOW(), NOW());

-- Insert default email templates
INSERT INTO email_templates (name, subject, type, content, created_at, updated_at)
VALUES
('Welcome Email', 'Welcome to BMI Tracker!', 'onboarding', '<h1>Welcome to BMI Tracker!</h1>
<p>Dear {{user.name}},</p>
<p>Thank you for joining BMI Tracker. We\'re excited to help you on your health journey!</p>
<p>With our platform, you can:</p>
<ul>
  <li>Track your BMI and weight over time</li>
  <li>Get personalized health recommendations</li>
  <li>Access professional meal and workout plans</li>
</ul>
<p>Get started by logging in and calculating your first BMI measurement.</p>
<p>Best regards,<br>The BMI Tracker Team</p>', NOW(), NOW()),

('Weekly Progress Report', 'Your Weekly BMI Progress Report', 'report', '<h1>Your Weekly Progress Report</h1>
<p>Dear {{user.name}},</p>
<p>Here\'s a summary of your progress this week:</p>
<ul>
  <li>Current BMI: {{user.currentBMI}}</li>
  <li>BMI Change: {{user.bmiChange}}</li>
  <li>Current Weight: {{user.currentWeight}} kg</li>
  <li>Weight Change: {{user.weightChange}} kg</li>
</ul>
<p>{{#if user.isImproving}}
  Great job! You\'re making progress toward your goal.
{{else}}
  Keep going! Consistency is key to reaching your health goals.
{{/if}}</p>
<p>Log in to view your detailed progress charts and updated recommendations.</p>
<p>Best regards,<br>The BMI Tracker Team</p>', NOW(), NOW()),

('New Meal Plan Recommendation', 'Your Personalized Meal Plan is Ready', 'recommendation', '<h1>Your Personalized Meal Plan</h1>
<p>Dear {{user.name}},</p>
<p>Based on your recent BMI measurements and goals, we\'ve created a personalized meal plan for you.</p>
<h2>Your {{mealPlan.name}}</h2>
<p><strong>Daily Calorie Target:</strong> {{mealPlan.calories}} kcal</p>
<h3>Breakfast</h3>
<p>{{mealPlan.breakfast}}</p>
<h3>Lunch</h3>
<p>{{mealPlan.lunch}}</p>
<h3>Dinner</h3>
<p>{{mealPlan.dinner}}</p>
<h3>Snacks</h3>
<p>{{mealPlan.snacks}}</p>
<p>Log in to view your complete meal plan with recipes and shopping list.</p>
<p>Best regards,<br>The BMI Tracker Team</p>', NOW(), NOW());