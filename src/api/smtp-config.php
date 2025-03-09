<?php
// Include database connection file
require_once 'db-connect.php';

// Set common API response headers
setApiHeaders();

/**
 * Get SMTP configuration
 * GET /api/smtp-config.php
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get database connection
        $pdo = getDbConnection();
        
        // Get active SMTP configuration
        $stmt = $pdo->prepare("SELECT * FROM smtp_config WHERE is_active = TRUE ORDER BY id DESC LIMIT 1");
        $stmt->execute();
        $config = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$config) {
            // Return empty config if none exists
            sendJsonResponse([
                "success" => true,
                "data" => null,
                "message" => "No SMTP configuration found"
            ]);
            exit;
        }
        
        // Format the config for response
        $formattedConfig = [
            'id' => $config['id'],
            'host' => $config['host'],
            'port' => (int) $config['port'],
            'username' => $config['username'],
            'password' => '********', // Don't send actual password to client
            'fromEmail' => $config['from_email'],
            'fromName' => $config['from_name'],
            'encryption' => $config['encryption'],
            'authMethod' => $config['auth_method'],
            'isActive' => (bool) $config['is_active'],
            'createdAt' => $config['created_at'],
            'updatedAt' => $config['updated_at']
        ];
        
        // Return success response with config
        sendJsonResponse([
            "success" => true,
            "data" => $formattedConfig
        ]);
        
    } catch (PDOException $e) {
        sendJsonResponse(["success" => false, "message" => "Database error: " . $e->getMessage()], 500);
    } catch (Exception $e) {
        sendJsonResponse(["success" => false, "message" => "Server error: " . $e->getMessage()], 500);
    }
}

/**
 * Save SMTP configuration
 * POST /api/smtp-config.php
 */
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if data is valid
    if (!$data || !isset($data['host']) || !isset($data['username']) || !isset($data['fromEmail'])) {
        sendJsonResponse(["success" => false, "message" => "Invalid data format. Please provide host, username, and fromEmail."], 400);
        exit;
    }
    
    try {
        // Get database connection
        $pdo = getDbConnection();
        
        // Begin transaction
        $pdo->beginTransaction();
        
        // Deactivate all existing configurations
        $stmt = $pdo->prepare("UPDATE smtp_config SET is_active = FALSE");
        $stmt->execute();
        
        // Check if we're updating an existing config
        $isUpdate = isset($data['id']) && !empty($data['id']);
        
        if ($isUpdate) {
            // Update existing config
            $sql = "UPDATE smtp_config SET 
                host = ?, 
                port = ?, 
                username = ?, 
                from_email = ?, 
                from_name = ?, 
                encryption = ?, 
                auth_method = ?, 
                is_active = TRUE, 
                updated_at = NOW()";
            
            $params = [
                $data['host'],
                $data['port'] ?? 587,
                $data['username'],
                $data['fromEmail'],
                $data['fromName'] ?? 'BMI Tracker',
                $data['encryption'] ?? 'tls',
                $data['authMethod'] ?? 'plain'
            ];
            
            // Only update password if provided
            if (isset($data['password']) && !empty($data['password']) && $data['password'] !== '********') {
                $sql .= ", password = ?";
                $params[] = $data['password'];
            }
            
            $sql .= " WHERE id = ?";
            $params[] = $data['id'];
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            
            $configId = $data['id'];
            $message = "SMTP configuration updated successfully";
        } else {
            // Insert new config
            $stmt = $pdo->prepare("INSERT INTO smtp_config (
                host, 
                port, 
                username, 
                password, 
                from_email, 
                from_name, 
                encryption, 
                auth_method, 
                is_active, 
                created_at, 
                updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW(), NOW())");
            
            $stmt->execute([
                $data['host'],
                $data['port'] ?? 587,
                $data['username'],
                $data['password'] ?? '',
                $data['fromEmail'],
                $data['fromName'] ?? 'BMI Tracker',
                $data['encryption'] ?? 'tls',
                $data['authMethod'] ?? 'plain'
            ]);
            
            $configId = $pdo->lastInsertId();
            $message = "SMTP configuration created successfully";
        }
        
        // Commit transaction
        $pdo->commit();
        
        // Return success response
        sendJsonResponse([
            "success" => true,
            "message" => $message,
            "data" => ["id" => $configId]
        ]);
        
    } catch (PDOException $e) {
        // Rollback transaction on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendJsonResponse(["success" => false, "message" => "Database error: " . $e->getMessage()], 500);
    } catch (Exception $e) {
        // Rollback transaction on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendJsonResponse(["success" => false, "message" => "Server error: " . $e->getMessage()], 500);
    }
}

/**
 * Test SMTP configuration
 * POST /api/smtp-config.php?action=test
 */
else if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'test') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if data is valid
    if (!$data || !isset($data['testEmail'])) {
        sendJsonResponse(["success" => false, "message" => "Invalid data format. Please provide testEmail."], 400);
        exit;
    }
    
    try {
        // In a real application, you would use PHPMailer or similar library to send a test email
        // For this demo, we'll simulate a successful email send
        
        // Simulate API delay
        sleep(1);
        
        // Return success response
        sendJsonResponse([
            "success" => true,
            "message" => "Test email sent successfully to " . $data['testEmail']
        ]);
        
    } catch (Exception $e) {
        sendJsonResponse(["success" => false, "message" => "Error sending test email: " . $e->getMessage()], 500);
    }
}

// Method not allowed
else {
    sendJsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}