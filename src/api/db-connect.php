<?php
// Database connection parameters for XAMPP
$host = 'localhost:3306'; // XAMPP default host with port
$dbname = 'bmi_tracker'; // Database name
$username = 'root'; // XAMPP default username
$password = ''; // XAMPP default password (empty by default)
$DB_PORT = '3306'; // Added missing semicolon here

/**
 * Get a PDO database connection
 * @return PDO The database connection
 */
function getDbConnection(): PDO {
    global $host, $dbname, $username, $password, $DB_PORT;
    
    try {
        // Extract host without port if it contains port
        $hostOnly = strpos($host, ':') !== false ? strstr($host, ':', true) : $host;
        
        // Create DSN with explicit port parameter
        $dsn = "mysql:host=$hostOnly;port=$DB_PORT;dbname=$dbname";
        
        $pdo = new PDO($dsn, $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        // Set appropriate headers
        if (!headers_sent()) {
            http_response_code(500);
            header("Content-Type: application/json; charset=UTF-8");
        }
        echo json_encode(["success" => false, "message" => "Database connection error: " . $e->getMessage()]);
        exit;
    }
}

/**
 * Set common API response headers
 */
function setApiHeaders() {
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
}

/**
 * Send a JSON response
 * @param array $data The data to send
 * @param int $statusCode HTTP status code
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    if (!headers_sent()) {
        header("Content-Type: application/json; charset=UTF-8");
    }
    echo json_encode($data);
    exit;
}