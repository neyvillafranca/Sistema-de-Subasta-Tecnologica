 <?php
 require_once "controllers/RolController.php";
 class Rol {
//listar todos
 public function index()
    {
        try {
            $response = new Response();
            $model    = new RolModel();
            $result   = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
//listar por id
    public function get($id)
    {
        try {
            $response = new Response();
            $model    = new RolModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
    //listar 

 }