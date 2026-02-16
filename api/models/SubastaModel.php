<?php
class SubastaModel
{
    /**
     * GET /subastas/activas
     * Listado subastas activas (idestadosubasta = 1)
     * Incluye campo calculado: cantidad_pujas (COUNT desde BD)
     */
    public function getActivas()
    {
        $db  = new MySqlConnect();
        $sql = "SELECT 
                    s.id_subasta,
                    o.nombre                AS objeto,
                    s.fecha_inicio,
                    s.fecha_cierre,
                    s.precio_base,
                    s.incremento_minimo,
                    (
                        SELECT COUNT(*)
                        FROM pujas p
                        WHERE p.id_subasta = s.id_subasta
                    )                       AS cantidad_pujas,
                    (
                        SELECT img.url_imagen
                        FROM imagenes_objeto img
                        WHERE img.objetos_id_objeto = o.id_objeto
                        ORDER BY img.id_imagen_objeto ASC
                        LIMIT 1
                    )                       AS imagen_objeto
                FROM subastas s
                INNER JOIN objetos o ON s.id_objeto = o.id_objeto
                INNER JOIN estado_subasta es ON es.idestado = s.idestado
                WHERE es.descripcion = 'Activa'
                ORDER BY s.fecha_inicio DESC";

        return $db->executeSQL($sql, "asoc");
    }

    /**
     * GET /subastas/finalizadas
     * Listado subastas finalizadas y canceladas (idestadosubasta IN 2,3)
     * Incluye campo calculado: cantidad_pujas y estado legible
     */
    public function getFinalizadas()
    {
        $db  = new MySqlConnect();
        $sql = "SELECT 
                    s.id_subasta,
                    o.nombre                AS objeto,
                    s.fecha_cierre,
                    s.precio_base,
                    s.incremento_minimo,
                    es.descripcion          AS estado_final,
                    (
                        SELECT COUNT(*)
                        FROM pujas p
                        WHERE p.id_subasta = s.id_subasta
                    )                       AS cantidad_pujas,
                    (
                        SELECT img.url_imagen
                        FROM imagenes_objeto img
                        WHERE img.objetos_id_objeto = o.id_objeto
                        ORDER BY img.id_imagen_objeto ASC
                        LIMIT 1
                    )                       AS imagen_objeto
                FROM subastas s
                INNER JOIN objetos o ON s.id_objeto = o.id_objeto
                INNER JOIN estado_subasta es ON es.idestado = s.idestado
                WHERE es.descripcion IN ('Finalizada', 'Cancelada')
                ORDER BY s.fecha_cierre DESC";

        return $db->executeSQL($sql, "asoc");
    }

    /**
     * GET /subastas/{id}
     * Detalle completo de una subasta:
     * - Información del objeto (nombre, imagen, categorías, condición)
     * - Datos completos de la subasta
     * - Campo calculado: cantidad_pujas
     */
    public function get($id)
    {
        $db = new MySqlConnect();
        $id = intval($id);

        $sql = "SELECT 
                    s.id_subasta,
                    s.fecha_inicio,
                    s.fecha_cierre,
                    s.precio_base,
                    s.incremento_minimo,
                    es.descripcion          AS estado_actual,
                    o.id_objeto,
                    o.nombre                AS objeto_nombre,
                    CASE o.condicion
                        WHEN 1 THEN 'Nuevo'
                        WHEN 2 THEN 'Usado'
                        ELSE 'Desconocido'
                    END                     AS objeto_condicion,
                    (
                        SELECT GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', ')
                        FROM categoria_objeto co
                        INNER JOIN categorias c ON co.idcategoria = c.id_categoria
                        WHERE co.idobjeto = o.id_objeto
                    )                       AS objeto_categorias,
                    (
                        SELECT img.url_imagen
                        FROM imagenes_objeto img
                        WHERE img.objetos_id_objeto = o.id_objeto
                        ORDER BY img.id_imagen_objeto ASC
                        LIMIT 1
                    )                       AS objeto_imagen,
                    (
                        SELECT COUNT(*)
                        FROM pujas p
                        WHERE p.id_subasta = s.id_subasta
                    )                       AS cantidad_pujas
                FROM subastas s
                INNER JOIN objetos o ON s.id_objeto = o.id_objeto
                INNER JOIN estado_subasta es ON es.idestado = s.idestado
                WHERE s.id_subasta = $id
                LIMIT 1";

        $resultado = $db->executeSQL($sql, "asoc");

        if (empty($resultado)) {
            return null;
        }

        return $resultado;
    }
}