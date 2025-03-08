<?php
// Database connection parameters
$host = 'localhost'; // Your database host
$dbname = 'bmi_tracker'; // Your database name
$username = 'your_db_username'; // Your database username
$password = 'your_db_password'; // Your database password

// Set headers to allow cross-origin requests and specify content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the request is a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method not allowed. Please use GET."]);
    exit;
}

// Get the email parameter
$email = isset($_GET['email']) ? $_GET['email'] : null;

// Validate email
if (!$email) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Email parameter is required."]);
    exit;
}

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get user ID from email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(404); // Not Found
        echo json_encode(["message" => "User not found."]);
        exit;
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
            'vo2Max' => $record['vo2Max'] ? (int) $record['vo2Max'] : null,
            'date' => $record['date'],
            'createdAt' => $record['createdAt']
        ];
        
        $formattedRecords[] = $formattedRecord;
    }
    
    // Get user details
    $stmt = $pdo->prepare("SELECT 
        name,
        email,
        phone,
        age,
        gender,
        fitness_goal as fitnessGoal,
        calories_per_day as caloriesPerDay,
        diet_preference as dietPreference,
        activity_level as activityLevel,
        gym_sessions_per_week as gymSessionsPerWeek,
        time_in_gym as timeInGym,
        hours_of_sleep as hoursOfSleep,
        created_at as createdAt,
        updated_at as updatedAt
        FROM users 
        WHERE id = ?");
    $stmt->execute([$userId]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Return success response with records and user data
    http_response_code(200);
    echo json_encode([
        "message" => "Data retrieved successfully",
        "userData" => $userData,
        "records" => $formattedRecords
    ]);
    
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}
