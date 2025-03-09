<?php
// Include the database connection file
require_once 'db-connect.php';

// Set headers for plain text output
header('Content-Type: text/plain');

echo "Testing database connection to phpMyAdmin on port 3306...\n\n";

try {
    // Get database connection using the updated function
    $pdo = getDbConnection();
    
    echo "✅ Successfully connected to the database!\n";
    echo "Database: $dbname\n";
    echo "Host: $host\n";
    echo "Port: $DB_PORT\n\n";
    
    // Test if we can query the database
    $stmt = $pdo->query('SELECT 1');
    if ($stmt) {
        echo "✅ Database query test successful!\n";
        echo "The connection to phpMyAdmin on port 3306 is working properly.\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}