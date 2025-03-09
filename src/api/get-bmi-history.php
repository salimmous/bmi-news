<?php
// Include database connection file
require_once 'db-connect.php';

// Set common API response headers
setApiHeaders();

// Check if the request is a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(["success" => false, "message" => "Method not allowed. Please use GET."], 405);
}

// Get the email parameter
$email = isset($_GET['email']) ? $_GET['email'] : null;

// Validate email
if (!$email) {
    sendJsonResponse(["success" => false, "message" => "Email parameter is required."], 400);
}

try {
    // Get database connection
    $pdo = getDbConnection();
    
    // Get user ID from email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sendJsonResponse(["success" => false, "message" => "User not found."], 404);
    }
    
    $userId = $user['id'];
    
    // Get BMI records for the user
    $stmt = $pdo->prepare("SELECT 
        id,
        bmi,
        weight,
        height,
        body_fat_percentage as bodyFatPercentage,
        bmr,
        tdee,
        ideal_weight_min as idealWeightMin,
        ideal_weight_max as idealWeightMax,
        macros_protein as macrosProtein,
        macros_carbs as macrosCarbs,
        macros_fat as macrosFat,
        water_intake as waterIntake,
        vo2_max as vo2Max,
        record_date as date,
        created_at as createdAt
        FROM bmi_records 
        WHERE user_id = ? 
        ORDER BY record_date DESC, created_at DESC");
    $stmt->execute([$userId]);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the records
    $formattedRecords = [];
    foreach ($records as $record) {
        // Format the record data
        $formattedRecord = [
            'id' => $record['id'],
            'bmi' => (float) $record['bmi'],
            'weight' => (float) $record['weight'],
            'height' => (float) $record['height'],
            'bodyFatPercentage' => (float) $record['bodyFatPercentage'],
            'bmr' => (int) $record['bmr'],
            'tdee' => (int) $record['tdee'],
            'idealWeight' => [
                'min' => (float) $record['idealWeightMin'],
                'max' => (float) $record['idealWeightMax']
            ],
            'macros' => [
                'protein' => (int) $record['macrosProtein'],
                'carbs' => (int) $record['macrosCarbs'],
                'fat' => (int) $record['macrosFat']
            ],
            'waterIntake' => (int) $record['waterIntake'],
            'vo2Max' => (int) $record['vo2Max'],
            'date' => $record['date'],
            'createdAt' => $record['createdAt']
        ];
        
        $formattedRecords[] = $formattedRecord;
    }
    
    // Return success response with records
    sendJsonResponse([
        "success" => true,
        "data" => $formattedRecords
    ]);
    
} catch (PDOException $e) {
    sendJsonResponse(["success" => false, "message" => "Database error: " . $e->getMessage()], 500);
} catch (Exception $e) {
    sendJsonResponse(["success" => false, "message" => "Server error: " . $e->getMessage()], 500);
}
