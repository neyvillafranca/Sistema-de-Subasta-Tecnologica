<?php
class Actor
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $actor = new ActorModel();
            $result = $actor->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $actor = new ActorModel();
            $result = $actor->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getActorMovie($id)
    {
        try {
            $response = new Response();
            $actor = new ActorModel();
            $result = $actor->getActorMovie($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    public function getMoviesbyActor($param)
    {
        try {
            $response = new Response();
            $actor = new ActorModel();
            $result = $actor->getMoviesbyActor($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}
