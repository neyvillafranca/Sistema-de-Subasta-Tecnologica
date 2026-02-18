<?php
class EstadoSubasta
{
    //Metodo para Listar Usuario
    public function index()
    {
        try {
            $response = new Response();
            $model    = new EstadoSubastaModel();
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
            $model    = new EstadoSubastaModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
}