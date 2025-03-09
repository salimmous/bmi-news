# BMI Tracker Professional Platform

A comprehensive web application for tracking and analyzing BMI and other fitness metrics with professional features.

## Features

- Standard BMI Calculator
- Sport-Specific BMI Calculator
- Professional BMI Analysis
- User Profiles with History Tracking
- Dark Mode Support
- Health & Performance Recommendations
- Admin Dashboard
- Webhooks Integration

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- MySQL database

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/bmi-tracker.git
   cd bmi-tracker
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   VITE_API_URL=your_api_url
   ```

4. Set up the database
   - Create a MySQL database
   - Import the SQL files from the `src/api` directory:
     - `db-setup.sql`
     - `db-setup-extended.sql`
     - `db-setup-user-profile.sql`
     - `settings-table.sql`
     - `email-logs-table.sql`

5. Configure PHP API
   - Update the database connection details in `src/api/config.php`
   - Ensure the web server has write permissions to the API directory

6. Start the development server
   ```
   npm run dev
   ```

## Dark Mode

The application supports dark mode which can be toggled in the user settings. Dark mode preferences are saved to the user's profile and applied across sessions.

## User Profile

The user profile section allows users to:
- Update personal information
- View calculation history
- Manage account settings
- Configure notification preferences
- Toggle dark mode
- Export personal data
- Manage security settings

## Webhooks

Administrators can configure webhooks in the settings panel to integrate with external services. Webhooks can be triggered for various events such as:

- New user registration
- BMI calculation
- Profile updates
- Report generation

## Health & Performance Recommendations

The platform provides personalized health and performance recommendations based on:

- BMI calculations
- Sport-specific metrics
- User activity level
- Emotional state
- Training goals

Recommendations are categorized into:
- Nutrition
- Training
- Recovery
- Mental & Emotional

Users can customize which types of recommendations they receive and how frequently they are delivered.

## User Roles

- **Regular User**: Access to basic BMI calculations and personal history
- **Professional User**: Access to advanced metrics, sport-specific analysis, and detailed recommendations
- **Administrator**: Full access to all features, user management, and system settings

## License

MIT
