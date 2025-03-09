<?php
/**
 * Database Connection Handler
 * 
 * This file handles the connection to the MySQL database for the BMI Tracker application.
 * It uses mysqli for secure and efficient database operations.
 */

// Prevent direct access to this file
if (!defined('SECURE_ACCESS')) {
    header('HTTP/1.0 403 Forbidden');
    exit('Direct access to this file is not allowed.');
}

// Load configuration
$config = include __DIR__ . '/config.php';

/**
 * Get a database connection
 * 
 * @return mysqli A database connection object
 */
function getDbConnection() {
    global $config;
    
    // Create a new database connection
    $mysqli = new mysqli(
        $config['db']['host'],
        $config['db']['username'],
        $config['db']['password'],
        $config['db']['database'],
        $config['db']['port']
    );
    
    // Check for connection errors
    if ($mysqli->connect_error) {
        error_log('Database connection failed: ' . $mysqli->connect_error);
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed. Please try again later.'
        ]);
        exit;
    }
    
    // Set charset to UTF-8
    $mysqli->set_charset('utf8mb4');
    
    return $mysqli;
}

/**
 * Execute a database query with prepared statement
 * 
 * @param string $query The SQL query with placeholders
 * @param string $types The types of parameters (i: integer, d: double, s: string, b: blob)
 * @param array $params The parameters to bind to the query
 * @return array|bool Query result as associative array or false on failure
 */
function executeQuery($query, $types = '', $params = []) {
    $mysqli = getDbConnection();
    
    // Prepare the statement
    $stmt = $mysqli->prepare($query);
    
    if (!$stmt) {
        error_log('Query preparation failed: ' . $mysqli->error);
        $mysqli->close();
        return false;
    }
    
    // Bind parameters if any
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    // Execute the statement
    if (!$stmt->execute()) {
        error_log('Query execution failed: ' . $stmt->error);
        $stmt->close();
        $mysqli->close();
        return false;
    }
    
    // Get result for SELECT queries
    $result = [];
    $metadata = $stmt->result_metadata();
    
    if ($metadata) {
        // It's a SELECT query
        $result = getSelectQueryResults($stmt);
    } else {
        // It's an INSERT, UPDATE, or DELETE query
        $result = [
            'affected_rows' => $stmt->affected_rows,
            'insert_id' => $stmt->insert_id
        ];
    }
    
    // Clean up
    $stmt->close();
    $mysqli->close();
    
    return $result;
}

/**
 * Get results from a SELECT query
 * 
 * @param mysqli_stmt $stmt The prepared statement
 * @return array The query results as associative array
 */
function getSelectQueryResults($stmt) {
    $result = [];
    $metadata = $stmt->result_metadata();
    
    if (!$metadata) {
        return $result;
    }
    
    // Dynamically create variables for each column
    $fields = [];
    $bindVars = [];
    
    while ($field = $metadata->fetch_field()) {
        $fields[] = $field->name;
        $bindVars[] = &$row[$field->name];
    }
    
    // Bind result variables
    call_user_func_array([$stmt, 'bind_result'], $bindVars);
    
    // Fetch all rows
    while ($stmt->fetch()) {
        $rowData = [];
        foreach ($fields as $field) {
            $rowData[$field] = $row[$field];
        }
        $result[] = $rowData;
    }
    
    return $result;
}

/**
 * Begin a transaction
 * 
 * @return mysqli The database connection with transaction started
 */
function beginTransaction() {
    $mysqli = getDbConnection();
    $mysqli->begin_transaction();
    return $mysqli;
}

/**
 * Commit a transaction
 * 
 * @param mysqli $mysqli The database connection
 * @return bool True on success, false on failure
 */
function commitTransaction($mysqli) {
    $result = $mysqli->commit();
    $mysqli->close();
    return $result;
}

/**
 * Rollback a transaction
 * 
 * @param mysqli $mysqli The database connection
 * @return bool True on success, false on failure
 */
function rollbackTransaction($mysqli) {
    $result = $mysqli->rollback();
    $mysqli->close();
    return $result;
}
