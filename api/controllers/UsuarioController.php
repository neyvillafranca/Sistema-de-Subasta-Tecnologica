<?php
class Usuario
{
    //Metodo para Listar Usuario
    public function index()
    {
        try {
            $response = new Response();
            $model    = new UsuarioModel();
            $result   = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * GET /usuario/{id}
     * Detalle + campos calculados (subastas creadas, pujas realizadas)
     */
    public function get($id)
    {
        try {
            $response = new Response();
            $model    = new UsuarioModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $usuario = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $usuario->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}