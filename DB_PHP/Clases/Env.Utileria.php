<?php
include("vendor/autoload.php");
$dotenv;

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->safeLoad();
} catch (Exception $e) {
    echo "Error en utileria";
}
