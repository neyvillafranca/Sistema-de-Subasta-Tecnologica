<?php
class EstadoObjetoModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM estado_objeto;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }

    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM estado_objeto where idestadoobjeto=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getEstadoObjeto($idObj)
    {
        //Consulta sql

        $vSql = "SELECT eo.idestadoobjeto,eo.descripcion
            FROM estado_objeto eo, objetos o
            where eo.idestadoobjeto = o.idestadoobjeto and  o.id_objeto=$idObj";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
}
