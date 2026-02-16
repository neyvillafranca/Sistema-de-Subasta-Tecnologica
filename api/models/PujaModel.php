<?php
class PujaModel
{
    /**
     * GET /subastas/{id}/pujas
     * Historial de pujas de una subasta específica
     * Orden: descendente por fecha (la más reciente primero)
     * Campos: usuario, monto, fecha y hora
     * Validación: solo pujas asociadas al id_subasta solicitado
     */
    public function getBySubasta($id_subasta)
    {
        $db          = new MySqlConnect();
        $id_subasta  = intval($id_subasta);

        $sql = "SELECT 
                    p.id_puja,
                    u.nombre_completo   AS usuario,
                    p.monto,
                    p.fecha_puja
                FROM pujas p
                INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
                WHERE p.id_subasta = $id_subasta
                ORDER BY p.fecha_puja DESC";

        return $db->executeSQL($sql, "asoc");
    }
}