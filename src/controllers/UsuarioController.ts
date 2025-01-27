import { Request, Response } from "express";
import passwordFunctions from "../helpers/encrypt-password";
import { createToken } from "../helpers/jwt";
import { pool } from "../db";
import { validationResult } from "express-validator";

const listar_usuarios = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo usuarios", error });
  }
};


const crear_usuario = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, usuario, clave, telefono, documento } = req.body;

  try {
    // Verificar si el nombre de usuario ya existe
    const [usuarioExistente]: any = await pool
      .promise()
      .query("SELECT id FROM usuarios WHERE usuario = ?", [usuario]);
    if (usuarioExistente.length > 0) {
      return res
        .status(400)
        .json({ message: "El nombre de usuario ya está en uso" });
    }

    // Verificar si el documento ya existe
    const [documentoExistente]: any = await pool
      .promise()
      .query("SELECT id FROM usuarios WHERE documento = ?", [documento]);
    if (documentoExistente.length > 0) {
      return res.status(400).json({ message: "El documento ya está en uso" });
    }

    // Encriptar la contraseña
    const hashedPassword = await passwordFunctions.encryptPassword(clave);

    // Insertar usuario en la base de datos
    const [result]: any = await pool
      .promise()
      .query(
        "INSERT INTO usuarios (nombre, usuario, clave, telefono, documento, estado) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, usuario, hashedPassword, telefono, documento, "Activo"]
      );

    res.json({ message: "Usuario creado", id: result.insertId });

  } catch (error) {
    res.status(500).json({ message: "Error creando usuario", error });
  }
};

const login_usuario = async ( req: Request, resp: Response ) => {

  const data = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const [usuarios]: any = await pool.promise().query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [data.usuario]
    );

    if (usuarios.length === 0) {
      return resp.status(200).send({
        ok: false,
        message: 'No se encontró el usuario',
        data: undefined,
      });
    }

    const user = usuarios[0];

    if (user.estado !== 'Activo') {
      return resp.status(200).send({
        ok: false,
        message: 'Usuario no activo',
        data: undefined,
      });
    }

    // Verificar la contraseña
    const isValidPassword = await passwordFunctions.comparePassword(
      data.clave,
      user.clave
    );

    if (!isValidPassword) {
      return resp.status(200).send({
        ok: false,
        message: 'La contraseña no coincide',
        data: undefined,
      });
    }

    // Crear el token
    const token = createToken(user);

    return resp.status(200).send({
      ok: true,
      data: user,
      token,
    });
  } catch (error) {
    return resp.status(500).send({
      ok: false,
      message: 'Error al iniciar sesión',
      error,
    });
  }

}

// Obtener un usuario por ID
const listar_usuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [rows]: any = await pool.promise().query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo usuario', error });
  }
};

// Actualizar un usuario
export const editar_usuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, documento, telefono } = req.body;

  try {
    const [result]: any = await pool.promise().query('UPDATE usuarios SET nombre = ?, documento = ?, telefono = ? WHERE id = ?', [nombre, documento, telefono, id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario actualizado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando usuario', error });
  }
};

// Eliminar un usuario
export const eliminar_usuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [result]: any = await pool.promise().query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Usuario eliminado' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando usuario', error });
  }
};



export default {
  login_usuario,
  crear_usuario,
  listar_usuarios,
  listar_usuario,
  editar_usuario,
  eliminar_usuario
};
