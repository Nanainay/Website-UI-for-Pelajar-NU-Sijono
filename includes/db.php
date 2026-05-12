<?php
$config = require __DIR__ . '/config.php';

function db_connect() {
    global $config;
    $conn = new mysqli($config['host'], $config['user'], $config['pass'], $config['name']);

    if ($conn->connect_errno) {
        die('Database connection failed: ' . $conn->connect_error);
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}

function db_query($sql, $types = null, $params = []) {
    $conn = db_connect();
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die('Query prepare failed: ' . $conn->error);
    }

    if ($types !== null && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    $conn->close();

    return $result;
}

function db_fetch_one($sql, $types = null, $params = []) {
    $result = db_query($sql, $types, $params);
    return $result ? $result->fetch_assoc() : null;
}

function db_execute($sql, $types = null, $params = []) {
    $conn = db_connect();
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die('Query execute failed: ' . $conn->error);
    }

    if ($types !== null && !empty($params)) {
        $stmt->bind_param($types, ...$params);
    }

    $success = $stmt->execute();
    $insertId = $conn->insert_id;
    $stmt->close();
    $conn->close();
    return $success ? $insertId : false;
}

function hash_password($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verify_password($password, $hash) {
    if ($password === $hash) {
        return true;
    }
    return password_verify($password, $hash);
}

function current_user() {
    return $_SESSION['user'] ?? null;
}



function base_url($path = '') {
    global $basePath;
    return ($basePath ?: '') . $path;
}
