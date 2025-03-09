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

// Get all widgets or widgets by dashboard type
function getWidgets($dashboardType = null) {
    $pdo = getDbConnection();
    
    try {
        if ($dashboardType) {
            $stmt = $pdo->prepare("SELECT * FROM widgets WHERE dashboard_type = ? OR dashboard_type = 'both' ORDER BY display_order, id");
            $stmt->execute([$dashboardType]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM widgets ORDER BY display_order, id");
            $stmt->execute();
        }
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error fetching widgets: " . $e->getMessage()]);
        exit;
    }
}

// Get a single widget by ID
function getWidget($id) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM widgets WHERE id = ?");
        $stmt->execute([$id]);
        $widget = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$widget) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Widget not found"]);
            exit;
        }
        
        return $widget;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error fetching widget: " . $e->getMessage()]);
        exit;
    }
}

// Create a new widget
function createWidget($name, $description, $widgetType, $dashboardType, $settings = null) {
    $pdo = getDbConnection();
    
    try {
        // Get the highest display order
        $stmt = $pdo->prepare("SELECT MAX(display_order) as max_order FROM widgets");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $displayOrder = ($result['max_order'] ?? 0) + 1;
        
        $stmt = $pdo->prepare("INSERT INTO widgets (name, description, widget_type, dashboard_type, settings, is_active, display_order, created_at, updated_at) 
                              VALUES (?, ?, ?, ?, ?, TRUE, ?, NOW(), NOW())");
        $stmt->execute([$name, $description, $widgetType, $dashboardType, $settings, $displayOrder]);
        
        $id = $pdo->lastInsertId();
        
        // Fetch the newly created widget
        return getWidget($id);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error creating widget: " . $e->getMessage()]);
        exit;
    }
}

// Update a widget
function updateWidget($id, $data) {
    $pdo = getDbConnection();
    
    try {
        // First check if widget exists
        $stmt = $pdo->prepare("SELECT id FROM widgets WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Widget not found"]);
            exit;
        }
        
        // Build update query based on provided data
        $updateFields = [];
        $params = [];
        
        if (isset($data['name'])) {
            $updateFields[] = "name = ?";
            $params[] = $data['name'];
        }
        
        if (isset($data['description'])) {
            $updateFields[] = "description = ?";
            $params[] = $data['description'];
        }
        
        if (isset($data['widget_type'])) {
            $updateFields[] = "widget_type = ?";
            $params[] = $data['widget_type'];
        }
        
        if (isset($data['dashboard_type'])) {
            $updateFields[] = "dashboard_type = ?";
            $params[] = $data['dashboard_type'];
        }
        
        if (isset($data['settings'])) {
            $updateFields[] = "settings = ?";
            $params[] = $data['settings'];
        }
        
        if (isset($data['is_active'])) {
            $updateFields[] = "is_active = ?";
            $params[] = $data['is_active'] ? 1 : 0;
        }
        
        if (isset($data['display_order'])) {
            $updateFields[] = "display_order = ?";
            $params[] = $data['display_order'];
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No fields to update"]);
            exit;
        }
        
        $updateFields[] = "updated_at = NOW()";
        $params[] = $id; // For the WHERE clause
        
        $sql = "UPDATE widgets SET " . implode(", ", $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Return the updated widget
        return getWidget($id);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error updating widget: " . $e->getMessage()]);
        exit;
    }
}

// Delete a widget
function deleteWidget($id) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("DELETE FROM widgets WHERE id = ?");
        $stmt->execute([$id]);
        
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error deleting widget: " . $e->getMessage()]);
        exit;
    }
}

// Get user widget preferences
function getUserWidgets($userId) {
    $pdo = getDbConnection();
    
    try {
        $stmt = $pdo->prepare("
            SELECT uw.*, w.name, w.widget_type, w.dashboard_type, w.description 
            FROM user_widgets uw
            JOIN widgets w ON uw.widget_id = w.id
            WHERE uw.user_id = ?
            ORDER BY uw.display_order, uw.id
        ");
        $stmt->execute([$userId]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error fetching user widgets: " . $e->getMessage()]);
        exit;
    }
}

// Update user widget preferences
function updateUserWidgets($userId, $widgets) {
    $pdo = getDbConnection();
    
    try {
        $pdo->beginTransaction();
        
        // First, delete all existing user widget preferences
        $stmt = $pdo->prepare("DELETE FROM user_widgets WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        // Then, insert the new preferences
        $stmt = $pdo->prepare("
            INSERT INTO user_widgets (user_id, widget_id, is_enabled, display_order, settings, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW())
        ");
        
        foreach ($widgets as $index => $widget) {
            $stmt->execute([
                $userId,
                $widget['widget_id'],
                isset($widget['is_enabled']) ? ($widget['is_enabled'] ? 1 : 0) : 1,
                isset($widget['display_order']) ? $widget['display_order'] : $index,
                isset($widget['settings']) ? $widget['settings'] : null
            ]);
        }
        
        $pdo->commit();
        
        // Return the updated user widget preferences
        return getUserWidgets($userId);
    } catch (PDOException $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error updating user widgets: " . $e->getMessage()]);
        exit;
    }
}

// Handle API requests based on HTTP method
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Check if we're getting user widget preferences
        if (isset($_GET['user_id'])) {
            $userId = (int)$_GET['user_id'];
            $userWidgets = getUserWidgets($userId);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $userWidgets]);
        }
        // Check if we're getting a single widget
        else if (isset($_GET['id'])) {
            $widget = getWidget((int)$_GET['id']);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $widget]);
        }
        // Otherwise, get all widgets or widgets by dashboard type
        else {
            $dashboardType = isset($_GET['dashboard_type']) ? $_GET['dashboard_type'] : null;
            $widgets = getWidgets($dashboardType);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $widgets]);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid data format"]);
            exit;
        }
        
        // Check if we're updating user widget preferences
        if (isset($data['user_id']) && isset($data['widgets'])) {
            $userWidgets = updateUserWidgets($data['user_id'], $data['widgets']);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $userWidgets]);
        }
        // Otherwise, create a new widget
        else {
            if (!isset($data['name']) || !isset($data['widget_type']) || !isset($data['dashboard_type'])) {
                http_response_code(400);
                header("Content-Type: application/json; charset=UTF-8");
                echo json_encode(["success" => false, "message" => "Name, widget type, and dashboard type are required"]);
                exit;
            }
            
            $widget = createWidget(
                $data['name'],
                $data['description'] ?? null,
                $data['widget_type'],
                $data['dashboard_type'],
                $data['settings'] ?? null
            );
            
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "data" => $widget]);
        }
        break;
        
    case 'PUT':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Widget ID is required"]);
            exit;
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Invalid data format"]);
            exit;
        }
        
        $widget = updateWidget((int)$_GET['id'], $data);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["success" => true, "data" => $widget]);
        break;
        
    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Widget ID is required"]);
            exit;
        }
        
        $result = deleteWidget((int)$_GET['id']);
        
        if ($result) {
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => true, "message" => "Widget deleted successfully"]);
        } else {
            http_response_code(404);
            header("Content-Type: application/json; charset=UTF-8");
            echo json_encode(["success" => false, "message" => "Widget not found"]);
        }
        break;
        
    default:
        http_response_code(405);
        header("Content-Type: application/json; charset=UTF-8");
        echo json_encode(["success" => false, "message" => "Method not allowed"]);
        break;
}