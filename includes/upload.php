<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(["message" => "No image uploaded"]);
        exit;
    }

    $file = $_FILES['image'];
    $target_dir = __DIR__ . "/../uploads/";
    
    // Create directory if not exists
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . "." . $extension;
    $target_file = $target_dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        $url = "/uploads/" . $filename;
        echo json_encode(["message" => "Upload success", "url" => $url]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to move uploaded file"]);
    }
}
