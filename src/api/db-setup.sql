-- Database setup for BMI Tracker application

-- Users table
CREATE TABLE IF NOT EXISTS `bmi_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- BMI records table
CREATE TABLE IF NOT EXISTS `bmi_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `weight` DECIMAL(5,2) NOT NULL,
  `height` DECIMAL(5,2) NOT NULL,
  `bmi` DECIMAL(4,2) NOT NULL,
  `body_fat` DECIMAL(5,2) NULL,
  `muscle_mass` DECIMAL(5,2) NULL,
  `activity_level` ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') NULL,
  `sport_type` VARCHAR(100) NULL,
  `emotional_state` VARCHAR(50) NULL,
  `date` DATE NOT NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `bmi_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings table
CREATE TABLE IF NOT EXISTS `bmi_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NULL,
  `setting_group` VARCHAR(50) DEFAULT 'general',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Email templates table
CREATE TABLE IF NOT EXISTS `bmi_email_templates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Email logs table
CREATE TABLE IF NOT EXISTS `bmi_email_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `recipient` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `template_id` INT NULL,
  `template_name` VARCHAR(100) NULL,
  `status` ENUM('sent', 'failed', 'pending') NOT NULL DEFAULT 'pending',
  `sent_at` TIMESTAMP NULL,
  `error` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`template_id`) REFERENCES `bmi_email_templates`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Webhooks table
CREATE TABLE IF NOT EXISTS `bmi_webhooks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `event_type` VARCHAR(50) NOT NULL,
  `secret_key` VARCHAR(100) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `last_triggered` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Widgets table
CREATE TABLE IF NOT EXISTS `bmi_widgets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `widget_type` VARCHAR(50) NOT NULL,
  `dashboard_type` ENUM('admin', 'user', 'both') NOT NULL DEFAULT 'both',
  `settings` TEXT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User widget preferences
CREATE TABLE IF NOT EXISTS `bmi_user_widgets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `widget_id` INT NOT NULL,
  `is_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `display_order` INT NOT NULL DEFAULT 0,
  `settings` TEXT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `bmi_users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`widget_id`) REFERENCES `bmi_widgets`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `user_widget` (`user_id`, `widget_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Health recommendations table
CREATE TABLE IF NOT EXISTS `bmi_health_recommendations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(50) NOT NULL,
  `bmi_range` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'medium',
  `sport_type` VARCHAR(100) NULL,
  `emotional_factor` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- API keys table
CREATE TABLE IF NOT EXISTS `bmi_api_keys` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `api_key` VARCHAR(100) NOT NULL UNIQUE,
  `api_secret` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `permissions` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `expires_at` TIMESTAMP NULL,
  `last_used_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default email templates
INSERT INTO `bmi_email_templates` (`name`, `subject`, `type`, `content`) VALUES
('Welcome Email', 'Welcome to BMI Tracker!', 'onboarding', '<h1>Welcome to BMI Tracker!</h1><p>Dear {{user.name}},</p><p>Thank you for joining BMI Tracker. We\'re excited to help you on your health journey!</p><p>With our platform, you can:</p><ul><li>Track your BMI and weight over time</li><li>Get personalized health recommendations</li><li>Access professional meal and workout plans</li></ul><p>Get started by logging in and calculating your first BMI measurement.</p><p>Best regards,<br>The BMI Tracker Team</p>'),
('Weekly Progress Report', 'Your Weekly BMI Progress Report', 'report', '<h1>Your Weekly Progress Report</h1><p>Dear {{user.name}},</p><p>Here\'s a summary of your progress this week:</p><ul><li>Current BMI: {{user.currentBMI}}</li><li>BMI Change: {{user.bmiChange}}</li><li>Current Weight: {{user.currentWeight}} kg</li><li>Weight Change: {{user.weightChange}} kg</li></ul><p>{{#if user.isImproving}}Great job! You\'re making progress toward your goal.{{else}}Keep going! Consistency is key to reaching your health goals.{{/if}}</p><p>Log in to view your detailed progress charts and updated recommendations.</p><p>Best regards,<br>The BMI Tracker Team</p>'),
('New Meal Plan Recommendation', 'Your Personalized Meal Plan is Ready', 'recommendation', '<h1>Your Personalized Meal Plan</h1><p>Dear {{user.name}},</p><p>Based on your recent BMI measurements and goals, we\'ve created a personalized meal plan for you.</p><h2>Your {{mealPlan.name}}</h2><p><strong>Daily Calorie Target:</strong> {{mealPlan.calories}} kcal</p><h3>Breakfast</h3><p>{{mealPlan.breakfast}}</p><h3>Lunch</h3><p>{{mealPlan.lunch}}</p><h3>Dinner</h3><p>{{mealPlan.dinner}}</p><h3>Snacks</h3><p>{{mealPlan.snacks}}</p><p>Log in to view your complete meal plan with nutritional information.</p><p>Best regards,<br>The BMI Tracker Team</p>'),
('Sport-Specific BMI Analysis', 'Your Sport-Specific BMI Analysis', 'analysis', '<h1>Your Sport-Specific BMI Analysis</h1><p>Dear {{user.name}},</p><p>We\'ve analyzed your BMI data in relation to your sport ({{user.sport}}).</p><h2>Analysis Results</h2><p><strong>Current BMI:</strong> {{user.currentBMI}}</p><p><strong>Ideal BMI Range for {{user.sport}}:</strong> {{sport.idealBmiRange}}</p><p><strong>Body Fat Percentage:</strong> {{user.bodyFat}}%</p><p><strong>Lean Muscle Mass:</strong> {{user.leanMass}} kg</p><h2>Recommendations</h2><p>{{sport.recommendations}}</p><p>For more detailed analysis and personalized recommendations, please log in to your dashboard.</p><p>Best regards,<br>The BMI Tracker Team</p>');

