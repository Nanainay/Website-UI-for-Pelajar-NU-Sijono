<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    exit;
}

$conn = db_connect();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $sql = "SELECT * FROM articles WHERE id = ?";
            $result = db_query($sql, 'i', [$_GET['id']]);
            $article = $result->fetch_assoc();
            if ($article) {
                $article['sections'] = json_decode($article['sections'] ?? '[]', true);
                $article['gallery'] = json_decode($article['gallery'] ?? '[]', true);
                echo json_encode($article);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Article not found"]);
            }
        } else {
            $sql = "SELECT * FROM articles ORDER BY date DESC";
            $result = db_query($sql);
            $articles = [];
            while ($row = $result->fetch_assoc()) {
                $row['sections'] = json_decode($row['sections'] ?? '[]', true);
                $row['gallery'] = json_decode($row['gallery'] ?? '[]', true);
                $articles[] = $row;
            }
            echo json_encode($articles);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        
        $sql = "INSERT INTO articles (title, slug, date, author, category, content, status, image, sections, gallery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $params = [
            $data['title'],
            $slug,
            $data['date'],
            $data['author'],
            $data['category'],
            $data['content'],
            $data['status'],
            $data['image'],
            json_encode($data['sections']),
            json_encode($data['gallery'])
        ];
        
        $id = db_execute($sql, 'ssssssssss', $params);
        if ($id) {
            echo json_encode(["message" => "Article created", "id" => $id]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create article"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["message" => "ID required"]);
            break;
        }
        
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));
        $sql = "UPDATE articles SET title=?, slug=?, date=?, author=?, category=?, content=?, status=?, image=?, sections=?, gallery=? WHERE id=?";
        $params = [
            $data['title'],
            $slug,
            $data['date'],
            $data['author'],
            $data['category'],
            $data['content'],
            $data['status'],
            $data['image'],
            json_encode($data['sections']),
            json_encode($data['gallery']),
            $_GET['id']
        ];
        
        $success = db_execute($sql, 'ssssssssssi', $params);
        if ($success !== false) {
            echo json_encode(["message" => "Article updated"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update article"]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(["message" => "ID required"]);
            break;
        }
        $sql = "DELETE FROM articles WHERE id = ?";
        $success = db_execute($sql, 'i', [$_GET['id']]);
        if ($success !== false) {
            echo json_encode(["message" => "Article deleted"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete article"]);
        }
        break;
}
