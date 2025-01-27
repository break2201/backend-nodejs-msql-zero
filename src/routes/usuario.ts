

import { Router } from "express";
import usuarioController from "../controllers/UsuarioController"
import { auth } from "../middlewares/authenticate";

const api = Router()

api.post('/login_usuario', usuarioController.login_usuario);

api.post('/crear_usuario', usuarioController.crear_usuario );

api.put('/editar_usuario/:id', auth, usuarioController.editar_usuario);

api.delete('/eliminar_usuario/:id', auth, usuarioController.eliminar_usuario);

api.get('/listar_usuarios', auth, usuarioController.listar_usuarios);

api.get('/listar_usuario', auth, usuarioController.listar_usuario);

export default api