-- Insert default health recommendations
INSERT INTO `bmi_health_recommendations` (`category`, `bmi_range`, `title`, `description`, `priority`, `sport_type`, `emotional_factor`) VALUES
-- General recommendations
('underweight', '< 18.5', 'Increase Caloric Intake', 'Focus on nutrient-dense foods to gain weight in a healthy way. Include protein-rich foods, healthy fats, and complex carbohydrates in your diet.', 'high', NULL, NULL),
('underweight', '< 18.5', 'Strength Training', 'Incorporate resistance training to build muscle mass. Aim for 2-3 sessions per week focusing on major muscle groups.', 'medium', NULL, NULL),
('normal', '18.5 - 24.9', 'Maintain Balanced Diet', 'Continue with a balanced diet rich in fruits, vegetables, lean proteins, and whole grains to maintain your healthy weight.', 'medium', NULL, NULL),
('normal', '18.5 - 24.9', 'Regular Physical Activity', 'Maintain at least 150 minutes of moderate-intensity exercise per week to support overall health and weight maintenance.', 'medium', NULL, NULL),
('overweight', '25 - 29.9', 'Caloric Deficit', 'Create a moderate caloric deficit through diet and exercise. Aim for 500-750 fewer calories per day to lose 0.5-1 kg per week.', 'high', NULL, NULL),
('overweight', '25 - 29.9', 'Increase Physical Activity', 'Aim for 150-300 minutes of moderate-intensity exercise per week, combining cardio and strength training for optimal results.', 'high', NULL, NULL),
('obese', '>= 30', 'Medical Consultation', 'Consult with healthcare providers for a comprehensive weight management plan. They can provide personalized advice and monitor health markers.', 'high', NULL, NULL),
('obese', '>= 30', 'Gradual Lifestyle Changes', 'Focus on sustainable lifestyle changes rather than quick fixes. Start with small, achievable goals to build momentum.', 'high', NULL, NULL),

-- Sport-specific recommendations
('normal', '18.5 - 24.9', 'Optimal Running Performance', 'Your current BMI is in the ideal range for distance running. Focus on maintaining this weight while increasing your training volume gradually.', 'medium', 'running', NULL),
('normal', '18.5 - 24.9', 'Swimming Nutrition Strategy', 'For swimmers, focus on carbohydrate timing around training sessions to maximize energy availability and recovery.', 'medium', 'swimming', NULL),
('normal', '18.5 - 24.9', 'Cycling Power-to-Weight Ratio', 'Your current BMI supports a good power-to-weight ratio for cycling. Consider specific hill training to further improve this metric.', 'medium', 'cycling', NULL),
('normal', '18.5 - 24.9', 'Basketball Agility Training', 'With your healthy BMI, focus on agility and explosive power training to improve your on-court performance.', 'medium', 'basketball', NULL),
('normal', '18.5 - 24.9', 'Soccer Endurance Building', 'Maintain your current weight while focusing on interval training to build the endurance needed for 90-minute matches.', 'medium', 'soccer', NULL),
('overweight', '25 - 29.9', 'Weightlifting Nutrition', 'Your current BMI may be beneficial for powerlifting. Focus on protein intake and recovery nutrition to support strength gains.', 'medium', 'weightlifting', NULL),
('overweight', '25 - 29.9', 'Football Performance', 'For football players, this BMI range can be appropriate depending on position. Focus on explosive power training and position-specific conditioning.', 'medium', 'football', NULL),

-- Emotional factor recommendations
('normal', '18.5 - 24.9', 'Stress Management Through Exercise', 'Regular physical activity can help reduce stress levels. Consider adding mindful activities like yoga or tai chi to your routine.', 'medium', NULL, 'stressed'),
('normal', '18.5 - 24.9', 'Mood-Boosting Nutrition', 'Include foods rich in omega-3 fatty acids, B vitamins, and complex carbohydrates to support brain health and positive mood.', 'medium', NULL, 'depressed'),
('normal', '18.5 - 24.9', 'Anxiety-Reducing Workouts', 'Low to moderate intensity steady-state cardio can help reduce anxiety levels. Aim for 30 minutes, 3-5 times per week.', 'medium', NULL, 'anxious'),
('overweight', '25 - 29.9', 'Emotional Eating Strategies', 'Develop awareness of emotional eating triggers and create alternative coping strategies like journaling, walking, or calling a friend.', 'high', NULL, 'emotional_eating'),
('overweight', '25 - 29.9', 'Confidence Building Exercise', 'Focus on strength training and skill-based activities that build confidence and provide a sense of accomplishment.', 'medium', NULL, 'low_confidence');

-- Insert default widgets
INSERT INTO `bmi_widgets` (`name`, `description`, `widget_type`, `dashboard_type`, `is_active`, `display_order`) VALUES
('BMI Chart', 'Displays user\'s BMI history chart', 'chart', 'user', 1, 1),
('Weight Tracker', 'Shows weight history and trends', 'chart', 'user', 1, 2),
('Health Tips', 'Displays personalized health recommendations', 'content', 'user', 1, 3),
('Goal Progress', 'Shows progress towards fitness goals', 'progress', 'user', 1, 4),
('Quick Stats', 'Shows key metrics at a glance', 'stats', 'admin', 1, 1),
('Recent Users', 'Displays recently registered users', 'table', 'admin', 1, 2),
('System Health', 'Shows system performance metrics', 'stats', 'admin', 1, 3);
