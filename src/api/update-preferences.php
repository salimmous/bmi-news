<?php
require_once 'db-connect.php';
header('Content-Type: application/json');

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId']) || empty($data['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

if (!isset($data['preferences']) || !is_array($data['preferences'])) {
    echo json_encode(['success' => false, 'message' => 'Preferences are required']);
    exit;
}

// Extract data
$userId = $data['userId'];
$preferences = $data['preferences'];

// Convert boolean values to integers for database storage
$notifications = isset($preferences['notifications']) ? (int)$preferences['notifications'] : 1;
$newsletter = isset($preferences['newsletter']) ? (int)$preferences['newsletter'] : 1;
$darkMode = isset($preferences['darkMode']) ? (int)$preferences['darkMode'] : 0;

try {
    $conn = getDbConnection();
    
    // Check if preferences already exist for this user
    $stmt = $conn->prepare("SELECT user_id FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Update existing preferences
        $stmt = $conn->prepare("UPDATE user_preferences SET notifications = ?, newsletter = ?, dark_mode = ? WHERE user_id = ?");
        $stmt->bind_param("iiis", $notifications, $newsletter, $darkMode, $userId);
    } else {
        // Insert new preferences
        $stmt = $conn->prepare("INSERT INTO user_preferences (user_id, notifications, newsletter, dark_mode) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("siii", $userId, $notifications, $newsletter, $darkMode);
    }
    
    $stmt->execute();
    
    if ($stmt->affected_rows > 0 || $stmt->errno === 0) {
        echo json_encode(['success' => true, 'message' => 'Preferences updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update preferences']);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
