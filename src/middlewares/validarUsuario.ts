
import { check, validationResult } from "express-validator";

// Validaciones
export const validarUsuario = [
    check("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    check("usuario").notEmpty().withMessage("El usuario es obligatorio"),
    check("clave")
      .isLength({ min: 6 })
      .withMessage("La clave debe tener al menos 6 caracteres"),
    check("telefono").notEmpty().withMessage("El teléfono es obligatorio"),
    check("documento").notEmpty().withMessage("El documento es obligatorio"),
  ];