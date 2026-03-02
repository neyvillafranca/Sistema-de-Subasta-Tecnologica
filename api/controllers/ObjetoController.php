<?php
class Objeto
{
    /**
     * GET /objeto
     * Listado con imagen principal, categorías, condición, estado, dueño
     */
    public function index()
    {
        try {
            $response = new Response();
            $model    = new ObjetoModel();
            $result   = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * GET /objeto/{id}
     * Detalle completo + todas las imágenes + historial de subastas
     */
    public function get($id)
    {
        try {
            $response = new Response();
            $model    = new ObjetoModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

     // 🔹 POST /objeto
    public function create()
    {
        try {
            $request  = new Request();
            $response = new Response();

            // Obtener JSON enviado
            $inputJSON = $request->getJSON();

            $model = new ObjetoModel();

            $result = $model->create($inputJSON);

            $response->toJSON($result);

        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    // 🔹 PUT /objeto
    public function update()
    {
        try {
            $request  = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $model = new ObjetoModel();

            $result = $model->update($inputJSON);

            $response->toJSON($result);

        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * DELETE /objeto/{id}
     * Eliminación lógica
     */
    public function delete($id)
    {
        try {
            $response = new Response();
            $model    = new ObjetoModel();

            $result = $model->delete($id);

            $response->toJSON($result);

        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }

    /**
     * PATCH /objeto/estado/{id}
     * Activar / Desactivar
     */
    public function estado($id)
    {
        try {
            $request  = new Request();
            $response = new Response();
            $model    = new ObjetoModel();

            $data = $request->getJSON();

            $nuevoEstado = $data->idestadoobjeto ?? 1;

            $result = $model->changeEstado($id, $nuevoEstado);

            $response->toJSON($result);

        } catch (Exception $e) {
            $response->toJSON(null);
            handleException($e);
        }
    }
    //POST Crear
    // public function create()
    // {
    //     try {
    //         $request = new Request();
    //         $response = new Response();
    //         //Obtener json enviado
    //         $inputJSON = $request->getJSON();
    //         //Instancia del modelo
    //         $objeto = new ObjetoModel();
    //         //Acción del modelo a ejecutar
    //         $result = $objeto->create($inputJSON);
    //         //Dar respuesta
    //         $response->toJSON($result);
    //     } catch (Exception $e) {
    //         $response->toJSON($result);
    //         handleException($e);
            
    //     }
    // }
    // //PUT actualizar
    // public function update()
    // {
    //     try {
    //         $request = new Request();
    //         $response = new Response();
    //         //Obtener json enviado
    //         $inputJSON = $request->getJSON();
    //         //Instancia del modelo
    //         $objeto = new ObjetoModel();
    //         //Acción del modelo a ejecutar
    //         $result = $objeto->update($inputJSON);
    //         //Dar respuesta
    //         $response->toJSON($result);
    //     } catch (Exception $e) {
    //         $response->toJSON($result);
    //         handleException($e);
            
    //     }
    // }
    //  /**
    //  * DELETE /objeto/{id}
    //  * Eliminación lógica
    //  */
    // public function delete($id)
    // {
    //     try {
    //         $response = new Response();
    //         $model = new ObjetoModel();

    //         $result = $model->delete($id);
    //         $response->toJSON(['success' => true, 'message' => 'Objeto eliminado']);
    //     } catch (Exception $e) {
    //         $response->toJSON(null);
    //         handleException($e);
    //     }
    // }

    // /**
    //  * PATCH /objeto/estado/{id}
    //  * Cambiar estado (activar/desactivar)
    //  */
    // public function estado($id)
    // {
    //     try {
    //         $response = new Response();
    //         $request = new Request();
    //         $model = new ObjetoModel();

    //         $data = $request->getBody();
    //         $nuevoEstado = $data['idestadoobjeto'] ?? 1;

    //         $result = $model->cambiarEstado($id, $nuevoEstado);
    //         $response->toJSON(['success' => true, 'message' => 'Estado actualizado']);
    //     } catch (Exception $e) {
    //         $response->toJSON(null);
    //         handleException($e);
    //     }
    // }
}