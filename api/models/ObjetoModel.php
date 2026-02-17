<?php
class ObjetoModel
{

    //Conectarse a la BD
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * Listar peliculas
     * @param 
     * @return $vResultado - Lista de objetos
     */
   public function all()
{
    $imagenM = new ImagenModel();
    $categoriaM = new CategoriaModel();
    $estadoM = new EstadoObjetoModel();

    $vSQL = "SELECT * FROM objetos ORDER BY nombre ASC;";
    $vResultado = $this->enlace->ExecuteSQL($vSQL);

    if (!empty($vResultado) && is_array($vResultado)) {
        for ($i = 0; $i < count($vResultado); $i++) {

            $idObjeto = $vResultado[$i]->id_objeto;

            // Imagen
            $vResultado[$i]->imagen = $imagenM->getImagenObjeto($idObjeto);

            // Categorías
            $vResultado[$i]->categoria = $categoriaM->getCategoriaObjeto($idObjeto);

            // Estado
            $vResultado[$i]->estado = $estadoM->getEstadoObjeto($idObjeto);
        }
    }

    return $vResultado;
}

    /**
     * Obtener una pelicula
     * @param $id de la pelicula
     * @return $vresultado - Objeto pelicula
     */
    //
   public function get($id)
{
    $estadoO = new EstadoObjetoModel();
    $categoriaO = new CategoriaModel();
    $imagenO = new ImagenModel();

    $id = intval($id);

    $vSql = "SELECT * 
             FROM objetos 
             WHERE id_objeto = $id";

    $vResultado = $this->enlace->ExecuteSQL($vSql);

    if (!empty($vResultado)) {
        $objeto = $vResultado[0];

        // Imagen (por id_objeto)
        $objeto->imagen = $imagenO->getImagenObjeto($objeto->id_objeto);

        // Categorías (tabla puente)
        $objeto->categoria = $categoriaO->getCategoriaObjeto($objeto->id_objeto);

        // Estado del objeto (por id_objeto)
        $objeto->estado = $estadoO->getEstadoObjeto($objeto->id_objeto);

        return $objeto;
    }

    return null;
}

    /**
     * Obtener las peliculas por tienda
     * @param $idShopRental identificador de la tienda
     * @return $vresultado - Lista de peliculas incluyendo el precio
     */
    //
    //Obtener el inventario de películas de una tienda, incluyendo nombre de la película y precio
    // public function objetosByShopRental($idShopRental)
    // {
    //     $imagenM = new ImageModel();
    //     //Consulta SQL
    //     $vSQL = "SELECT m.*, i.price
    //                 FROM movie m, inventory i
    //                 where 
    //                 m.id=i.movie_id
    //                 and shop_id=$idShopRental
    //                 order by m.title desc";
    //     //Ejecutar la consulta
    //     $vResultado = $this->enlace->ExecuteSQL($vSQL);

    //     //Incluir imagenes
    //     if (!empty($vResultado) && is_array($vResultado)) {
    //         for ($i = 0; $i < count($vResultado); $i++) {
    //             $vResultado[$i]->imagen = $imagenM->getImageMovie(($vResultado[$i]->id));
    //         }
    //     }
    //     //Retornar la respuesta

    //     return $vResultado;
    // }
        
    public function objetosBySubasta($idSubasta)
    {
        $subastaO = new SubastaModel();
        //Consulta SQL
        $vSql = "SELECT o.*
            FROM objetos o
            INNER JOIN subastas s 
                ON s.id_objeto = o.id_objeto
            WHERE s.id_subasta = $idSubasta";

             $vResultado = $this->enlace->ExecuteSQL($vSql);
        //Retornar la respuesta

        return $vResultado;
    }
    /**
     * Obtener la cantidad de peliculas por genero
     * @param 
     * @return $vresultado - Cantidad de peliculas por genero
     */
    //
    // public function getCountByGenre()
    // {

    //     $vResultado = null;
    //     //Consulta sql
    //     $vSql = "SELECT count(mg.genre_id) as 'Cantidad', g.title as 'Genero'
	// 		FROM genre g, movie_genre mg, movie m
	// 		where mg.movie_id=m.id and mg.genre_id=g.id
	// 		group by mg.genre_id";

