# BMI Tracker Application

## Overview
This is a comprehensive BMI (Body Mass Index) tracking application built with React, TypeScript, and PHP. It features a modern UI with Tailwind CSS and Radix UI components, MySQL database integration, REST API endpoints, webhook support for system integration, and customizable widgets for both admin and user dashboards.

## Features
- BMI calculation and tracking
- User profile management
- Admin dashboard with analytics
- Settings panel for site configuration
- REST API for external app development
- Webhook integration for system events
- Customizable widgets for dashboards
- Responsive design for all devices

## Setup Instructions for Shared Hosting (cPanel)

### Prerequisites
- A shared hosting account with cPanel access
- PHP 7.4 or higher
- MySQL database
- Node.js and npm (for local development)

### Step 1: Database Setup
1. Log in to your cPanel account
2. Navigate to the MySQL Databases section
3. Create a new database (e.g., `bmi_tracker`)
4. Create a new database user with a strong password
5. Add the user to the database with all privileges
6. Note down the database name, username, and password

### Step 2: Upload Files
1. Build the React application locally:
   ```bash
   npm install
   npm run build
   ```
2. In cPanel, navigate to File Manager
3. Create a new directory for your application (e.g., `bmitracker`)
4. Upload the contents of the `dist` directory to your hosting directory
5. Upload the PHP files from the `src/api` directory to a subdirectory (e.g., `api`)

### Step 3: Configure Database Connection
1. Edit each PHP file in the `api` directory to update the database connection parameters:
   ```php
   $host = 'localhost'; // Usually 'localhost' for cPanel
   $dbname = 'your_db_name'; // The database name you created
   $username = 'your_db_username'; // The database user you created
   $password = 'your_db_password'; // The password for the database user
   ```

### Step 4: Create Database Tables
1. In cPanel, navigate to phpMyAdmin
2. Select your database
3. Go to the SQL tab
4. Copy and paste the contents of `src/api/db-setup.sql` and `src/api/settings-table.sql`
5. Click "Go" to execute the SQL and create the tables

### Step 5: Configure Frontend API URL
1. Create a `.env` file in the root of your hosting directory with the following content:
   ```
   VITE_API_BASE_URL=/api
   ```
   Or update it to match your API directory path if different.

### Step 6: Set Up File Permissions
1. In cPanel File Manager, navigate to your uploads directory (e.g., `assets/uploads`)
2. Create this directory if it doesn't exist
3. Right-click on the directory and select "Change Permissions"
4. Set permissions to 755 for directories and 644 for files
5. Ensure the web server has write access to the uploads directory

## API Documentation

### Authentication
The API uses API keys for authentication. To use the API, you need to include your API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
```

### Available Endpoints

#### Site Settings
- `GET /api/site-settings.php` - Get all site settings
- `GET /api/site-settings.php?group=general` - Get settings by group
- `POST /api/site-settings.php` - Update settings

#### API Keys
- `GET /api/api-keys.php?user_id=1` - Get API keys for a user
- `POST /api/api-keys.php` - Create a new API key
- `DELETE /api/api-keys.php?id=1` - Delete an API key

#### Webhooks
- `GET /api/webhooks.php` - Get all webhooks
- `GET /api/webhooks.php?id=1` - Get a webhook by ID
- `POST /api/webhooks.php` - Create a new webhook
- `PUT /api/webhooks.php?id=1` - Update a webhook
- `DELETE /api/webhooks.php?id=1` - Delete a webhook
- `POST /api/webhooks.php` (with trigger=true) - Trigger a webhook

#### Widgets
- `GET /api/widgets.php` - Get all widgets
- `GET /api/widgets.php?dashboard_type=admin` - Get widgets by dashboard type
- `GET /api/widgets.php?id=1` - Get a widget by ID
- `POST /api/widgets.php` - Create a new widget
- `PUT /api/widgets.php?id=1` - Update a widget
- `DELETE /api/widgets.php?id=1` - Delete a widget

#### User Widgets
- `GET /api/widgets.php?user_id=1` - Get user widget preferences
- `POST /api/widgets.php` (with user_id and widgets) - Update user widget preferences

## Webhook Integration

Webhooks allow external applications to receive real-time notifications when certain events occur in the BMI Tracker application.

### Available Events
- `user.created` - Triggered when a new user is created
- `user.updated` - Triggered when a user profile is updated
- `bmi.recorded` - Triggered when a new BMI record is saved
- `goal.achieved` - Triggered when a user achieves a fitness goal

### Webhook Payload
Webhooks send a JSON payload with the following structure:

```json
{
  "event": "bmi.recorded",
  "timestamp": "2023-06-15T14:30:00Z",
  "data": {
    "user_id": 123,
    "bmi": 22.5,
    "weight": 70.5,
    "height": 175.0
  }
}
```

### Webhook Security
Webhooks include a signature header (`X-BMI-Tracker-Signature`) that you can use to verify the authenticity of the webhook request. The signature is generated using HMAC-SHA256 with your webhook secret key.

## Widget System

The BMI Tracker application includes a flexible widget system that allows administrators and users to customize their dashboards.

### Available Widgets
- BMI History Chart
- Weight Tracker
- Goal Progress
- Nutrition Summary
- Workout Schedule
- Water Intake Tracker
- Sleep Quality Monitor
- Activity Heatmap

### Widget Configuration
Each widget can be configured with custom settings, enabled/disabled, and arranged in a specific order on the dashboard.

## Troubleshooting

### API Connection Issues
- Verify that your database credentials are correct
- Check that the PHP version on your hosting is compatible (PHP 7.4+)
- Ensure that the API directory has the correct permissions
- Check the server error logs for any PHP errors

### File Upload Problems
- Verify that the uploads directory exists and has write permissions
- Check that the PHP `upload_max_filesize` and `post_max_size` settings are sufficient
- Ensure that the web server user has write access to the uploads directory

### Database Connection Errors
- Confirm that your database user has the necessary privileges
- Check if the database server is running and accessible
- Verify that the database name is correct
- Try connecting to the database using phpMyAdmin to test credentials

## Support

If you encounter any issues or have questions about setting up the BMI Tracker application, please contact our support team at support@bmitracker.com.
