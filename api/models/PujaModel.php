<?php
class PujaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /**
     * GET /subastas/{id}/pujas
     * Historial de pujas de una subasta específica
     * Orden: descendente por fecha (la más reciente primero)
     * Campos: usuario, monto, fecha y hora
     * Validación: solo pujas asociadas al id_subasta solicitado
     */
    public function contarPorSubasta($id_subasta)
    {
        $db = new MySqlConnect();

        $sql = "SELECT COUNT(*) AS total
            FROM pujas
            WHERE id_subasta = $id_subasta";

        $resultado = $db->executeSQL($sql, "asoc");

        return (int) $resultado[0]['total'];
    }

    // public function getBySubasta($id_subasta)
    // {
    //     $db          = new MySqlConnect();

    //     $sql = "SELECT 
    //                 p.id_puja,
    //                 u.nombre_completo  AS usuario,
    //                 p.monto,
    //                 p.fecha_puja
    //             FROM pujas p
    //             INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    //             WHERE p.id_subasta = $id_subasta
    //             ORDER BY p.fecha_puja DESC";

    //     return $db->executeSQL($sql, "asoc");
    // }
    public function getBySubasta($id_subasta)
    {
        $usuarioModel = new UsuarioModel();
        $subastaModel = new SubastaModel();

        // Validar que la subasta existe
        $subasta = $subastaModel->get($id_subasta);
        if (empty($subasta)) {
            return null; // o array vacío []
        }

        $vSQL = "SELECT * 
             FROM pujas 
             WHERE id_subasta = $id_subasta
             ORDER BY fecha_puja DESC";

        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $id_usuario = $vResultado[$i]->id_usuario;

                // Usuario que realizó la puja
                $vResultado[$i]->usuario = $usuarioModel->get($id_usuario);

                // Validación: confirmar que la puja pertenece a esta subasta
                $vResultado[$i]->subasta_id = $id_subasta;
            }
        }

        return $vResultado;
    }
}
