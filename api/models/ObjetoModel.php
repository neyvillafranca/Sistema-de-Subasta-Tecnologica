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
        $subastaO = new SubastaModel();
        $usuarioO = new UsuarioModel();

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
            // Propietario (vendedor)
            $objeto->propietario = $usuarioO->get($objeto->id_vendedor);

            // Historial de subastas donde participó
            $objeto->historial_subastas = $this->getHistorialSubastas($objeto->id_objeto);


            return $objeto;
        }

        return null;
    }

    private function getHistorialSubastas($id_objeto)
    {
        $estadoSubasta = new EstadoSubastaModel();

        $vSql = "SELECT 
                s.id_subasta,
                s.fecha_inicio,
                s.fecha_cierre,
                s.idestado
             FROM subastas s
             WHERE s.id_objeto = $id_objeto
             ORDER BY s.fecha_inicio DESC";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($resultado) && is_array($resultado)) {
            // Agregar el estado de cada subasta
            for ($i = 0; $i < count($resultado); $i++) {
                $resultado[$i]->estado_subasta = $estadoSubasta->getEstadoSubasta($resultado[$i]->id_subasta);
            }
        }

        return $resultado ?: [];
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

    /*public function create($objeto)
    {
        // 🔹 Validaciones de negocio
        if (empty($objeto->nombre)) {
            throw new Exception("Nombre requerido");
        }

        if (strlen($objeto->descripcion) < 20) {
            throw new Exception("Descripción mínima 20 caracteres");
        }

        if (empty($objeto->categorias) || count($objeto->categorias) < 1) {
            throw new Exception("Debe seleccionar al menos una categoría");
        }*/

        /*if (empty($objeto->imagenes) || count($objeto->imagenes) < 1) {
            throw new Exception("Debe agregar al menos una imagen");
        }*/

        // 🔹 Usuario vendedor simulado
        /*$idVendedor = $objeto->id_vendedor; // viene del controller como usuario actual

        // 🔹 Estado inicial activo (ej: 1)
        $estadoInicial = 1;

        $sql = "INSERT INTO objetos 
            (id_vendedor, nombre, descripcion, condicion, idestadoobjeto)
            VALUES 
            ($idVendedor,
            '$objeto->nombre',
            '$objeto->descripcion',
            $objeto->condicion,
            $estadoInicial)";

        $idObjeto = $this->enlace->executeSQL_DML_last($sql);

        // 🔹 Insertar categorías
        foreach ($objeto->categorias as $categoria) {
            $sql = "INSERT INTO categoria_objeto (idobjeto, idcategoria)
                VALUES ($idObjeto, $categoria)";
            $this->enlace->executeSQL_DML($sql);
        }

        // 🔹 Insertar imágenes
        foreach ($objeto->imagenes as $imagen) {
            $sql = "INSERT INTO imagenes_objeto (url_imagen, objetos_id_objeto)
                VALUES ('$imagen', $idObjeto)";
            $this->enlace->executeSQL_DML($sql);
        }

        return $this->get($idObjeto);
    }*/
    public function create($objeto)
{
    
    

    $idVendedor = $objeto->id_vendedor ?? 2;
    $estadoInicial = 1;

    // 🔹 Insertar objeto
    $sql = "INSERT INTO objetos 
        (id_vendedor, nombre, descripcion, condicion, idestadoobjeto, fecha_registro)
        VALUES (
            $idVendedor,
            '$objeto->nombre',
            '$objeto->descripcion',
            '$objeto->condicion',
            $estadoInicial,
            NOW()
        )";

    $idObjeto = $this->enlace->executeSQL_DML_last($sql);

    // 🔹 Insertar categorías (VALIDADO)
    
    foreach ($objeto->categorias as $categoriaId) {
    $sqlCat = "
        INSERT INTO categoria_objeto (idobjeto, idcategoria, descripcion)
        VALUES (
            $idObjeto,
            $categoriaId,
            'Categoría asociada al objeto'
        )
    ";
    $this->enlace->executeSQL_DML($sqlCat);
}

    // 🔹 DEVOLVER ALGO SEGURO
    return [
        "success" => true,
        "id_objeto" => $idObjeto
    ];
}

    public function update($objeto)
    {
        // 🔹 Verificar si está en subasta activa
        $sqlValidar = "SELECT COUNT(*) as total
                   FROM subastas s
                   WHERE s.id_objeto = $objeto->id_objeto
                   AND s.idestado = 1"; // 1 = activa

        $res = $this->enlace->ExecuteSQL($sqlValidar);

        if ($res[0]->total > 0) {
            throw new Exception("No se puede editar. El objeto está en subasta activa.");
        }

        // 🔹 Update objeto
        $sql = "UPDATE objetos SET
            nombre = '$objeto->nombre',
            descripcion = '$objeto->descripcion',
            condicion = $objeto->condicion
            WHERE id_objeto = $objeto->id_objeto";

        $this->enlace->executeSQL_DML($sql);

        // 🔹 Eliminar categorías anteriores
        $sql = "DELETE FROM categoria_objeto
            WHERE idobjeto = $objeto->id_objeto";
        $this->enlace->executeSQL_DML($sql);

        // 🔹 Insertar nuevas categorías
        foreach ($objeto->categorias as $categoria) {
            $sql = "INSERT INTO categoria_objeto (idobjeto, idcategoria)
                VALUES ($objeto->id_objeto, $categoria)";
            $this->enlace->executeSQL_DML($sql);
        }

        // 🔹 Eliminar imágenes anteriores
        $sql = "DELETE FROM imagenes_objeto
            WHERE objetos_id_objeto = $objeto->id_objeto";
        $this->enlace->executeSQL_DML($sql);

        // 🔹 Insertar nuevas imágenes
        foreach ($objeto->imagenes as $imagen) {
            $sql = "INSERT INTO imagenes_objeto (url_imagen, objetos_id_objeto)
                VALUES ('$imagen', $objeto->id_objeto)";
            $this->enlace->executeSQL_DML($sql);
        }

        return $this->get($objeto->id_objeto);
    }

    public function delete($id)
    {
        // Verificar si tiene subastas
        $sql = "SELECT COUNT(*) as total
            FROM subastas
            WHERE id_objeto = $id";

        $res = $this->enlace->ExecuteSQL($sql);

        if ($res[0]->total > 0) {
            throw new Exception("No se puede eliminar. El objeto ya fue subastado.");
        }

        // Eliminación lógica → cambiar estado
        $sql = "UPDATE objetos
            SET idestadoobjeto = 0
            WHERE id_objeto = $id";

        $this->enlace->executeSQL_DML($sql);

        return true;
    }

    public function changeEstado($id, $estado)
    {
        $sql = "UPDATE objetos
            SET idestadoobjeto = $estado
            WHERE id_objeto = $id";

        $this->enlace->executeSQL_DML($sql);

        return $this->get($id);
    }
    /**
     * Crear pelicula
     * @param $objeto pelicula a insertar
     * @return $this->get($idMovie) - Objeto pelicula
     */
    //

    /**
     * Crear nuevo objeto subastable
     * @param $objeto - Objeto con los datos del nuevo objeto
     * @return $this->get($idObjeto) - Objeto creado
     */
