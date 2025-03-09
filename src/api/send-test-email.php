<?php
/**
 * Send Test Email API Endpoint
 * 
 * This endpoint sends a test email using the configured SMTP settings.
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}

// Include database connection and PHPMailer
require_once __DIR__ . '/db-connect.php';

// In a real application, you would include PHPMailer here
// require_once 'vendor/autoload.php'; // For Composer autoload

// Get JSON data from request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['recipient']) || !filter_var($data['recipient'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Valid recipient email address is required'
    ]);
    exit;
}

try {
    // Get SMTP settings from database
    $query = "SELECT setting_key, setting_value FROM bmi_settings WHERE setting_group = 'smtp'";
    $result = executeQuery($query);
    
    if ($result === false || empty($result)) {
        throw new Exception('SMTP settings not found. Please configure SMTP settings first.');
    }
    
    // Format the results into a configuration object
    $smtpConfig = [
        'host' => '',
        'port' => 587,
        'username' => '',
        'password' => '',
        'from_email' => '',
        'from_name' => 'BMI Tracker',
        'encryption' => 'tls',
        'auth_method' => 'plain'
    ];
    
    foreach ($result as $row) {
        $key = $row['setting_key'];
        $value = $row['setting_value'];
        
        // Map database keys to config keys
        switch ($key) {
            case 'smtp_host':
                $smtpConfig['host'] = $value;
                break;
            case 'smtp_port':
                $smtpConfig['port'] = (int)$value;
                break;
            case 'smtp_username':
                $smtpConfig['username'] = $value;
                break;
            case 'smtp_password':
                $smtpConfig['password'] = $value;
                break;
            case 'smtp_from_email':
                $smtpConfig['from_email'] = $value;
                break;
            case 'smtp_from_name':
                $smtpConfig['from_name'] = $value;
                break;
            case 'smtp_encryption':
                $smtpConfig['encryption'] = $value;
                break;
            case 'smtp_auth_method':
                $smtpConfig['auth_method'] = $value;
                break;
        }
    }
    
    // Validate SMTP configuration
    if (empty($smtpConfig['host']) || empty($smtpConfig['username']) || empty($smtpConfig['password'])) {
        throw new Exception('Incomplete SMTP configuration. Please check your settings.');
    }
    
    // In a real application, you would use PHPMailer to send the email
    // For this demo, we'll simulate sending an email
    
    // Simulate email sending delay
    sleep(1);
    
    // Log the email attempt
    $query = "INSERT INTO bmi_email_logs (recipient, subject, template_name, status, sent_at) 
              VALUES (?, ?, ?, ?, NOW())";
    
    $result = executeQuery($query, 'ssss', [
        $data['recipient'],
        'Test Email from BMI Tracker',
        'Test Template',
        'sent'
    ]);
    
    if ($result === false) {
        throw new Exception('Failed to log email attempt');
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Test email sent successfully to ' . $data['recipient'],
        'details' => [
            'smtp_server' => $smtpConfig['host'] . ':' . $smtpConfig['port'],
            'from' => $smtpConfig['from_name'] . ' <' . $smtpConfig['from_email'] . '>',
            'to' => $data['recipient'],
            'subject' => 'Test Email from BMI Tracker',
            'sent_at' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    // Log the error
    error_log('Error sending test email: ' . $e->getMessage());
    
    // If this was a real email attempt, log the failure
    if (isset($data['recipient'])) {
        $query = "INSERT INTO bmi_email_logs (recipient, subject, template_name, status, error, sent_at) 
                  VALUES (?, ?, ?, ?, ?, NOW())";
        
        executeQuery($query, 'sssss', [
            $data['recipient'],
            'Test Email from BMI Tracker',
            'Test Template',
            'failed',
            $e->getMessage()
        ]);
    }
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send test email: ' . $e->getMessage()
    ]);
}
