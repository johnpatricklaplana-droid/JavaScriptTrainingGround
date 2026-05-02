<?php

require_once "database/databaseConnection.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

function createOwner() {
    $conn = getDBConnection();

    $query = "SELECT * FROM owner";
    $result = $conn->query($query);

    if ($result->num_rows === 0) {
        $defaultPassword = password_hash("1111111111", PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO owner (password) VALUES (?)");

        $stmt->bind_param("s", $defaultPassword);
        $stmt->execute();
    }

    $conn->close();
}

createOwner();

if ($uri === "/JavaScriptTrainingGround/backend/src/index.php/save-project") {

    if($method !== "POST") {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
    }

    session_start();

    if (!isset($_SESSION['owner_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized", "status" => 401]);
        exit;
    }

    error_log("Invalid project_data received in save-project");

    $project_data = json_decode($_POST['project_data'], true);
    $images = $_FILES['images'] ?? null;
 
    $title = $project_data['title'];
    $description = $project_data['description'];

    if(!$project_data) {
        http_response_code(400);
        echo json_encode(['error' => 'super bad request']);
        exit;
    }

    $conn = getDBConnection();

    $stmt = $conn->prepare("INSERT INTO projects (title, description) VALUES(?, ?)");
    $stmt->bind_param("ss", $title, $description);
    $stmt->execute();

    $projectId = $conn->insert_id;

    for($i = 0; $i < count($images['name']); $i++) {
        
        $tmp = $images['tmp_name'][$i];
        $name = $images['name'][$i];

        $targetPath = __DIR__ . '/../../../images/' . $name;

        move_uploaded_file($tmp, $targetPath);

        $imageUrl = '/images/' . $name;

        $stmttoo = $conn->prepare("INSERT INTO images (imageUrl, project_id) VALUES(?, ?)");
        $stmttoo->bind_param("ss", $imageUrl, $projectId);
        $stmttoo->execute();
        
    }

    http_response_code(201);
    echo json_encode(["message" => "created one", "status" => 201]);

    $conn->close();
    exit;
}

if ($uri === "/JavaScriptTrainingGround/backend/src/index.php/get-projects") {

    $conn = getDBConnection();

    $query = "SELECT * FROM projects AS p INNER JOIN images AS i ON p.id = i.project_id";
    $statement = $conn->prepare($query);

    $statement->execute();

    $result = $statement->get_result();
    $projects = [];
    
    while ($row = $result->fetch_assoc()) {
    $id = $row['project_id'];

        if (!isset($projects[$id])) {
            $projects[$id] = [
                "project_id" => $id,
                "title" => $row['title'],
                "description" => $row['description'],
                "date" => $row['date']
            ];
        }

        if ($row['imageUrl']) {
            $projects[$id]['images'][] = $row['imageUrl'];
        }
    }

    $projects = array_values($projects);

    header('Content-Type: application/json');

    http_response_code(200);
    echo json_encode(["data" => $projects, "status" => 200]);
    exit;
}

if ($uri === "/JavaScriptTrainingGround/backend/src/index.php/get-project") {

    $project_id = $_GET['id'];

    $conn = getDBConnection();

    $query = "SELECT * FROM projects WHERE id = ?";
    $statement = $conn->prepare($query);
    $statement->bind_param("s", $project_id);
    $statement->execute();

    $statement->execute();

    $result = $statement->get_result();
    $data = $result->fetch_assoc();

    header('Content-Type: application/json');

    http_response_code(200);
    echo json_encode(["data" => $data, "status" => 200]);
    exit;
    
}

if($uri === "/JavaScriptTrainingGround/backend/src/index.php/edit-project") {

    if($method !== "PUT") {
        echo json_encode(["message" => "method not allowed"]);
    }

    session_start();

    if (!isset($_SESSION['owner_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $rawData = file_get_contents("php://input");

    $project_data = json_decode($rawData, true);

    $project_id = $project_data['project_id'];
    $title = $project_data['title'];
    $description = $project_data['description'];
    $date = $project_data['date'];

    $conn = getDBConnection();

    $query = "UPDATE projects set date = ?, description = ?, title = ? WHERE id = ?";
    $statement = $conn->prepare($query);
    $statement->bind_param("ssss", $date, $description, $title, $project_id);
    $statement->execute();

    http_response_code(204);
    echo json_encode(["error" => "Updated one"]);
    exit;
}

if($uri === "/JavaScriptTrainingGround/backend/src/index.php/auth") {

    if ($method !== "POST") {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        exit;
    }

    session_start();

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    $password = $data['password'] ?? null;

    if (!$password) {
        http_response_code(400);
        echo json_encode(["error" => "Password required"]);
        exit;
    }

    $conn = getDBConnection();

    $query = "SELECT * FROM owner";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $result = $stmt->get_result();
    $owner = $result->fetch_assoc();

    if ($owner && password_verify($password, $owner['password'])) {

        $_SESSION['owner_id'] = $owner['id'];

        http_response_code(200);
        echo json_encode([
            "message" => "Authenticated",
            "authenticated" => true
        ]);

    } else {
        http_response_code(401);
        echo json_encode([
            "error" => "Invalid password",
            "authenticated" => false
        ]);
    }

    exit;
    
}

if($uri === "/JavaScriptTrainingGround/backend/src/index.php/delete-project") {

    if ($method !== "DELETE") {
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        exit;
    }

    session_start();

    if (!isset($_SESSION['owner_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized", "status" => 401]);
        exit;
    }

    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    $project_id = $data['project_id'] ?? null;

    if (!$project_id) {
        http_response_code(400);
        echo json_encode(["error" => "Super bad request"]);
        exit;
    }

    $conn = getDBConnection();

    $query = "DELETE FROM projects WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $project_id);
    $stmt->execute();

    http_response_code(200);
    echo json_encode([
        "message" => "deleted one",
        "status" => 200
    ]);
    
    exit;
    
}

http_response_code(404);
echo json_encode(["error" => "Not found"]);