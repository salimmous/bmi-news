<?php
// Prevent PHP errors from being displayed directly to the client
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Set up a custom error handler to convert PHP errors to JSON responses
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    // Only handle errors that match the error_reporting setting
    if (!(error_reporting() & $errno)) {
        return false;
    }
    
    // Make sure we set the content type header before any output
    if (!headers_sent()) {
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
    }
    
    echo json_encode([
        "success" => false, 
        "message" => "PHP Error: $errstr in $errfile on line $errline"
    ]);
    exit;
});

// Set up exception handler to convert uncaught exceptions to JSON responses
set_exception_handler(function($exception) {
    // Make sure we set the content type header before any output
    if (!headers_sent()) {
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
    }
    
    echo json_encode([
        "success" => false, 
        "message" => "Uncaught Exception: " . $exception->getMessage()
    ]);
    exit;
});

// Database connection parameters
$host = getenv('DB_HOST') ?: 'localhost'; // Your database host
$dbname = getenv('DB_NAME') ?: 'bmi_tracker'; // Your database name
$username = getenv('DB_USER') ?: 'root'; // Your database username
$password = getenv('DB_PASS') ?: ''; // Your database password

// Set headers to allow cross-origin requests and specify content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Create a database connection function
function getDbConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        // Make sure we set the content type header before any output
        if (!headers_sent()) {
            http_response_code(500);
            header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode(["success" => false, "message" => "Database connection error: " . $e->getMessage()]);
        exit;
    }
}

// Get all settings or settings by group
function getSettings($group = null) {
    $pdo = getDbConnection();
    
    try {
        if ($group) {
            $stmt = $pdo->prepare("SELECT * FROM site_settings WHERE setting_group = ? AND is_public = TRUE ORDER BY id");
            $stmt->execute([$group]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM site_settings WHERE is_public = TRUE ORDER BY setting_group, id");
            $stmt->execute();
        }
        
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format settings as key-value pairs grouped by setting_group
        $formattedSettings = [];
        foreach ($settings as $setting) {
            if (!isset($formattedSettings[$setting['setting_group']])) {
                $formattedSettings[$setting['setting_group']] = [];
            }
            
            $formattedSettings[$setting['setting_group']][$setting['setting_key']] = $setting['setting_value'];
        }
        
        return $formattedSettings;
    } catch (PDOException $e) {
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["success" => false, "message" => "Error fetching settings: " . $e->getMessage()]);
        exit;
    }
}

// Update settings
function updateSettings($data) {
    $pdo = getDbConnection();
    
    try {
        $pdo->beginTransaction();
        
        foreach ($data as $group => $settings) {
            foreach ($settings as $key => $value) {
                $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ? AND setting_group = ?");
                $stmt->execute([$value, $key, $group]);
            }
        }
        
        $pdo->commit();
        return true;
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["success" => false, "message" => "Error updating settings: " . $e->getMessage()]);
        exit;
    }
}

// Upload file (logo or favicon)
function uploadFile($fileKey, $targetDir) {
    // Check if file was uploaded
    if (!isset($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return ["success" => false, "message" => "File upload failed"];
    }
    
    // Create target directory if it doesn't exist
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }
    
    // Generate a unique filename
    $fileInfo = pathinfo($_FILES[$fileKey]['name']);
    $fileName = uniqid() . '.' . $fileInfo['extension'];
    $targetFile = $targetDir . '/' . $fileName;
    
    // Move uploaded file to target directory
    if (move_uploaded_file($_FILES[$fileKey]['tmp_name'], $targetFile)) {
        return ["success" => true, "file_path" => $targetFile];
    } else {
        return ["success" => false, "message" => "Failed to move uploaded file"];
    }
}

// Handle API requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get settings
        $group = isset($_GET['group']) ? $_GET['group'] : null;
        $settings = getSettings($group);
        // Ensure Content-Type header is set before any output
        if (!headers_sent()) {
            header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode(["success" => true, "data" => $settings]);
        break;
        
    case 'POST':
        // Check if it's a file upload
        if (isset($_FILES['logo']) || isset($_FILES['favicon'])) {
            $response = ["success" => true, "files" => []];
            
            // Handle logo upload
            if (isset($_FILES['logo'])) {
                $logoResult = uploadFile('logo', '../assets/uploads');
                if ($logoResult["success"]) {
                    // Update logo path in database
                    $pdo = getDbConnection();
                    $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = 'logo_path'");
                    $stmt->execute([$logoResult["file_path"]]);
                }
                $response["files"]["logo"] = $logoResult;
            }
            
            // Handle favicon upload
            if (isset($_FILES['favicon'])) {
                $faviconResult = uploadFile('favicon', '../assets/uploads');
                if ($faviconResult["success"]) {
                    // Update favicon path in database
                    $pdo = getDbConnection();
                    $stmt = $pdo->prepare("UPDATE site_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = 'favicon_path'");
                    $stmt->execute([$faviconResult["file_path"]]);
                }
                $response["files"]["favicon"] = $faviconResult;
            }
            
            // Ensure Content-Type header is set before any output
            if (!headers_sent()) {
                header("Content-Type: application/json; charset=UTF-8");
            }
            echo json_encode($response);
        } else {
            // Update settings
            $data = json_decode(file_get_contents("php://input"), true);
            
            if (!$data) {
                http_response_code(400);
                // Ensure Content-Type header is set before any output
                if (!headers_sent()) {
                    header("Content-Type: application/json; charset=UTF-8");
                }
                echo json_encode(["success" => false, "message" => "Invalid data format"]);
                exit;
            }
            
            $result = updateSettings($data);
            // Ensure Content-Type header is set before any output
            if (!headers_sent()) {
                header("Content-Type: application/json; charset=UTF-8");
            }
            echo json_encode(["success" => true, "message" => "Settings updated successfully"]);
        }
        break;
        
    default:
        http_response_code(405);
        // Ensure Content-Type header is set before any output
        if (!headers_sent()) {
            header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}