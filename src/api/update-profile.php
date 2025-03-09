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
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$profession = $data['profession'] ?? '';
$location = $data['location'] ?? '';
$bio = $data['bio'] ?? '';
$avatar = $data['avatar'] ?? '';

try {
    $conn = getDbConnection();
    
    // Check if email already exists for another user
    if (!empty($email)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->bind_param("ss", $email, $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Email already in use by another account']);
            exit;
        }
    }
    
    // Update user profile
    $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, profession = ?, location = ?, bio = ?, avatar = ? WHERE id = ?");
    $stmt->bind_param("sssssss", $name, $email, $profession, $location, $bio, $avatar, $userId);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0 || $stmt->errno === 0) {
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