//     public function create($objeto)
//     {
//         // Usuario vendedor simulado (variable lógica)
//         $id_vendedor = $objeto->id_vendedor ?? 2; // Simular usuario actual
        
//         // Insertar objeto
//         $sql = "INSERT INTO objetos (id_vendedor, nombre, descripcion, condicion, idestadoobjeto)" .
//                " VALUES ($id_vendedor, '$objeto->nombre', '$objeto->descripcion', " .
//                "$objeto->condicion, $objeto->idestadoobjeto)";

//         $idObjeto = $this->enlace->executeSQL_DML_last($sql);

//         // Insertar categorías (mínimo 1)
//         foreach ($objeto->categorias as $idCategoria) {
//             $sql = "INSERT INTO categoria_objeto (idobjeto, idcategoria)" .
//                    " VALUES ($idObjeto, $idCategoria)";
//             $this->enlace->executeSQL_DML($sql);
//         }

//         // Insertar imágenes (mínimo 1)
//         foreach ($objeto->imagenes as $urlImagen) {
//             $sql = "INSERT INTO imagenes_objeto (objetos_id_objeto, url_imagen)" .
//                    " VALUES ($idObjeto, '$urlImagen')";
//             $this->enlace->executeSQL_DML($sql);
//         }

//         return $this->get($idObjeto);
//     }

