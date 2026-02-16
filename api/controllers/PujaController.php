<?php
class Puja
{
    // GET /subastas/{id}/pujas
    public function getBySubasta($id_subasta)
    {
        try {
            $response = new Response();
            $puja     = new PujaModel();
            $result   = $puja->getBySubasta($id_subasta);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
}