<?php
// Test database connection
echo "Testing database connection...\n";

$host = 'localhost';
$port = '3306';
$dbname = 'bmi_tracker';
$username = 'root';
$password = '';

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Successfully connected to the database!\n";
    echo "Database: $dbname\n";
    echo "Host: $host:$port\n";
    
    // Test if we can query the database
    $stmt = $pdo->query('SELECT 1');
    if ($stmt) {
        echo "✅ Database query test successful!\n";
    }
    
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}