import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import Usuario from "../models/Usuario.js";

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
