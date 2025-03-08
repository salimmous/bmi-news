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

-- Insert some sample meal plans
INSERT INTO meal_plans (name, description, diet_type, calorie_range, protein_percentage, carbs_percentage, fat_percentage, created_at, updated_at)
VALUES 
('Balanced Weight Loss Plan', 'A balanced meal plan for healthy weight loss', 'Balanced', '1500-1800', 30, 40, 30, NOW(), NOW()),
('High Protein Muscle Gain', 'High protein plan for muscle building', 'High Protein', '2500-3000', 40, 40, 20, NOW(), NOW()),
('Keto Weight Loss', 'Low carb, high fat ketogenic diet', 'Keto', '1600-2000', 25, 5, 70, NOW(), NOW()),
('Vegan Balanced Plan', 'Plant-based balanced nutrition', 'Vegan', '1800-2200', 20, 60, 20, NOW(), NOW()),
('Mediterranean Diet', 'Heart-