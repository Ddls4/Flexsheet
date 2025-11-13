export function registrarPagosSockets(socket, mercadopago) {
  socket.on("crear_pago", async (data) => {
    try {
      const { titulo, precio, usuarioId } = data;

      const preference = {
        items: [
          { title: titulo, unit_price: Number(precio), quantity: 1, currency_id: "UYU" },
        ],
        back_urls: {
          success: "http://192.168.1.7:5173/pago-exitoso",
          failure: "http://192.168.1.7:5173/pago-fallido",
          pending: "http://192.168.1.7:5173/pago-pendiente",
        },
        auto_return: "approved",
        notification_url: "https://uncircular-conoidally-josefine.ngrok-free.dev/webhook-mercadopago",
        metadata: { usuarioId },
      };

      const respuesta = await mercadopago.preferences.create(preference);
      console.log("🧾 Preferencia creada:", respuesta.body.id);

      socket.emit("link_pago", { url: respuesta.body.init_point });
    } catch (error) {
      console.error("❌ Error al crear pago:", error);
      socket.emit("error_pago", { mensaje: "Error al crear pago" });
    }
  });
}
