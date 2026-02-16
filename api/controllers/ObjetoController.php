<?php
class Objeto
{
    /**
     * GET /objeto
     * Listado con imagen principal, categorías, condición, estado, dueño
     */
    public function index()
    {
        try {
            $response = new Response();
            $model    = new ObjetoModel();
            $result   = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * GET /objeto/{id}
     * Detalle completo + todas las imágenes + historial de subastas
     */
    public function get($id)
    {
        try {
            $response = new Response();
            $model    = new ObjetoModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
}