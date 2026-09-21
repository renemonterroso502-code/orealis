// Cada destinatario tiene su propio teléfono y apikey de CallMeBot
const DESTINATARIOS = [
  { phone: "50230138000", apikey: "2083166" },
  { phone: "502XXXXXXXX2", apikey: "APIKEY_2" },
  { phone: "502XXXXXXXX3", apikey: "APIKEY_3" },
  { phone: "502XXXXXXXX4", apikey: "APIKEY_4" },
];

async function enviarWhatsApp({ phone, apikey }, mensaje) {

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${phone}` +
    `&text=${encodeURIComponent(mensaje)}` +
    `&apikey=${apikey}`;

  // "no-cors" porque CallMeBot no siempre responde con
  // encabezados CORS; el mensaje se envía igual, solo no
  // podemos leer la respuesta desde el navegador.
  await fetch(url, { mode: "no-cors" });

}

export async function avisarAdmin(mensaje) {

  // Se envían los 4 al mismo tiempo. allSettled evita que
  // si uno falla, los demás se cancelen.
  const resultados = await Promise.allSettled(
    DESTINATARIOS.map((d) => enviarWhatsApp(d, mensaje))
  );

  // Si falla algún aviso, no debe romper la reserva/compra del cliente
  resultados.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(
        `No se pudo avisar a ${DESTINATARIOS[i].phone}:`,
        r.reason
      );
    }
  });

}