    //     //Ejecutar la consulta
    //     $vResultado = $this->enlace->ExecuteSQL($vSql);
    //     // Retornar el objeto
    //     return $vResultado;
    // }



     
    // // public function all()
    // // {
    //     $db  = new MySqlConnect();

    //     // Imagen principal: primer registro de imagenes_objeto para cada objeto
    //     $sql = "SELECT 
    //                 o.id_objeto,
    //                 o.nombre,
    //                 u.nombre_completo       AS dueno,
    //                 CASE o.condicion
    //                     WHEN 1 THEN 'Nuevo'
    //                     WHEN 2 THEN 'Usado'
    //                     ELSE 'Desconocido'
    //                 END                     AS condicion,
    //                 eo.descripcion          AS estado_objeto,
    //                 (
    //                     SELECT GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', ')
    //                     FROM categoria_objeto co
    //                     INNER JOIN categorias c ON co.idcategoria = c.id_categoria
    //                     WHERE co.idobjeto = o.id_objeto
    //                 )                       AS categorias,
    //                 (
    //                     SELECT img.url_imagen
    //                     FROM imagenes_objeto img
    //                     WHERE img.objetos_id_objeto = o.id_objeto
    //                     ORDER BY img.id_imagen_objeto ASC
    //                     LIMIT 1
    //                 )                       AS imagen_principal
    //             FROM objetos o
    //             INNER JOIN usuarios u  ON o.id_vendedor     = u.id_usuario
    //             INNER JOIN estado_objeto eo ON eo.idestadoobjeto = o.idestadoobjeto
    //             ORDER BY o.fecha_registro DESC";

    //     return $db->executeSQL($sql, "asoc");
    // }

    
    // public function get($id)
    // {
    //     $db = new MySqlConnect();
    //     $id = intval($id);

    //     // Información completa del objeto
    //     $sql = "SELECT 
    //                 o.id_objeto,
    //                 o.nombre,
    //                 o.descripcion,
    //                 u.nombre_completo       AS dueno,
    //                 CASE o.condicion
    //                     WHEN 1 THEN 'Nuevo'
    //                     WHEN 2 THEN 'Usado'
    //                     ELSE 'Desconocido'
    //                 END                     AS condicion,
    //                 eo.descripcion          AS estado_objeto,
    //                 o.fecha_registro,
    //                 (
    //                     SELECT GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', ')
    //                     FROM categoria_objeto co
    //                     INNER JOIN categorias c ON co.idcategoria = c.id_categoria
    //                     WHERE co.idobjeto = o.id_objeto
    //                 )                       AS categorias
    //             FROM objetos o
    //             INNER JOIN usuarios u  ON o.id_vendedor     = u.id_usuario
    //             INNER JOIN estado_objeto eo ON eo.idestadoobjeto = o.idestadoobjeto
    //             WHERE o.id_objeto = $id
    //             LIMIT 1";

    //     $resultado = $db->executeSQL($sql, "asoc");

    //     if (empty($resultado)) {
    //         return null;
    //     }

    //     $objeto = $resultado[0];

    //     // Todas las imágenes del objeto
    //     $sqlImagenes = "SELECT url_imagen
    //                     FROM imagenes_objeto
    //                     WHERE objetos_id_objeto = $id
    //                     ORDER BY id_imagen_objeto ASC";

    //     $imagenes = $db->executeSQL($sqlImagenes, "asoc");
    //     $objeto['imagenes'] = $imagenes ?? [];

    //     // Historial de subastas donde ha participado este objeto
    //     $sqlSubastas = "SELECT 
    //                         s.id_subasta,
    //                         s.fecha_inicio,
    //                         s.fecha_cierre,
    //                         es.descripcion AS estado_subasta
    //                     FROM subastas s
    //                     INNER JOIN estado_subasta es ON es.idestado = s.idestado
    //                     WHERE s.id_objeto = $id
    //                     ORDER BY s.fecha_inicio DESC";

    //     $subastas = $db->executeSQL($sqlSubastas, "asoc");
    //     $objeto['historial_subastas'] = $subastas ?? [];

    //     return [$objeto];
    // }
    
}