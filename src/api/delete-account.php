<?php
require_once 'db-connect.php';
header('Content-Type: application/json');

// Get JSON data from request body
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['userId']) || empty($data['userId'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
    exit;
}

// Extract data
$userId = $data['userId'];

try {
    $conn = getDbConnection();
    
    // Start transaction
    $conn->begin_transaction();
    
    // Delete user preferences
    $stmt = $conn->prepare("DELETE FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    // Delete user history
    $stmt = $conn->prepare("DELETE FROM user_history WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    // Delete user BMI data
    $stmt = $conn->prepare("DELETE FROM bmi_data WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    // Delete professional BMI data
    $stmt = $conn->prepare("DELETE FROM professional_bmi_data WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    // Finally, delete the user
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        // Commit transaction
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Account deleted successfully']);
    } else {
        // Rollback transaction
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Failed to delete account']);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($conn)) {
        $conn->rollback();
    }
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
