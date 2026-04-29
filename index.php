<?php

require_once "databaseConnection.php";

header("Content-Type: application/json");

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($uri === "/getsome" && $method === "GET") {

    $conn = getDBConnection();

    $query = "SELECT * FROM projects";
    $result = $conn->query($query);

    $data = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);

    $conn->close();
    exit;
}

if ($uri === "/home") {
    echo json_encode(["message" => "HOME endpoint"]);
    exit;
}

echo json_encode(["error" => "Not found"]);