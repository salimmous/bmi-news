<?php
/**
 * Save Professional BMI Data API Endpoint
 * 
 * This endpoint saves BMI data with additional professional metrics like body fat,
 * sport type, emotional state, etc.
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

// Include database connection
require_once __DIR__ . '/db-connect.php';

// Get JSON data from request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate required fields
if (!isset($data['user_id']) || !isset($data['height']) || !isset($data['weight']) || !isset($data['bmi'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: user_id, height, weight, bmi'
    ]);
    exit;
}

// Sanitize and validate data
$userId = filter_var($data['user_id'], FILTER_VALIDATE_INT);
if (!$userId) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid user ID'
    ]);
    exit;
}

$height = filter_var($data['height'], FILTER_VALIDATE_FLOAT);
$weight = filter_var($data['weight'], FILTER_VALIDATE_FLOAT);
$bmi = filter_var($data['bmi'], FILTER_VALIDATE_FLOAT);

// Optional fields with default values
$bodyFat = isset($data['body_fat']) ? filter_var($data['body_fat'], FILTER_VALIDATE_FLOAT) : null;
$muscleMass = isset($data['muscle_mass']) ? filter_var($data['muscle_mass'], FILTER_VALIDATE_FLOAT) : null;
$activityLevel = isset($data['activity_level']) ? filter_var($data['activity_level'], FILTER_SANITIZE_STRING) : null;
$sportType = isset($data['sport_type']) ? filter_var($data['sport_type'], FILTER_SANITIZE_STRING) : null;
$emotionalState = isset($data['emotional_state']) ? filter_var($data['emotional_state'], FILTER_SANITIZE_STRING) : null;
$date = isset($data['date']) ? filter_var($data['date'], FILTER_SANITIZE_STRING) : date('Y-m-d');
$notes = isset($data['notes']) ? filter_var($data['notes'], FILTER_SANITIZE_STRING) : null;

// Validate activity level if provided
$validActivityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
if ($activityLevel !== null && !in_array($activityLevel, $validActivityLevels)) {
    $activityLevel = null;
}

try {
    // Prepare SQL statement
    $query = "INSERT INTO bmi_records (user_id, weight, height, bmi, body_fat, muscle_mass, activity_level, sport_type, emotional_state, date, notes) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    // Execute query with parameters
    $result = executeQuery(
        $query, 
        'iddddsssss', 
        [
            $userId, 
            $weight, 
            $height, 
            $bmi, 
            $bodyFat, 
            $muscleMass, 
            $activityLevel, 
            $sportType, 
            $emotionalState, 
            $date, 
            $notes
        ]
    );
    
    if ($result && isset($result['insert_id'])) {
        // Success response
        echo json_encode([
            'success' => true,
            'message' => 'BMI data saved successfully',
            'data' => [
                'id' => $result['insert_id'],
                'user_id' => $userId,
                'weight' => $weight,
                'height' => $height,
                'bmi' => $bmi,
                'body_fat' => $bodyFat,
                'muscle_mass' => $muscleMass,
                'activity_level' => $activityLevel,
                'sport_type' => $sportType,
                'emotional_state' => $emotionalState,
                'date' => $date,
                'notes' => $notes
            ]
        ]);
    } else {
        // Database error
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save BMI data'
        ]);
    }
} catch (Exception $e) {
    // Exception handling
    error_log('Error saving BMI data: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while saving BMI data'
    ]);
}
