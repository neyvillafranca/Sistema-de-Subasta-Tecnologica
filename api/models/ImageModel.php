<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    //Subir imagen de una pelicula registrada
    public function uploadFile($object)
    {
        return false;
    }
    //Obtener una imagen de una pelicula
    public function getImageMovie($idMovie)
    {
        //Consulta sql
        $vSql = "SELECT * FROM movie_image where movie_id=$idMovie";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            // Retornar el objeto uno
            
            return $vResultado[0];
        }
        return $vResultado;
    }
}
