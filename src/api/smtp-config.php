<?php
/**
 * SMTP Configuration API Endpoint
 * 
 * This endpoint handles saving and retrieving SMTP server configuration.
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include database connection
require_once __DIR__ . '/db-connect.php';

// Handle GET request to retrieve SMTP configuration
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Query to get SMTP settings from the database
        $query = "SELECT setting_key, setting_value FROM bmi_settings WHERE setting_group = 'smtp'";
        $result = executeQuery($query);
        
        if ($result === false) {
            throw new Exception('Failed to retrieve SMTP settings');
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
                    $smtpConfig['password'] = $value; // In a real app, this would be encrypted
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
        
        // Return the configuration
        echo json_encode([
            'success' => true,
            'data' => $smtpConfig
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to retrieve SMTP configuration: ' . $e->getMessage()
        ]);
    }
}

// Handle POST request to save SMTP configuration
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Get JSON data from request body
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        
        if (!$data) {
            throw new Exception('Invalid JSON data');
        }
        
        // Validate required fields
        $requiredFields = ['host', 'port', 'username', 'password', 'from_email', 'from_name', 'encryption', 'auth_method'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                throw new Exception("Missing required field: $field");
            }
        }
        
        // Start a transaction
        $mysqli = beginTransaction();
        
        // Map of settings to save
        $settings = [
            'smtp_host' => $data['host'],
            'smtp_port' => $data['port'],
            'smtp_username' => $data['username'],
            'smtp_password' => $data['password'], // In a real app, this would be encrypted
            'smtp_from_email' => $data['from_email'],
            'smtp_from_name' => $data['from_name'],
            'smtp_encryption' => $data['encryption'],
            'smtp_auth_method' => $data['auth_method']
        ];
        
        // Save each setting using REPLACE INTO to handle both insert and update
        foreach ($settings as $key => $value) {
            $query = "REPLACE INTO bmi_settings (setting_key, setting_value, setting_group) VALUES (?, ?, 'smtp')";
            $result = $mysqli->prepare($query);
            
            if (!$result) {
                throw new Exception('Failed to prepare statement: ' . $mysqli->error);
            }
            
            $result->bind_param('ss', $key, $value);
            
            if (!$result->execute()) {
                throw new Exception('Failed to save setting: ' . $result->error);
            }
            
            $result->close();
        }
        
        // Commit the transaction
        commitTransaction($mysqli);
        
        // Return success response
        echo json_encode([
            'success' => true,
            'message' => 'SMTP configuration saved successfully'
        ]);
        
    } catch (Exception $e) {
        // Rollback transaction if it was started
        if (isset($mysqli)) {
            rollbackTransaction($mysqli);
        }
        
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save SMTP configuration: ' . $e->getMessage()
        ]);
    }
}

// Handle unsupported methods
else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use GET or POST.'
    ]);
}
