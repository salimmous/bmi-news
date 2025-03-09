<?php
// Database connection parameters
$host = getenv('DB_HOST') ?: 'localhost'; // Your database host
$dbname = getenv('DB_NAME') ?: 'bmi_tracker'; // Your database name
$username = getenv('DB_USER') ?: 'root'; // Your database username
$password = getenv('DB_PASS') ?: ''; // Your database password

// Set headers to allow cross-origin requests and specify content type
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
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
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database connection error: " . $e->getMessage()]);
        exit;
    }
}

// Generate a random API key
function generateApiKey() {
    return bin2hex(random_bytes(32)); // 64 character hex string
}

// Get API keys for a user
function getApiKeys($userId) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM api_keys WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error fetching API keys: " . $e->getMessage()]);
        exit;
    }
}

// Create a new API key
function createApiKey($userId, $name, $permissions, $expiresAt = null) {
    $pdo = getDbConnection();
    
    try {
        $apiKey = generateApiKey();
        
        $stmt = $pdo->prepare("INSERT INTO api_keys (user_id, api_key, name, permissions, expires_at, is_active, created_at, updated_at) 
                              VALUES (?, ?, ?, ?, ?, TRUE, NOW(), NOW())");
        $stmt->execute([$userId, $apiKey, $name, $permissions, $expiresAt]);
        
        $id = $pdo->lastInsertId();
        
        // Fetch the newly created API key
        $stmt = $pdo->prepare("SELECT * FROM api_keys WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error creating API key: " . $e->getMessage()]);
        exit;
    }
}

// Delete an API key
function deleteApiKey($keyId) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("DELETE FROM api_keys WHERE id = ?");
        $stmt->execute([$keyId]);
        
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error deleting API key: " . $e->getMessage()]);
        exit;
    }
}

// Handle API requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get API keys for a user
        if (!isset($_GET['user_id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "User ID is required"]);
            exit;
        }
        
        $userId = (int)$_GET['user_id'];
        $apiKeys = getApiKeys($userId);
        echo json_encode(["success" => true, "data" => $apiKeys]);
        break;
        
    case 'POST':
        // Create a new API key
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data || !isset($data['user_id']) || !isset($data['name'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "User ID and name are required"]);
            exit;
        }
        
        $userId = (int)$data['user_id'];
        $name = $data['name'];
        $permissions = $data['permissions'] ?? '';
        $expiresAt = isset($data['expires_at']) ? $data['expires_at'] : null;
        
        $apiKey = createApiKey($userId, $name, $permissions, $expiresAt);
        echo json_encode(["success" => true, "data" => $apiKey]);
        break;
        
    case 'DELETE':
        // Delete an API key
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "API key ID is required"]);
            exit;
        }
        
        $keyId = (int)$_GET['id'];
        $result = deleteApiKey($keyId);
        
        if ($result) {
            echo json_encode(["success" => true, "message" => "API key deleted successfully"]);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "API key not found"]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}