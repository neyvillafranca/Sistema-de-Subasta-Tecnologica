<?php

//class Genre
class Imagen{
    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputFILE = $request->getBody();
            //Instancia del modelo
            $imagen = new ImagenModel();
            //Acción del modelo a ejecutar
            $result = $imagen->uploadFile($inputFILE);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
       // GET por id objeto
    public function get($idObjeto)
    {
        $this->getImagen($idObjeto);
    }

    public function getImagen($idObjeto){
        try{
            $response = new Response();
            $imagen = new ImagenModel();
            $result = $imagen->getImagenObjeto($idObjeto);
            $response->toJSON($result);
        }catch(Exception $e){
            $response->toJSON($result);
            handleException($e);
        }
    }
}