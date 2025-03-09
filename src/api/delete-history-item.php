<?php
require_once 'db-connect.php';
header('Content-Type: application/json');

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId']) || empty($data['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

if (!isset($data['historyItemId']) || empty($data['historyItemId'])) {
    echo json_encode(['success' => false, 'message' => 'History item ID is required']);
    exit;
}

// Extract data
$userId = $data['userId'];
$historyItemId = $data['historyItemId'];

try {
    $conn = getDbConnection();
    
    // Delete history item
    $stmt = $conn->prepare("DELETE FROM user_history WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ss", $historyItemId, $userId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'History item deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete history item']);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
