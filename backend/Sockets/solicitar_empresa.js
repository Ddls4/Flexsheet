socket.on("solicitar_empresa", async ({ idUsuario }, callback) => {
  try {
    const empresas = await negocio.find({ ID_U: idUsuario });
    callback({ success: true, empresas });
  } catch (error) {
    console.error("Error en solicitar_empresa:", error);
    callback({ success: false, message: "Error al obtener empresas del usuario" });
  }
});
