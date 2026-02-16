<?php
class UsuarioModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Retornar el objeto

    public function all()
    {
        $vSql = "SELECT * 
                FROM usuarios 
                ORDER BY nombre_completo ASC";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    /**
     * GET /usuarios/{id}
     * Detalle de un usuario + campos calculados (sin almacenar en BD)
     */
    public function get($id)
    {
        $id = intval($id);
        $rolU = new RolModel();

        $vSql = "SELECT * 
        FROM usuarios 
        WHERE id_usuario = $id
        ORDER BY nombre_completo ASC";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if ($vResultado) {
            $vResultado = $vResultado[0];
            $rol = $rolU->getRolUser($id);
            $vResultado->rol = $rol;
            //   return $vResultado;
        } else {
            // return null;
        }
        $usuario = $vResultado;

        $usuario->rol = $rolU->getRolUser($id);
        // Campo calculado: subastas creadas
        $sqlSubastas = "SELECT COUNT(*) AS cantidad_subastas_creadas
                    FROM subastas s
                    INNER JOIN objetos o ON s.id_objeto = o.id_objeto
                    WHERE o.id_vendedor = $id";

        $resSubastas = $this->enlace->ExecuteSQL($sqlSubastas);
        $usuario->cantidad_subastas_creadas =
            $resSubastas ? (int)$resSubastas[0]->cantidad_subastas_creadas : 0;

        // Campo calculado: pujas realizadas
        $sqlPujas = "SELECT COUNT(*) AS cantidad_pujas_realizadas
        FROM pujas  
        WHERE id_usuario = $id";

        $resPujas = $this->enlace->ExecuteSQL($sqlPujas);
        $usuario->cantidad_pujas_realizadas =
            $resPujas ? (int)$resPujas[0]->cantidad_pujas_realizadas : 0;

        return $usuario;
    }
}
