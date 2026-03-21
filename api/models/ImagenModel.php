<?php
class ImagenModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    // private $upload_path = "uploads/objetos/";

     public function uploadFile($object)
    {
        $file = $object['file'];
        $obj_id = $object['objetos_id_objeto'];
        //Obtener la información del archivo
        $fileName = $file['name'];
        $tempPath = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];

        if (!empty($fileName)) {
            //Crear un nombre único para el archivo
            $fileExt = explode('.', $fileName);
            $fileActExt = strtolower(end($fileExt));
            $fileName =  "objeto-" . uniqid() . "." . $fileActExt;
            //Validar el tipo de archivo
            if (in_array($fileActExt, $this->valid_extensions)) {
                //Validar que no exista
                if (!file_exists($this->upload_path . $fileName)) {
                    //Validar que no sobrepase el tamaño
                    if ($fileSize < 2000000 && $fileError == 0) {
                        //Moverlo a la carpeta del servidor del API
                        if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                            //Guardarlo en la BD
                            $sql = "INSERT INTO imagenes_objeto (objetos_id_objeto,url_imagen) VALUES ($obj_id, '$fileName')";
                            $vResultado = $this->enlace->executeSQL_DML($sql);
                            if ($vResultado > 0) {
                                return 'Imagen creada';
                            }
                            return false;
                        }
                    }
                }
            }
        }
    }
    //   public function uploadFile($object)
    //     {
    //         $file = $object['file'];
    //         $objeto_id = object['objetos_id_objeto'];
    //         //Obtener la información del archivo
    //         $fileName = $file['name'];
    //         $tempPath = $file['tmp_name'];
    //         $fileSize = $file['size'];
    //         $fileError = $file['error'];
    //         if (!empty($fileName)) {
    //             //Crear un nombre único para el archivo
    //             $fileExt = explode('.', $fileName);
    //             $fileActExt = strtolower(end($fileExt));
    //             $fileName = "objeto-" . uniqid() . "." . $fileActExt;
    //             //Validar el tipo de archivo
    //             if (in_array($fileActExt, $this->valid_extensions)) {
    //                 //Validar que no exista
    //                 if (!file_exists($this->upload_path . $fileName)) {
    //                     //Validar que no sobrepase el tamaño
    //                     if ($fileSize < 2000000 && $fileError == 0) {
    //                         //Moverlo a la carpeta del servidor del API
    //                         if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
    //                             //Guardarlo en la BD
    //                             $sql = "INSERT INTO imagenes_objeto (objetos_id_objeto,image) VALUES ($objeto_id, '$fileName')";
    //                             $vResultado = $this->enlace->executeSQL_DML($sql);
    //                             if ($vResultado > 0) {
    //                                 return 'Imagen creada';
    //                             }
    //                             return false;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //Obtener una imagen de una pelicula

    //Obtener una imagen de una pelicula
    public function getImagenObjeto($idObjeto)
    {
        //Consulta sql
        $vSql = "SELECT * FROM imagenes_objeto where objetos_id_objeto=$idObjeto";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            // Retornar el objeto uno

            return $vResultado[0];
        }
        return $vResultado;
    }
}
