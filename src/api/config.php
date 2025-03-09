<?php
/**
 * Configuration File
 * 
 * This file contains all configuration settings for the BMI Tracker application.
 * Edit this file to match your environment settings.
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Return configuration array
return [
    // Database configuration
    'db' => [
        'host' => 'localhost',      // Database host (usually localhost in cPanel)
        'port' => 3306,             // Database port (usually 3306)
        'username' => '',           // Your cPanel database username
        'password' => '',           // Your cPanel database password
        'database' => '',           // Your database name
        'prefix' => 'bmi_',         // Table prefix
    ],
    
    // Email configuration
    'email' => [
        'smtp_host' => '',          // SMTP server host
        'smtp_port' => 587,          // SMTP server port
        'smtp_username' => '',       // SMTP username
        'smtp_password' => '',       // SMTP password
        'smtp_encryption' => 'tls',  // SMTP encryption (tls, ssl, or none)
        'from_email' => '',          // Default sender email
        'from_name' => 'BMI Tracker' // Default sender name
    ],
    
    // Application settings
    'app' => [
        'name' => 'BMI Tracker',
        'url' => '',                // Your application URL (e.g., https://yourdomain.com)
        'debug' => false,            // Enable debug mode (set to false in production)
        'timezone' => 'UTC',         // Default timezone
        'api_rate_limit' => 100,     // API rate limit (requests per minute)
        'session_lifetime' => 86400, // Session lifetime in seconds (24 hours)
    ],
    
    // Security settings
    'security' => [
        'jwt_secret' => '',          // Secret key for JWT tokens (generate a random string)
        'jwt_expiration' => 3600,     // JWT token expiration time in seconds (1 hour)
        'password_algo' => PASSWORD_BCRYPT, // Password hashing algorithm
        'password_options' => [       // Password hashing options
            'cost' => 12              // Higher cost = more secure but slower
        ],
        'allowed_origins' => ['*'],   // CORS allowed origins (use specific domains in production)
    ]
];
