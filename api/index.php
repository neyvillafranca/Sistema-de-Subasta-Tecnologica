<?php
// Composer autoloader
require_once 'vendor/autoload.php';

/* CORS */
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/* --- Clases core */
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";


/* --- Middleware */
require_once "middleware/AuthMiddleware.php";

/* --- Models */
require_once "models/UsuarioModel.php";
require_once "models/ObjetoModel.php";
require_once "models/SubastaModel.php";
require_once "models/PujaModel.php";
require_once "models/RolModel.php";
require_once "models/EstadoObjetoModel.php";
require_once "models/ImagenModel.php";
require_once "models/CategoriaModel.php";
/* --- Controllers */
require_once "controllers/UsuarioController.php";
require_once "controllers/ObjetoController.php";
require_once "controllers/SubastaController.php";
require_once "controllers/PujaController.php";
require_once "controllers/RolController.php";
require_once "controllers/EstadoObjetoController.php";
require_once "controllers/ImagenController.php";
require_once "controllers/CategoriaController.php";

/* --- Enrutador */
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();