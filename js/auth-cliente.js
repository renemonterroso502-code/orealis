/*
=========================================
 AUTENTICACIÓN CON GOOGLE + REGISTRO DE CLIENTE
=========================================
Este módulo:
1. Abre el popup de login con Google.
2. Si es la primera vez del usuario, crea su documento en /clientes.
3. Si ya existe, actualiza su "ultimaVisita" sin tocar el resto de sus datos.
4. Devuelve el usuario autenticado para que puedas continuar con
   la acción original (ej. agregar el producto al carrito).
*/

import { auth, db } from "../firebase/config.js";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/**
 * Inicia sesión con Google y asegura que el cliente esté registrado
 * en la colección "clientes". Si ya hay sesión activa, no vuelve a
 * pedir login: reutiliza auth.currentUser.
 *
 * @returns {Promise<import("firebase/auth").User>} el usuario autenticado
 */
export async function iniciarSesionYRegistrarCliente() {
  // Si ya hay sesión, no abrimos el popup de nuevo
  let usuario = auth.currentUser;

  if (!usuario) {
    const provider = new GoogleAuthProvider();
    const resultado = await signInWithPopup(auth, provider);
    usuario = resultado.user;
  }

  const clienteRef = doc(db, "clientes", usuario.uid);
  const clienteSnap = await getDoc(clienteRef);

  if (!clienteSnap.exists()) {
    // Primera vez: se crea el registro completo del cliente
    await setDoc(clienteRef, {
      nombre: usuario.displayName || "",
      correo: usuario.email || "",
      foto: usuario.photoURL || "",
      fechaRegistro: serverTimestamp(),
      ultimaVisita: serverTimestamp()
    });
  } else {
    // Ya existía: solo actualizamos la última visita, sin pisar sus datos
    await setDoc(
      clienteRef,
      { ultimaVisita: serverTimestamp() },
      { merge: true }
    );
  }

  return usuario;
}

/*
=========================================
 EJEMPLO DE USO EN EL BOTÓN "AGREGAR AL CARRITO"
=========================================

botonAgregarCarrito.addEventListener("click", async () => {
  try {
    const usuario = await iniciarSesionYRegistrarCliente();

    // Aquí ya tienes al usuario autenticado y registrado como cliente.
    // Continúa con tu lógica normal de carrito:
    agregarProductoAlCarrito(producto, usuario.uid);

  } catch (error) {
    if (error.code === "auth/popup-closed-by-user") {
      console.log("El usuario cerró el popup de Google sin iniciar sesión");
    } else {
      console.error("Error al iniciar sesión / registrar cliente:", error);
    }
  }
});

*/
