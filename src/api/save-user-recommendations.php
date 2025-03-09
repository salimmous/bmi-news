<?php
/**
 * Save user's saved recommendations
 * 
 * This API endpoint saves a user's saved recommendation IDs to the database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate required fields
if (!isset($data['userId']) || !isset($data['recommendationIds'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Include database connection
require_once 'db-connect.php';

try {
    $userId = $data['userId'];
    $recommendationIds = $data['recommendationIds'];
    
    // Begin transaction
    $conn->begin_transaction();
    
    // First, delete existing saved recommendations for this user
    $stmt = $conn->prepare("DELETE FROM user_saved_recommendations WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    // Then insert new saved recommendations
    if (!empty($recommendationIds)) {
        $stmt = $conn->prepare("INSERT INTO user_saved_recommendations (user_id, recommendation_id) VALUES (?, ?)");
        
        foreach ($recommendationIds as $recId) {
            $stmt->bind_param("ss", $userId, $recId);
            $stmt->execute();
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Saved recommendations updated successfully',
        'count' => count($recommendationIds)
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    if ($conn->connect_errno === 0) {
        $conn->rollback();
    }
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} finally {
    // Close connection
    if (isset($conn) && $conn->connect_errno === 0) {
        $conn->close();
    }
}
