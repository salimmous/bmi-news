<?php
/**
 * Get user's saved recommendations
 * 
 * This API endpoint retrieves a user's saved recommendation IDs from the database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Validate required parameters
if (!isset($_GET['userId'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required parameter: userId']);
    exit();
}

// Include database connection
require_once 'db-connect.php';

try {
    $userId = $_GET['userId'];
    
    // Prepare and execute query
    $stmt = $conn->prepare("SELECT recommendation_id FROM user_saved_recommendations WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    // Get result
    $result = $stmt->get_result();
    $recommendationIds = [];
    
    while ($row = $result->fetch_assoc()) {
        $recommendationIds[] = $row['recommendation_id'];
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'recommendationIds' => $recommendationIds,
        'count' => count($recommendationIds)
    ]);
    
} catch (Exception $e) {
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
