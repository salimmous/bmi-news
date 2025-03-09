<?php
/**
 * Get health recommendations
 * 
 * This API endpoint retrieves health recommendations based on category and language
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
if (!isset($_GET['category'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required parameter: category']);
    exit();
}

// Get parameters
$category = $_GET['category'];
$language = isset($_GET['lang']) ? $_GET['lang'] : 'en';

// Include database connection
require_once 'db-connect.php';

try {
    // Prepare and execute query
    $stmt = $conn->prepare(
        "SELECT r.id, r.title, r.subtitle, r.content, r.target_bmi_min, r.target_bmi_max, 
                r.target_body_fat_min, r.target_body_fat_max, r.target_sport, r.target_activity_level, 
                c.name as category_name, c.icon as category_icon
         FROM recommendations r
         JOIN recommendation_categories c ON r.category_id = c.id
         WHERE c.name = ? OR r.id LIKE ?"
    );
    
    $categoryParam = ucfirst(strtolower($category));
    $idPattern = strtolower($category) . "-%";
    $stmt->bind_param("ss", $categoryParam, $idPattern);
    $stmt->execute();
    
    // Get result
    $result = $stmt->get_result();
    $recommendations = [];
    
    while ($row = $result->fetch_assoc()) {
        // Parse JSON content if it's stored as JSON
        if (isset($row['content']) && $row['content'][0] === '{') {
            $row['content'] = json_decode($row['content'], true);
        }
        
        $recommendations[] = $row;
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'recommendations' => $recommendations,
        'count' => count($recommendations),
        'category' => $category,
        'language' => $language
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
