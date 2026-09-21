/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 DASHBOARD JS - DATOS REALES (FIRESTORE)
=========================================
*/

import { auth, db } from "../../firebase/config.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/*
=========================================
 UTILIDADES
=========================================
*/

// Devuelve la fecha de hoy en formato "YYYY-MM-DD"
// Ajusta esto si en tus documentos guardas la fecha como Timestamp de Firestore.
function fechaHoy() {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, "0");
  const d = String(hoy.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function esperarSesion() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => resolve(user));
  });
}

/*
=========================================
 CONSULTAS A FIRESTORE
=========================================
*/

async function obtenerPedidosPendientes() {
  try {
    const q = query(collection(db, "ventas"), where("estado", "==", "Pendiente"));
    const snap = await getDocs(q);
    return snap.size;
  } catch (error) {
    console.error("Error al obtener pedidos pendientes:", error);
    return 0;
  }
}

async function obtenerVentasHoy() {
  try {
    const hoy = fechaHoy();
    const q = query(collection(db, "ventas"), where("fecha", "==", hoy));
    const snap = await getDocs(q);

    let total = 0;
    snap.forEach((doc) => {
      const data = doc.data();
      total += Number(data.total) || 0;
    });

    return total;
  } catch (error) {
    console.error("Error al obtener ventas de hoy:", error);
    return 0;
  }
}

async function obtenerTotalProductos() {
  try {
    const snap = await getDocs(collection(db, "productos"));
    return snap.size;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return 0;
  }
}

async function obtenerTotalClientes() {
  try {
    const snap = await getDocs(collection(db, "clientes"));
    return snap.size;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    return 0;
  }
}

// Trae los productos con poco inventario (stock <= 5), ordenados de menor a mayor.
async function obtenerProductosBajoInventario() {
  try {
    const q = query(
      collection(db, "productos"),
      where("stock", "<=", 5),
      orderBy("stock", "asc"),
      limit(10)
    );
    const snap = await getDocs(q);

    const productos = [];
    snap.forEach((doc) => {
      const data = doc.data();
      productos.push({
        nombre: data.nombre || "Sin nombre",
        cantidad: Number(data.stock) || 0
      });
    });

    return productos;
  } catch (error) {
    console.error("Error al obtener inventario bajo:", error);
    return [];
  }
}

/*
=========================================
 RENDER: TARJETAS
=========================================
*/

function animarNumero(elemento, valor, prefijo = "") {
  let inicio = 0;
  const paso = Math.max(1, Math.ceil(valor / 50));

  const tiempo = setInterval(() => {
    inicio += paso;

    if (inicio >= valor) {
      inicio = valor;
      clearInterval(tiempo);
    }

    elemento.textContent = prefijo + inicio;
  }, 30);
}

function actualizarTarjetas(datos) {
  const tarjetas = document.querySelectorAll(".dashboard-card h2");

  if (tarjetas.length >= 4) {
    animarNumero(tarjetas[0], datos.pedidosPendientes);
    animarNumero(tarjetas[1], datos.ventas, "Q");
    animarNumero(tarjetas[2], datos.productos);
    animarNumero(tarjetas[3], datos.clientes);
  }
}

/*
=========================================
 RENDER: TABLA DE INVENTARIO BAJO
=========================================
*/

function actualizarTablaInventario(productos) {
  const tbody = document.querySelector(".table tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (productos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-muted">
          No hay productos con poco inventario
        </td>
      </tr>
    `;
    return;
  }

  productos.forEach((producto) => {
    const estado = producto.cantidad === 0 ? "Agotado" : "Bajo";
    const claseBadge = producto.cantidad === 0 ? "bg-danger" : "bg-warning";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${producto.nombre}</td>
      <td>${producto.cantidad}</td>
      <td><span class="badge ${claseBadge}">${estado}</span></td>
    `;

    tbody.appendChild(fila);
  });
}

/*
=========================================
 INICIO
=========================================
*/

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Dashboard administrador cargado");

  /*
  =========================================
   VERIFICAR SESIÓN ADMIN (Firebase Auth)
  =========================================
  */

  const usuario = await esperarSesion();

  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  /*
  =========================================
   CARGAR DATOS REALES DESDE FIRESTORE
  =========================================
  */

  const [pedidosPendientes, ventas, productos, clientes, bajoInventario] =
    await Promise.all([
      obtenerPedidosPendientes(),
      obtenerVentasHoy(),
      obtenerTotalProductos(),
      obtenerTotalClientes(),
      obtenerProductosBajoInventario()
    ]);

  const datos = { pedidosPendientes, ventas, productos, clientes };

  actualizarTarjetas(datos);
  actualizarTablaInventario(bajoInventario);

  /*
  =========================================
   BOTONES DE ACCIÓN
  =========================================
  */

  const botones = document.querySelectorAll(".btn");
  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      console.log("Acción:", boton.textContent.trim());
    });
  });

  /*
  =========================================
   CERRAR SESIÓN
  =========================================
  */

  const salir = document.querySelector('a[href="../index.html"]');

  if (salir) {
    salir.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      window.location.href = "../index.html";
    });
  }
});