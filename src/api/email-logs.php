<?php
// Include database connection file
require_once 'db-connect.php';

// Set common API response headers
setApiHeaders();

/**
 * Get all email logs with optional filtering
 * GET /api/email-logs.php?status=sent&date=last7days&search=example.com
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Get database connection
        $pdo = getDbConnection();
        
        // Build query with optional filters
        $query = "SELECT * FROM email_logs WHERE 1=1";
        $params = [];
        
        // Filter by status if provided
        if (isset($_GET['status']) && $_GET['status'] !== 'all') {
            $query .= " AND status = ?";
            $params[] = $_GET['status'];
        }
        
        // Filter by date range if provided
        if (isset($_GET['date']) && $_GET['date'] !== 'all') {
            $today = date('Y-m-d');
            $yesterday = date('Y-m-d', strtotime('-1 day'));
            
            switch ($_GET['date']) {
                case 'today':
                    $query .= " AND DATE(sent_at) = ?";
                    $params[] = $today;
                    break;
                case 'yesterday':
                    $query .= " AND DATE(sent_at) = ?";
                    $params[] = $yesterday;
                    break;
                case 'last7days':
                    $query .= " AND sent_at >= ?";
                    $params[] = date('Y-m-d', strtotime('-7 days'));
                    break;
                case 'last30days':
                    $query .= " AND sent_at >= ?";
                    $params[] = date('Y-m-d', strtotime('-30 days'));
                    break;
            }
        }
        
        // Search by recipient, subject, or template name
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $searchTerm = '%' . $_GET['search'] . '%';
            $query .= " AND (recipient LIKE ? OR subject LIKE ? OR template_name LIKE ?)";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }
        
        // Add order by
        $query .= " ORDER BY sent_at DESC";
        
        // Add pagination if needed
        if (isset($_GET['page']) && isset($_GET['limit'])) {
            $page = max(1, intval($_GET['page']));
            $limit = max(1, min(100, intval($_GET['limit'])));
            $offset = ($page - 1) * $limit;
            
            $query .= " LIMIT ?, ?";
            $params[] = $offset;
            $params[] = $limit;
        }
        
        // Execute query
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get total count for pagination
        $countQuery = str_replace("SELECT *", "SELECT COUNT(*) as total", preg_replace("/\s+ORDER BY.*/", "", $query));
        $countQuery = preg_replace("/\s+LIMIT.*/", "", $countQuery);
        
        $countStmt = $pdo->prepare($countQuery);
        $countParams = array_slice($params, 0, -2); // Remove LIMIT params if they exist
        $countStmt->execute(count($countParams) > 0 ? $countParams : $params);
        $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
        
        // Format the logs for response
        $formattedLogs = [];
        foreach ($logs as $log) {
            $formattedLogs[] = [
                'id' => $log['id'],
                'recipient' => $log['recipient'],
                'subject' => $log['subject'],
                'templateName' => $log['template_name'],
                'status' => $log['status'],
                'sentAt' => $log['sent_at'],
                'error' => $log['error'],
                'createdAt' => $log['created_at']
            ];
        }
        
        // Return success response with logs
        sendJsonResponse([
            "success" => true,
            "data" => $formattedLogs,
            "meta" => [
                "total" => $totalCount,
                "page" => $page ?? 1,
                "limit" => $limit ?? count($formattedLogs)
            ]
        ]);
        
    } catch (PDOException $e) {
        sendJsonResponse(["success" => false, "message" => "Database error: " . $e->getMessage()], 500);
    } catch (Exception $e) {
        sendJsonResponse(["success" => false, "message" => "Server error: " . $e->getMessage()], 500);
    }
}

/**
 * Add a new email log entry
 * POST /api/email-logs.php
 */
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the posted data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if data is valid
    if (!$data || !isset($data['recipient']) || !isset($data['subject']) || !isset($data['templateName'])) {
        sendJsonResponse(["success" => false, "message" => "Invalid data format. Please provide recipient, subject, and templateName."], 400);
    }
    
    try {
        // Get database connection
        $pdo = getDbConnection();
        
        // Insert new email log
        $stmt = $pdo->prepare("INSERT INTO email_logs (
            recipient, 
            subject, 
            template_name, 
            status, 
            sent_at, 
            error, 
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())");
        
        $stmt->execute([
            $data['recipient'],
            $data['subject'],
            $data['templateName'],
            $data['status'] ?? 'pending',
            $data['sentAt'] ?? date('Y-m-d H:i:s'),
            $data['error'] ?? null
        ]);
        
        $logId = $pdo->lastInsertId();
        
        // Return success response
        sendJsonResponse([
            "success" => true,
            "message" => "Email log created successfully",
            "data" => ["id" => $logId]
        ]);
        
    } catch (PDOException $e) {
        sendJsonResponse(["success" => false, "message" => "Database error: " . $e->getMessage()], 500);
    } catch (Exception $e) {
        sendJsonResponse(["success" => false, "message" => "Server error: " . $e->getMessage()], 500);
    }
}

/**
 * Clear all email logs
 * DELETE /api/email-logs.php
 */
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        // Get database connection
        $pdo = getDbConnection();
        
        // Delete all logs or specific logs
        if (isset($_GET['id'])) {
            // Delete specific log
            $stmt = $pdo->prepare("DELETE FROM email_logs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $message = "Email log deleted successfully";
        } else {
            // Delete all logs
            $stmt = $pdo->prepare("DELETE FROM email_logs");
            $stmt->execute();
            $message = "All email logs cleared successfully";
        }
        
        // Return success response
        sendJsonResponse([
            "success" => true,
            "message" => $message
        ]);
        
    } catch (PDOException $e) {
        sendJsonResponse(["success" => false, "message" => "Database error: " . $e->getMessage()], 500);
    } catch (Exception $e) {
        sendJsonResponse(["success" => false, "message" => "Server error: " . $e->getMessage()], 500);
    }
}

// Method not allowed
else {
    sendJsonResponse(["success" => false, "message" => "Method not allowed"], 405);
}