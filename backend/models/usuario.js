
import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  Nombre_U: { type: String, required: true, unique: true, maxlength: 50 },
  Contraseña: { type: String, required: true, minlength: 6,     
    match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.#])[A-Za-z\d@$!%*?&.#]{8,20}$/ ] },
  Tipo_empresa: { type: Boolean, default: false }
});

export default mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);
