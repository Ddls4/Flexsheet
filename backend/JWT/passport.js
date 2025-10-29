// Ese fragmento es la configuración de Passport.js para manejar el 
// inicio de sesión local (usuario + contraseña)
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import Usuario from "../Sockets/Usuario_S.js";

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await Usuario.findOne({ Nombre_U: username });
        if (!user) return done(null, false, { message: "Usuario no encontrado" });

        const isMatch = await bcrypt.compare(password, user.Contraseña);
        if (!isMatch) return done(null, false, { message: "Contraseña incorrecta" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;

// En resumen
// Define cómo se valida un usuario con usuario/contraseña.
// Usa bcrypt para comparar contraseñas seguras.
// Integra la estrategia en Passport.