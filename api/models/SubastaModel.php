<?php
class SubastaModel
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

        $estadoSubasta = new EstadoSubastaModel();
        $objetoSubasta = new ObjetoModel();

        $vSQL = "SELECT * FROM subastas ORDER BY fecha_inicio ASC;";
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {

                $id_subasta = $vResultado[$i]->id_subasta;
                // Estado
                $vResultado[$i]->estado = $estadoSubasta->getEstadoSubasta($id_subasta);
                //objeto 
                $vResultado[$i]->objeto = $objetoSubasta->get($id_subasta);
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
        $estadoSubasta = new EstadoSubastaModel();
        $objetoSubasta = new ObjetoModel();
        $pujaModel = new PujaModel();

        $vSql = "SELECT * 
         FROM subastas 
         WHERE id_subasta = $id";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado)) {
            $subasta = $vResultado[0];

            // Estado de la subasta
            $subasta->estado = $estadoSubasta->getEstadoSubasta($subasta->id_subasta);

            // Objeto
            $subasta->objeto = $objetoSubasta->get($subasta->id_objeto);

            // ✅ Cantidad total de pujas (calculado)
            $subasta->cantidad_pujas = $pujaModel->contarPorSubasta($subasta->id_subasta);

            return $subasta;
        }

        return null;
    }
  


//____________________________________________________________________________________________________________________________________________
    /**
     * GET /subastas/activas
     * Listado subastas activas (idestadosubasta = 1)
     * Incluye campo calculado: cantidad_pujas (COUNT desde BD)
     */
    public function getActivas()
    {
        $estadoSubasta = new EstadoSubastaModel();
        $objetoModel = new ObjetoModel();
        $pujaModel = new PujaModel();

        // Consulta simple: solo traer subastas activas
        $vSQL = "SELECT s.* 
             FROM subastas s
             INNER JOIN estado_subasta es ON es.idestado = s.idestado
             WHERE es.descripcion = 'Activa'
             ORDER BY s.fecha_inicio DESC";

        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_subasta = $vResultado[$i]->id_subasta;

                // Objeto con su imagen principal
                $vResultado[$i]->objeto = $objetoModel->get($vResultado[$i]->id_objeto);

                // Cantidad de pujas calculada
                $vResultado[$i]->cantidad_pujas = $pujaModel->contarPorSubasta($id_subasta);
            }
        }

        return $vResultado;
    }

    /**
     * GET /subastas/finalizadas
     * Listado subastas finalizadas y canceladas (idestadosubasta IN 2,3)
     * Incluye campo calculado: cantidad_pujas y estado legible
     */
    public function getFinalizadas()
    {
        $estadoSubasta = new EstadoSubastaModel();
        $objetoModel = new ObjetoModel();
        $pujaModel = new PujaModel();

        // Consulta simple: solo traer subastas finalizadas o canceladas
        $vSQL = "SELECT s.* 
             FROM subastas s
             INNER JOIN estado_subasta es ON es.idestado = s.idestado
             WHERE es.descripcion IN ('Finalizada', 'Cancelada')
             ORDER BY s.fecha_cierre DESC";

        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_subasta = $vResultado[$i]->id_subasta;

                // Estado de la subasta
                $vResultado[$i]->estado = $estadoSubasta->getEstadoSubasta($id_subasta);

                // Objeto con su imagen principal
                $vResultado[$i]->objeto = $objetoModel->get($vResultado[$i]->id_objeto);

                // Cantidad de pujas calculada
                $vResultado[$i]->cantidad_pujas = $pujaModel->contarPorSubasta($id_subasta);
            }
        }

        return $vResultado;
    }
    /**
     * GET /subastas/{id}
     * Detalle completo de una subasta:
     * - Información del objeto (nombre, imagen, categorías, condición)
     * - Datos completos de la subasta
     * - Campo calculado: cantidad_pujas
     */
    public function gett($id)
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
