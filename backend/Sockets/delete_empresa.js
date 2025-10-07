socket.on("delete_empresa", async ({ idEmpresa }, callback) => {
  try {
    const eliminado = await negocio.findByIdAndDelete(idEmpresa);
    if (!eliminado) return callback({ success: false, message: "Empresa no encontrada" });

    callback({ success: true, message: "Empresa eliminada correctamente" });
  } catch (error) {
    console.error("Error en delete_empresa:", error);
    callback({ success: false, message: "Error al eliminar empresa" });
  }
});
