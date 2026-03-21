<?php
class SubastaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        $estadoSubasta = new EstadoSubastaModel();
        $objetoModel   = new ObjetoModel();

        $sql = "SELECT * FROM subastas ORDER BY fecha_inicio ASC";
        $resultado = $this->enlace->ExecuteSQL($sql);

        if (!empty($resultado)) {
            foreach ($resultado as $i => $subasta) {
                $resultado[$i]->estado = $estadoSubasta->getEstadoSubasta($subasta->idestado);
                $resultado[$i]->objeto = $objetoModel->get($subasta->id_objeto);
            }
        }

        return $resultado;
    }

    public function get($id)
    {
        $id = intval($id);

        $estadoSubasta = new EstadoSubastaModel();
        $objetoSubasta = new ObjetoModel();
        $pujaModel = new PujaModel();

        $sql = "SELECT * FROM subastas WHERE id_subasta = $id LIMIT 1";
        $resultado = $this->enlace->ExecuteSQL($sql);

        if (!empty($resultado)) {
            $subasta = $resultado[0];
            $subasta->estado = $estadoSubasta->getEstadoSubasta($subasta->idestado);
            $subasta->objeto = $objetoSubasta->get($subasta->id_objeto);
            $subasta->cantidad_pujas = $pujaModel->contarPorSubasta($subasta->id_subasta);
            return $subasta;
        }

        return null;
    }

    public function create($subasta)
    {
        if (
            empty($subasta->id_objeto) ||
            empty($subasta->fecha_inicio) ||
            empty($subasta->fecha_cierre) ||
            empty($subasta->precio_base) ||
            empty($subasta->incremento_minimo) ||
            empty($subasta->id_vendedor)
        ) {
            throw new Exception("Datos incompletos para crear la subasta");
        }

        $idObjeto = intval($subasta->id_objeto);

        $sqlEstado = "
            SELECT eo.descripcion
            FROM objetos o
            INNER JOIN estado_objeto eo ON eo.idestadoobjeto = o.idestadoobjeto
            WHERE o.id_objeto = $idObjeto
            LIMIT 1
        ";
        $estado = $this->enlace->ExecuteSQL($sqlEstado);

        if ($estado[0]->descripcion !== 'Registrado') {
            throw new Exception("El objeto no está disponible para subasta");
        }

        $sqlInsert = "
            INSERT INTO subastas
            (id_objeto, fecha_inicio, fecha_cierre, precio_base, incremento_minimo, fecha_creacion, idestado)
            SELECT
                $idObjeto,
                '$subasta->fecha_inicio',
                '$subasta->fecha_cierre',
                $subasta->precio_base,
                $subasta->incremento_minimo,
                NOW(),
                es.idestado
            FROM estado_subasta es
            WHERE es.descripcion = 'Previo'
        ";

        $idSubasta = $this->enlace->executeSQL_DML_last($sqlInsert);

        $this->enlace->executeSQL_DML("
            UPDATE objetos
            SET idestadoobjeto = (
                SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'Asignado' LIMIT 1
            )
            WHERE id_objeto = $idObjeto
        ");

        return ["success" => true, "id_subasta" => $idSubasta];
    }

    public function update($subasta)
    {
        $idSubasta = intval($subasta->id_subasta ?? $subasta->id);

        if ($idSubasta <= 0) {
            throw new Exception("ID de subasta inválido");
        }

        $sqlEstado = "
            SELECT es.descripcion
            FROM subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            WHERE s.id_subasta = $idSubasta
            LIMIT 1
        ";

        $estado = $this->enlace->ExecuteSQL($sqlEstado);

        if (empty($estado)) {
            throw new Exception("La subasta no existe");
        }

        if ($estado[0]->descripcion === 'Activa') {
            throw new Exception("No se puede editar una subasta activa");
        }

        $pujaModel = new PujaModel();
        if ($pujaModel->contarPorSubasta($idSubasta) > 0) {
            throw new Exception("No se puede editar una subasta con pujas");
        }

        $this->enlace->executeSQL_DML("
            UPDATE subastas SET
                fecha_inicio = '$subasta->fecha_inicio',
                fecha_cierre = '$subasta->fecha_cierre',
                precio_base = $subasta->precio_base,
                incremento_minimo = $subasta->incremento_minimo
            WHERE id_subasta = $idSubasta
        ");

        return $this->get($idSubasta);
    }

    // ============================================================
    // ✅ MÉTODO PRIVADO: Actualiza subastas vencidas automáticamente
    // ============================================================
    public function actualizarSubastasVencidas()
    {
        // 1. Subastas vencidas CON pujas → "Finalizada" + objeto "Vendido"
        $this->enlace->executeSQL_DML("
            UPDATE subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            SET s.idestado = (
                SELECT idestado FROM estado_subasta WHERE descripcion = 'Finalizada' LIMIT 1
            )
            WHERE es.descripcion = 'Activa'
              AND s.fecha_cierre <= NOW()
              AND (SELECT COUNT(*) FROM pujas p WHERE p.id_subasta = s.id_subasta) > 0
        ");

        $this->enlace->executeSQL_DML("
            UPDATE objetos o
            INNER JOIN subastas s ON s.id_objeto = o.id_objeto
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            SET o.idestadoobjeto = (
                SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'Vendido' LIMIT 1
            )
            WHERE es.descripcion = 'Finalizada'
              AND s.fecha_cierre <= NOW()
              AND o.idestadoobjeto = (
                  SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'En Subasta' LIMIT 1
              )
              AND (SELECT COUNT(*) FROM pujas p WHERE p.id_subasta = s.id_subasta) > 0
        ");

        // 2. Subastas vencidas SIN pujas → "Cancelada" + objeto "Registrado"
        $this->enlace->executeSQL_DML("
            UPDATE subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            SET s.idestado = (
                SELECT idestado FROM estado_subasta WHERE descripcion = 'Cancelada' LIMIT 1
            )
            WHERE es.descripcion = 'Activa'
              AND s.fecha_cierre <= NOW()
              AND (SELECT COUNT(*) FROM pujas p WHERE p.id_subasta = s.id_subasta) = 0
        ");

        $this->enlace->executeSQL_DML("
            UPDATE objetos o
            INNER JOIN subastas s ON s.id_objeto = o.id_objeto
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            SET o.idestadoobjeto = (
                SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'Registrado' LIMIT 1
            )
            WHERE es.descripcion = 'Cancelada'
              AND s.fecha_cierre <= NOW()
              AND o.idestadoobjeto = (
                  SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'En Subasta' LIMIT 1
              )
              AND (SELECT COUNT(*) FROM pujas p WHERE p.id_subasta = s.id_subasta) = 0
        ");
    }

    // ============================================================
    // GET /subastas/activas
    // ============================================================
    public function getActivas()
    {
        // ✅ Actualizar estados antes de consultar
        $this->actualizarSubastasVencidas();

        $objetoModel = new ObjetoModel();
        $pujaModel = new PujaModel();

        $vResultado = $this->enlace->ExecuteSQL("
            SELECT s.* 
            FROM subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            WHERE es.descripcion = 'Activa'
              AND s.fecha_cierre > NOW()
            ORDER BY s.fecha_inicio DESC
        ");

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_subasta = $vResultado[$i]->id_subasta;
                $vResultado[$i]->objeto = $objetoModel->get($vResultado[$i]->id_objeto);
                $vResultado[$i]->cantidad_pujas = $pujaModel->contarPorSubasta($id_subasta);
            }
        }

        return $vResultado;
    }

    // ============================================================
    // GET /subastas/finalizadas
    // ============================================================
    public function getFinalizadas()
    {
        // ✅ Actualizar estados antes de consultar
        $this->actualizarSubastasVencidas();

        $estadoSubasta = new EstadoSubastaModel();
        $objetoModel = new ObjetoModel();
        $pujaModel = new PujaModel();

        $vResultado = $this->enlace->ExecuteSQL("
            SELECT s.* 
            FROM subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            WHERE es.descripcion IN ('Finalizada', 'Cancelada')
            ORDER BY s.fecha_cierre DESC
        ");

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_subasta = $vResultado[$i]->id_subasta;
                $vResultado[$i]->estado = $estadoSubasta->getEstadoSubasta($vResultado[$i]->idestado);
                $vResultado[$i]->objeto = $objetoModel->get($vResultado[$i]->id_objeto);
                $vResultado[$i]->cantidad_pujas = $pujaModel->contarPorSubasta($id_subasta);
            }
        }

        return $vResultado;
    }

    // ============================================================
    // GET /subastas/previas
    // ============================================================
    public function getPrevias()
    {
        $estadoSubasta = new EstadoSubastaModel();
        $objetoModel = new ObjetoModel();
        $pujaModel = new PujaModel();

        $vResultado = $this->enlace->ExecuteSQL("
            SELECT s.* 
            FROM subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            WHERE es.descripcion = 'Previo'
            ORDER BY s.fecha_inicio DESC
        ");

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_subasta = $vResultado[$i]->id_subasta;
                $vResultado[$i]->objeto = $objetoModel->get($vResultado[$i]->id_objeto);
                $vResultado[$i]->cantidad_pujas = $pujaModel->contarPorSubasta($id_subasta);
            }
        }

        return $vResultado;
    }

    public function publicar($idSubasta)
    {
        $idSubasta = intval($idSubasta);

        if ($idSubasta <= 0) {
            throw new Exception("ID de subasta inválido");
        }

        $sql = "
            SELECT s.fecha_inicio, s.id_objeto, es.descripcion
            FROM subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            WHERE s.id_subasta = $idSubasta
            LIMIT 1
        ";

        $res = $this->enlace->ExecuteSQL($sql);

        if (empty($res)) {
            throw new Exception("La subasta no existe");
        }

        $estado      = $res[0]->descripcion;
        $fechaInicio = $res[0]->fecha_inicio;
        $idObjeto    = $res[0]->id_objeto;

        if ($estado !== 'Previo') {
            throw new Exception("Solo se pueden publicar subastas en estado Previo");
        }

        $pujaModel = new PujaModel();
        if ($pujaModel->contarPorSubasta($idSubasta) > 0) {
            throw new Exception("No se puede publicar una subasta con pujas");
        }

        if (empty($fechaInicio)) {
            throw new Exception("La fecha de inicio es obligatoria");
        }

        $this->enlace->executeSQL_DML("
            UPDATE subastas
            SET idestado = (
                SELECT idestado FROM estado_subasta WHERE descripcion = 'Activa' LIMIT 1
            )
            WHERE id_subasta = $idSubasta
        ");

        $this->enlace->executeSQL_DML("
            UPDATE objetos
            SET idestadoobjeto = (
                SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'En Subasta' LIMIT 1
            )
            WHERE id_objeto = $idObjeto
        ");

        return ["success" => true, "message" => "Subasta publicada correctamente"];
    }

    public function cancelar($idSubasta)
    {
        $idSubasta = intval($idSubasta);

        if ($idSubasta <= 0) {
            throw new Exception("ID de subasta inválido");
        }

        $sql = "
            SELECT s.fecha_inicio, s.id_objeto, es.descripcion
            FROM subastas s
            INNER JOIN estado_subasta es ON es.idestado = s.idestado
            WHERE s.id_subasta = $idSubasta
            LIMIT 1
        ";

        $res = $this->enlace->ExecuteSQL($sql);

        if (empty($res)) {
            throw new Exception("La subasta no existe");
        }

        $estado   = $res[0]->descripcion;
        $idObjeto = $res[0]->id_objeto;

        if (!in_array($estado, ['Previo', 'Activa'])) {
            throw new Exception("No se puede cancelar una subasta en estado '$estado'");
        }

        $pujaModel = new PujaModel();
        if ($pujaModel->contarPorSubasta($idSubasta) > 0) {
            throw new Exception("No se puede cancelar una subasta que ya tiene pujas");
        }

        $this->enlace->executeSQL_DML("
            UPDATE subastas
            SET idestado = (
                SELECT idestado FROM estado_subasta WHERE descripcion = 'Cancelada' LIMIT 1
            )
            WHERE id_subasta = $idSubasta
        ");

        $this->enlace->executeSQL_DML("
            UPDATE objetos
            SET idestadoobjeto = (
                SELECT idestadoobjeto FROM estado_objeto WHERE descripcion = 'Registrado' LIMIT 1
            )
            WHERE id_objeto = $idObjeto
        ");

        return ["success" => true, "message" => "Subasta cancelada correctamente"];
    }

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