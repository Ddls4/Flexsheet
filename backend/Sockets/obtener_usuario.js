socket.on("obtener_usuario", async ({ idUsuario }, callback) => {
  try {
    const user = await usuario.findById(idUsuario);
    if (!user) return callback({ success: false, message: "Usuario no encontrado" });

    callback({
      success: true,
      user: {
        _id: user._id,
        Nombre_U: user.Nombre_U,
        Correo_electronico: user.Correo_electronico
      }
    });
  } catch (error) {
    console.error("Error en obtener_usuario:", error);
    callback({ success: false, message: "Error al obtener usuario" });
  }
});

