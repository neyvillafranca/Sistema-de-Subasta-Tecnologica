<?php
class Subasta
{
    /**
     * GET /subasta/activas
     * Listado subastas activas + cantidad de pujas (campo calculado)
     */
    public function activas()
    {
        try {
            $response = new Response();
            $model    = new SubastaModel();
            $result   = $model->getActivas();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * GET /subasta/finalizadas
     * Listado subastas finalizadas y canceladas + estado + cantidad de pujas
     */
    public function finalizadas()
    {
        try {
            $response = new Response();
            $model    = new SubastaModel();
            $result   = $model->getFinalizadas();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * GET /subasta/{id}
     * Detalle: datos del objeto + datos de la subasta + cantidad_pujas
     */
    public function get($id)
    {
        try {
            $response = new Response();
            $model    = new SubastaModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * GET /subasta/pujas/{id_subasta}
     * Historial de pujas de una subasta específica
     * Orden cronológico descendente (más reciente primero)
     */
    public function pujas($id_subasta)
    {
        try {
            $response = new Response();
            $model    = new PujaModel();
            $result   = $model->getBySubasta($id_subasta);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
}