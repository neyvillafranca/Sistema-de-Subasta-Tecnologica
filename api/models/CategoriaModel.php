<?php
class CategoriaModel
{
    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM categorias;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM categorias where id_categoria=$id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }
    public function getCategoriaObjeto($idObjeto)
    {
       
        //Consulta sql
        $vSql = "SELECT c.id_categoria, c.nombre
            FROM  categorias c, categoria_objeto co
            where co.idcategoria=c.id_categoria and co.idobjeto=$idObjeto";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }
    public function getObjetosbyCategoria($param)
    {
              
        $vResultado = null;
        if (!empty($param)) {
            $vSql = "SELECT o.id_objeto, o.nombre, o.id_vendedor, o.descripcion, o.condicion, 
                o.idestadoobjeto, o.fecha_registro
				FROM categoria_objeto co, objeto o
				where co.idobjeto=o.id_objeto and co.idcategoria=$param";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
        }
        // Retornar el objeto
        return $vResultado;
    }
}
