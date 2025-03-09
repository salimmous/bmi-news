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
<p>Log in to view your complete meal plan with nutritional information.</p>
<p>Best regards,<br>The BMI Tracker Team</p>', NOW(), NOW());