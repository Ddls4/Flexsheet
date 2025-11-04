
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  Nombre_U: { type: String, required: true, unique: true, maxlength: 50 },
  Contraseña: { type: String, required: true, minlength: 6},
  Tipo_empresa: { type: Boolean, default: false }
});

export default mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);
