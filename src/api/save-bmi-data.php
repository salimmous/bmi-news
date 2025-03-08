<?php
// Database connection parameters
$host = 'localhost'; // Your database host
$dbname = 'bmi_tracker'; // Your database name
$username = 'your_db_username'; // Your database username
$password = 'your_db_password'; // Your database password

// Set headers to allow cross-origin requests and specify content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["message" => "Method not allowed. Please use POST."]);
    exit;
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

// Check if data is valid
if (!$data || !isset($data['userData']) || !isset($data['metrics'])) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Invalid data format. Please provide userData and metrics."]);
    exit;
}

// Extract user data and metrics
$userData = $data['userData'];
$metrics = $data['metrics'];

// Validate required fields
if (empty($userData['email'])) {
    http_response_code(400);
    echo json_encode(["message" => "Email is required."]);
    exit;
}

try {
    // Create a new PDO instance
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Begin transaction
    $pdo->beginTransaction();
    
    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$userData['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $userId = null;
    
    if ($user) {
        // Update existing user
        $userId = $user['id'];
        $stmt = $pdo->prepare("UPDATE users SET 
            name = ?, 
            phone = ?, 
            age = ?, 
            gender = ?, 
            fitness_goal = ?, 
            calories_per_day = ?, 
            diet_preference = ?, 
            activity_level = ?, 
            gym_sessions_per_week = ?, 
            time_in_gym = ?, 
            hours_of_sleep = ?, 
            updated_at = NOW() 
            WHERE id = ?");
        
        $stmt->execute([
            $userData['name'] ?? '',
            $userData['phone'] ?? '',
            $userData['age'] ?? 0,
            $userData['gender'] ?? '',
            $userData['fitnessGoal'] ?? '',
            $userData['caloriesPerDay'] ?? 0,
            $userData['dietPreference'] ?? '',
            $userData['activityLevel'] ?? '',
            $userData['gymSessionsPerWeek'] ?? 0,
            $userData['timeInGym'] ?? 0,
            $userData['hoursOfSleep'] ?? 0,
            $userId
        ]);
    } else {
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (
            email, 
            name, 
            phone, 
            age, 
            gender, 
            fitness_goal, 
            calories_per_day, 
            diet_preference, 
            activity_level, 
            gym_sessions_per_week, 
            time_in_gym, 
            hours_of_sleep, 
            created_at, 
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
        
        $stmt->execute([
            $userData['email'],
            $userData['name'] ?? '',
            $userData['phone'] ?? '',
            $userData['age'] ?? 0,
            $userData['gender'] ?? '',
            $userData['fitnessGoal'] ?? '',
            $userData['caloriesPerDay'] ?? 0,
            $userData['dietPreference'] ?? '',
            $userData['activityLevel'] ?? '',
            $userData['gymSessionsPerWeek'] ?? 0,
            $userData['timeInGym'] ?? 0,
            $userData['hoursOfSleep'] ?? 0
        ]);
        
        $userId = $pdo->lastInsertId();
    }
    
    // Insert BMI record
    $stmt = $pdo->prepare("INSERT INTO bmi_records (
        user_id, 
        bmi, 
        weight, 
        height, 
        body_fat_percentage, 
        bmr, 
        tdee, 
        ideal_weight_min, 
        ideal_weight_max, 
        macros_protein, 
        macros_carbs, 
        macros_fat, 
        water_intake, 
        vo2_max, 
        record_date, 
        created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    
    // Extract values from metrics
    $idealWeight = json_decode($metrics['idealWeight'], true);
    $macros = json_decode($metrics['macros'], true);
    
    $stmt->execute([
        $userId,
        $metrics['bmi'] ?? 0,
        $metrics['weight'] ?? 0,
        $metrics['height'] ?? 0,
        $metrics['bodyFatPercentage'] ?? 0,
        $metrics['bmr'] ?? 0,
        $metrics['tdee'] ?? 0,
        $idealWeight['min'] ?? 0,
        $idealWeight['max'] ?? 0,
        $macros['protein'] ?? 0,
        $macros['carbs'] ?? 0,
        $macros['fat'] ?? 0,
        $metrics['waterIntake'] ?? 0,
        $metrics['vo2Max'] ?? 0,
        $metrics['date'] ?? date('Y-m-d')
    ]);
    
    // Commit transaction
    $pdo->commit();
    
    // Return success response
    http_response_code(201); // Created
    echo json_encode([
        "message" => "Data saved successfully",
        "userId" => $userId,
        "recordId" => $pdo->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Server error: " . $e->getMessage()]);
}
