<?php
/**
 * Get Professional BMI History API Endpoint
 * 
 * This endpoint retrieves BMI history data with additional professional metrics
 * for a specific user.
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

// Get user ID from query parameters
if (!isset($_GET['user_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required parameter: user_id'
    ]);
    exit;
}

// Sanitize and validate user ID
$userId = filter_var($_GET['user_id'], FILTER_VALIDATE_INT);
if (!$userId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid user ID'
    ]);
    exit;
}

// Optional parameters
$limit = isset($_GET['limit']) ? filter_var($_GET['limit'], FILTER_VALIDATE_INT) : 100;
$offset = isset($_GET['offset']) ? filter_var($_GET['offset'], FILTER_VALIDATE_INT) : 0;
$startDate = isset($_GET['start_date']) ? filter_var($_GET['start_date'], FILTER_SANITIZE_STRING) : null;
$endDate = isset($_GET['end_date']) ? filter_var($_GET['end_date'], FILTER_SANITIZE_STRING) : null;
$sportType = isset($_GET['sport_type']) ? filter_var($_GET['sport_type'], FILTER_SANITIZE_STRING) : null;

// Validate limit and offset
$limit = ($limit && $limit > 0 && $limit <= 1000) ? $limit : 100;
$offset = ($offset && $offset >= 0) ? $offset : 0;

try {
    // Build query conditions
    $conditions = ['user_id = ?'];
    $params = [$userId];
    $types = 'i';
    
    if ($startDate) {
        $conditions[] = 'date >= ?';
        $params[] = $startDate;
        $types .= 's';
    }
    
    if ($endDate) {
        $conditions[] = 'date <= ?';
        $params[] = $endDate;
        $types .= 's';
    }
    
    if ($sportType) {
        $conditions[] = 'sport_type = ?';
        $params[] = $sportType;
        $types .= 's';
    }
    
    // Prepare SQL statement
    $whereClause = implode(' AND ', $conditions);
    $query = "SELECT id, user_id, weight, height, bmi, body_fat, muscle_mass, activity_level, sport_type, emotional_state, date, notes, created_at 
              FROM bmi_records 
              WHERE $whereClause 
              ORDER BY date DESC 
              LIMIT ? OFFSET ?";
    
    // Add limit and offset to parameters
    $params[] = $limit;
    $params[] = $offset;
    $types .= 'ii';
    
    // Execute query
    $records = executeQuery($query, $types, $params);
    
    if ($records === false) {
        // Database error
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to retrieve BMI history'
        ]);
        exit;
    }
    
    // Get total count for pagination
    $countQuery = "SELECT COUNT(*) as total FROM bmi_records WHERE $whereClause";
    $countParams = array_slice($params, 0, -2); // Remove limit and offset
    $countTypes = substr($types, 0, -2); // Remove limit and offset types
    
    $countResult = executeQuery($countQuery, $countTypes, $countParams);
    $total = isset($countResult[0]['total']) ? (int)$countResult[0]['total'] : 0;
    
    // Success response
    echo json_encode([
        'success' => true,
        'data' => [
            'records' => $records,
            'pagination' => [
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
                'has_more' => ($offset + $limit) < $total
            ]
        ]
    ]);
} catch (Exception $e) {
    // Exception handling
    error_log('Error retrieving BMI history: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while retrieving BMI history'
    ]);
}
