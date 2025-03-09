<?php
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
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Database connection error: " . $e->getMessage()]);
        exit;
    }
}

// Get all webhooks
function getWebhooks() {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM webhooks ORDER BY created_at DESC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error fetching webhooks: " . $e->getMessage()]);
        exit;
    }
}

// Get a single webhook by ID
function getWebhook($id) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM webhooks WHERE id = ?");
        $stmt->execute([$id]);
        $webhook = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$webhook) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Webhook not found"]);
            exit;
        }
        
        return $webhook;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error fetching webhook: " . $e->getMessage()]);
        exit;
    }
}

// Create a new webhook
function createWebhook($name, $url, $eventType, $secretKey = null) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("INSERT INTO webhooks (name, url, event_type, secret_key, is_active, created_at, updated_at) 
                              VALUES (?, ?, ?, ?, TRUE, NOW(), NOW())");
        $stmt->execute([$name, $url, $eventType, $secretKey]);
        
        $id = $pdo->lastInsertId();
        
        // Fetch the newly created webhook
        return getWebhook($id);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error creating webhook: " . $e->getMessage()]);
        exit;
    }
}

// Update a webhook
function updateWebhook($id, $data) {
    $pdo = getDbConnection();
    
    try {
        // First check if webhook exists
        $stmt = $pdo->prepare("SELECT id FROM webhooks WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Webhook not found"]);
            exit;
        }
        
        // Build update query based on provided data
        $updateFields = [];
        $params = [];
        
        if (isset($data['name'])) {
            $updateFields[] = "name = ?";
            $params[] = $data['name'];
        }
        
        if (isset($data['url'])) {
            $updateFields[] = "url = ?";
            $params[] = $data['url'];
        }
        
        if (isset($data['event_type'])) {
            $updateFields[] = "event_type = ?";
            $params[] = $data['event_type'];
        }
        
        if (isset($data['secret_key'])) {
            $updateFields[] = "secret_key = ?";
            $params[] = $data['secret_key'];
        }
        
        if (isset($data['is_active'])) {
            $updateFields[] = "is_active = ?";
            $params[] = $data['is_active'] ? 1 : 0;
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No fields to update"]);
            exit;
        }
        
        $updateFields[] = "updated_at = NOW()";
        $params[] = $id; // For the WHERE clause
        
        $sql = "UPDATE webhooks SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Return the updated webhook
        return getWebhook($id);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error updating webhook: " . $e->getMessage()]);
        exit;
    }
}

// Delete a webhook
function deleteWebhook($id) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("DELETE FROM webhooks WHERE id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error deleting webhook: " . $e->getMessage()]);
        exit;
    }
}

// Trigger a webhook
function triggerWebhook($eventType, $payload) {
    $pdo = getDbConnection();
    
    try {
        // Get all active webhooks for this event type
        $stmt = $pdo->prepare("SELECT * FROM webhooks WHERE event_type = ? AND is_active = TRUE");
        $stmt->execute([$eventType]);
        $webhooks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $results = [];
        
        foreach ($webhooks as $webhook) {
            $headers = [
                'Content-Type: application/json',
            ];
            
            // Add signature if secret key is set
            if (!empty($webhook['secret_key'])) {
                $signature = hash_hmac('sha256', json_encode($payload), $webhook['secret_key']);
                $headers[] = "X-BMI-Tracker-Signature: $signature";
            }
            
            // Initialize cURL
            $ch = curl_init($webhook['url']);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5); // 5 second timeout
            
            // Execute the request
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            curl_close($ch);
            
            $results[] = [
                'webhook_id' => $webhook['id'],
                'webhook_name' => $webhook['name'],
                'success' => $error === '' && $httpCode >= 200 && $httpCode < 300,
                'http_code' => $httpCode,
                'error' => $error,
            ];
        }
        
        return $results;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error triggering webhooks: " . $e->getMessage()]);
        exit;
    }
}

// Handle API requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get all webhooks or a single webhook
        if (isset($_GET['id'])) {
            $webhook = getWebhook((int)$_GET['id']);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $webhook]);
        } else {
            $webhooks = getWebhooks();
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $webhooks]);
        }
        break;
        
    case 'POST':
        // Create a new webhook or trigger a webhook
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            http_response_code(400);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => false, "message" => "Invalid data format"]);
            exit;
        }
        
        // Check if this is a webhook trigger request
        if (isset($data['trigger']) && $data['trigger'] === true) {
            if (!isset($data['event_type']) || !isset($data['payload'])) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Event type and payload are required for triggering webhooks"]);
                exit;
            }
            
            $results = triggerWebhook($data['event_type'], $data['payload']);
            echo json_encode(["success" => true, "data" => $results]);
        } else {
            // This is a webhook creation request
            if (!isset($data['name']) || !isset($data['url']) || !isset($data['event_type'])) {
                http_response_code(400);
                header("Content-Type: application/json; charset=UTF-8");
                echo json_encode(["success" => false, "message" => "Name, URL, and event type are required"]);
                exit;
            }
            
            $webhook = createWebhook(
                $data['name'],
                $data['url'],
                $data['event_type'],
                $data['secret_key'] ?? null
            );
            
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $webhook]);
        }
        break;
        
    case 'PUT':
        // Update a webhook
        if (!isset($_GET['id'])) {
            http_response_code(400);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => false, "message" => "Webhook ID is required"]);
            exit;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            http_response_code(400);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => false, "message" => "Invalid data format"]);
            exit;
        }
        
        $webhook = updateWebhook((int)$_GET['id'], $data);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["success" => true, "data" => $webhook]);
        break;
        
    case 'DELETE':
        // Delete a webhook
        if (!isset($_GET['id'])) {
            http_response_code(400);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => false, "message" => "Webhook ID is required"]);
            exit;
        }
        
        $result = deleteWebhook((int)$_GET['id']);
        
        if ($result) {
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "message" => "Webhook deleted successfully"]);
        } else {
            http_response_code(404);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => false, "message" => "Webhook not found"]);
        }
        break;
        
    default:
        http_response_code(405);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}