/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 AVISO WHATSAPP AL ADMIN (SIN BACKEND)
 Se llama desde el navegador del cliente
 justo después de guardar la reserva o
 el pedido en Firestore.
=========================================
*/

const CALLMEBOT_PHONE = "50248975506";  // tu número de WhatsApp (admin)
const CALLMEBOT_APIKEY = "9341829";     // el que te dio CallMeBot

export async function avisarAdmin(mensaje) {

  const url =
    "https://api.callmebot.com/whatsapp.php" +
    `?phone=${CALLMEBOT_PHONE}` +
    `&text=${encodeURIComponent(mensaje)}` +
    `&apikey=${CALLMEBOT_APIKEY}`;

  try {

    // "no-cors" porque CallMeBot no siempre responde con
    // encabezados CORS; con esto el mensaje se envía igual,
    // solo no podemos leer la respuesta desde el navegador.
    await fetch(url, { mode: "no-cors" });

  } catch (error) {

    // Si falla el aviso, no debe romper la reserva/compra del cliente
    console.error("No se pudo avisar por WhatsApp:", error);

  }

}


/*
=========================================
 UBICACIÓN
=========================================

Este archivo va en la carpeta /js/ (raíz del sitio), justo al
lado de checkout.js. Ya está integrado ahí:
checkout.js llama a avisarAdmin() después de guardar la venta.

IMPORTANTE: CALLMEBOT_PHONE y CALLMEBOT_APIKEY están ligados al
número de WhatsApp del administrador. Si cambias el número del
negocio, debes generar un nuevo apikey escribiéndole al bot de
CallMeBot desde ese nuevo número (instrucciones en callmebot.com).
*/