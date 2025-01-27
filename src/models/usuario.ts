import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
  documento: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
    default: 'Activo'
  }
});

export default mongoose.model("usuario", UsuarioSchema);
