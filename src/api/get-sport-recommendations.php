<?php
/**
 * Get Sport-Specific Recommendations API Endpoint
 * 
 * This endpoint retrieves health recommendations tailored to specific sports
 * and BMI ranges.
 */

// Define secure access constant
define('SECURE_ACCESS', true);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use GET.'
    ]);
    exit;
}

// Include database connection
require_once __DIR__ . '/db-connect.php';

// Get parameters from query string
$bmi = isset($_GET['bmi']) ? filter_var($_GET['bmi'], FILTER_VALIDATE_FLOAT) : null;
$sportType = isset($_GET['sport_type']) ? filter