//     /**
//      * Actualizar objeto existente
//      * Solo si no está en subasta activa
//      * @param $objeto - Objeto con los datos a actualizar
//      * @return $this->get($objeto->id_objeto) - Objeto actualizado
//      */
//     public function update($objeto)
//     {
//         // Validar que no esté en subasta activa
//         if (!$this->puedeEditar($objeto->id_objeto)) {
//             throw new Exception("No se puede editar: el objeto está en una subasta activa");
//         }

//         // Actualizar objeto
//         $sql = "UPDATE objetos SET " .
//                "nombre = '$objeto->nombre', " .
//                "descripcion = '$objeto->descripcion', " .
//                "condicion = $objeto->condicion, " .
//                "idestadoobjeto = $objeto->idestadoobjeto " .
//                "WHERE id_objeto = $objeto->id_objeto";

//         $this->enlace->executeSQL_DML($sql);

//         // Eliminar categorías existentes
//         $sql = "DELETE FROM categoria_objeto WHERE idobjeto = $objeto->id_objeto";
//         $this->enlace->executeSQL_DML($sql);

//         // Insertar nuevas categorías
//         foreach ($objeto->categorias as $idCategoria) {
//             $sql = "INSERT INTO categoria_objeto (idobjeto, idcategoria)" .
//                    " VALUES ($objeto->id_objeto, $idCategoria)";
//             $this->enlace->executeSQL_DML($sql);
//         }

//         // Eliminar imágenes existentes
//         $sql = "DELETE FROM imagenes_objeto WHERE objetos_id_objeto = $objeto->id_objeto";
//         $this->enlace->executeSQL_DML($sql);

//         // Insertar nuevas imágenes
//         foreach ($objeto->imagenes as $urlImagen) {
//             $sql = "INSERT INTO imagenes_objeto (objetos_id_objeto, url_imagen)" .
//                    " VALUES ($objeto->id_objeto, '$urlImagen')";
//             $this->enlace->executeSQL_DML($sql);
//         }

//         return $this->get($objeto->id_objeto);
//     }

//     /**
//      * Verificar si un objeto puede ser editado
//      * No puede editarse si está en una subasta activa
//      */
//     private function puedeEditar($id_objeto)
//     {
//         $id_objeto = intval($id_objeto);
        
//         $sql = "SELECT COUNT(*) AS total
//                 FROM subastas s
//                 INNER JOIN estado_subasta es ON es.idestado = s.idestado
//                 WHERE s.id_objeto = $id_objeto
//                 AND es.descripcion = 'Activa'";

//         $resultado = $this->enlace->executeSQL($sql, "asoc");
        
//         return $resultado[0]['total'] == 0;
//     }

//     /**
//      * Verificar si un objeto puede ser eliminado
//      * No puede eliminarse si ha sido subastado o está en subasta activa
//      */
//     private function puedeEliminar($id_objeto)
//     {
//         $id_objeto = intval($id_objeto);
        
//         $sql = "SELECT COUNT(*) AS total
//                 FROM subastas
//                 WHERE id_objeto = $id_objeto";

//         $resultado = $this->enlace->executeSQL($sql, "asoc");
        
//         return $resultado[0]['total'] == 0;
//     }

//     /**
//      * Eliminación lógica de objeto
//      * Solo si no ha sido subastado
//      */
//     public function delete($id_objeto)
//     {
//         $id_objeto = intval($id_objeto);

//         if (!$this->puedeEliminar($id_objeto)) {
//             throw new Exception("No se puede eliminar: el objeto ya ha sido subastado");
//         }

//         // Cambiar estado a inactivo (eliminación lógica)
//         $sql = "UPDATE objetos SET idestadoobjeto = 4 WHERE id_objeto = $id_objeto";
        
//         return $this->enlace->executeSQL_DML($sql);
//     }

//     /**
//      * Activar/Desactivar objeto
//      */
//     public function cambiarEstado($id_objeto, $nuevoEstado)
//     {
//         $id_objeto = intval($id_objeto);
//         $nuevoEstado = intval($nuevoEstado);

//         $sql = "UPDATE objetos SET idestadoobjeto = $nuevoEstado WHERE id_objeto = $id_objeto";
        
//         return $this->enlace->executeSQL_DML($sql);
//     }
// }
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
