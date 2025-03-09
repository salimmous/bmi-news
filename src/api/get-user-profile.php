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
    
    // Get user profile data
    $stmt = $conn->prepare("SELECT id, name, email, avatar, role, created_at as memberSince, last_login as lastLogin, bio, profession, location FROM users WHERE id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Get user preferences
    $stmt = $conn->prepare("SELECT notifications, newsletter, dark_mode as darkMode FROM user_preferences WHERE user_id = ?");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $prefsResult = $stmt->get_result();
    
    $preferences = [];
    if ($prefsResult->num_rows > 0) {
        $preferences = $prefsResult->fetch_assoc();
        // Convert string values to boolean
        $preferences['notifications'] = (bool)$preferences['notifications'];
        $preferences['newsletter'] = (bool)$preferences['newsletter'];
        $preferences['darkMode'] = (bool)$preferences['darkMode'];
    } else {
        // Default preferences
        $preferences = [
            'notifications' => true,
            'newsletter' => true,
            'darkMode' => false
        ];
    }
    
    // Get user stats
    $stmt = $conn->prepare("SELECT 
        (SELECT COUNT(*) FROM bmi_data WHERE user_id = ?) + 
        (SELECT COUNT(*) FROM professional_bmi_data WHERE user_id = ?) as calculationsPerformed,
        (SELECT COUNT(*) FROM user_history WHERE user_id = ? AND type = 'report') as reportsGenerated,
        (SELECT MAX(date) FROM user_history WHERE user_id = ?) as lastActivity,
        (SELECT streak FROM user_stats WHERE user_id = ?) as streak");
    $stmt->bind_param("sssss", $userId, $userId, $userId, $userId, $userId);
    $stmt->execute();
    $statsResult = $stmt->get_result();
    
    $stats = [];
    if ($statsResult->num_rows > 0) {
        $stats = $statsResult->fetch_assoc();
        // Convert to integers
        $stats['calculationsPerformed'] = (int)$stats['calculationsPerformed'];
        $stats['reportsGenerated'] = (int)$stats['reportsGenerated'];
        $stats['streak'] = (int)$stats['streak'] ?? 0;
    } else {
        // Default stats
        $stats = [
            'calculationsPerformed' => 0,
            'reportsGenerated' => 0,
            'lastActivity' => date('Y-m-d'),
            'streak' => 0
        ];
    }
    
    // Combine all data
    $profile = [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'avatar' => $user['avatar'] ?: "https://api.dicebear.com/7.x/avataaars/svg?seed={$user['name']}",
        'role' => $user['role'],
        'memberSince' => $user['memberSince'],
        'lastLogin' => $user['lastLogin'],
        'bio' => $user['bio'],
        'profession' => $user['profession'],
        'location' => $user['location'],
        'preferences' => $preferences,
        'stats' => $stats
    ];
    
    echo json_encode(['success' => true, 'profile' => $profile]);
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
