<?php
class EstadoSubastaModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM estado_subasta;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }

    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM estado_subasta where idestado=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    /*public function getEstadoSubasta($idObj)
    {
        //Consulta sql

        $vSql = "SELECT es.idestado, es.descripcion
            FROM estado_subasta es, subastas s
            where es.idestado = s.idestado and  s.id_objeto=$idObj";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }*/
    /*public function getEstadoSubasta($idestado)
    {
        $idestado = intval($idestado);

        $sql = "SELECT *
                FROM estado_subasta
                WHERE idestado = $idestado
                LIMIT 1";

        $resultado = $this->enlace->ExecuteSQL($sql);

        // ✅ VALIDACIÓN DEFENSIVA (CLAVE)
        if (empty($resultado)) {
            return null;
        }

        return $resultado[0];
    }*/
    public function getEstadoSubasta($idEstado)
    {
        $db = new MySqlConnect();
        $idEstado = intval($idEstado);

        $sql = "SELECT * FROM estado_subasta WHERE idestado = $idEstado LIMIT 1";
        $res = $db->ExecuteSQL($sql);

        return $res[0] ?? null;
    }
}
