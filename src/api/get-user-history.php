<?php
require_once 'db-connect.php';
header('Content-Type: application/json');

// Get user ID from query parameter
if (!isset($_GET['userId']) || empty($_GET['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

$userId = $_GET['userId'];

try {
    $conn = getDbConnection();
    
    // Get user history
    $stmt = $conn->prepare("SELECT id, type, date, details, saved FROM user_history WHERE user_id = ? ORDER BY date DESC LIMIT 20");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $history = [];
    while ($row = $result->fetch_assoc()) {
        // Parse JSON details
        $details = json_decode($row['details'], true);
        
        $history[] = [
            'id' => $row['id'],
            'type' => $row['type'],
            'date' => $row['date'],
            'details' => $details,
            'saved' => (bool)$row['saved']
        ];
    }
    
    echo json_encode(['success' => true, 'history' => $history]);
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
