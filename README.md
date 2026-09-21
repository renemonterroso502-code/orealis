# Oréalis — Tienda online

Sitio web para una tienda de decoraciones y accesorios personalizados:
**MDF y acrílico de corte láser, impresión 3D y sublimado.**

Construido con HTML + CSS + JavaScript (sin frameworks) y **Firebase**
(Firestore para la base de datos, Auth para login de clientes con Google).

## Antes de usarlo

1. Sigue **GUIA_FIREBASE.md** para crear tu propio proyecto de Firebase
   (gratis) y conectar este sitio a él. **El sitio no funcionará hasta
   que hagas esto**, porque `firebase/config.js` trae valores de ejemplo.
2. Cambia el número de WhatsApp en:
   - `js/notificar_whatsapp.js` (avisos automáticos de pedidos)
   - `index.html` (botón flotante de WhatsApp y sección de contacto)
3. Sube tus productos desde el panel de administración (`admin/login.html`).

## Estructura del proyecto

```
index.html              → Página principal (catálogo, servicios, contacto)
css/style.css           → Estilos del sitio público (tema morado/blanco)

firebase/config.js      → Configuración de conexión a Firebase (¡edítalo!)

js/
  productos.js          → Carga los productos desde Firestore a la página principal
  carrito.js             → Lógica del carrito (localStorage) + login con Google
  auth-cliente.js        → Login con Google y registro del cliente en Firestore
  ver_carrito.js          → Lógica de la página "Mi carrito"
  checkout.js            → Guarda el pedido, descuenta stock y avisa por WhatsApp
  notificar_whatsapp.js  → Envío del aviso de WhatsApp (vía CallMeBot, sin backend)
  main.js                → Detalles visuales (scroll, animaciones, año del footer)

tienda/
  carrito.html           → Página "Mi carrito"
  checkout.html          → Página de finalizar compra

admin/
  login.html              → Login del panel administrativo
  dashboard.html + js/    → Resumen general (pedidos pendientes, ventas, stock bajo)
  productos.html + js/    → Alta, edición y baja de productos
  inventario.html + js/   → Control de inventario
  ventas.html + js/       → Historial de pedidos/ventas (incluye notas de personalización)
  clientes.html + js/     → Clientes registrados (vía login con Google)
```

## Flujo de compra para el cliente

1. Ve el catálogo en la página principal (`#tienda`) o entra directo con el
   menú.
2. Agrega productos al carrito (le pide iniciar sesión con Google la
   primera vez).
3. Revisa/edita cantidades en "Mi carrito".
4. En "Finalizar compra" llena sus datos y, si el producto lo necesita,
   un campo de **notas de personalización** (texto a grabar, color,
   tamaño, referencia de diseño, etc.).
5. Al confirmar: se guarda el pedido en Firestore, se descuenta el stock,
   y te llega un WhatsApp automático con el resumen.

## Panel de administración

Entra por `admin/login.html` con un usuario que hayas creado en
**Firebase Authentication > Email/Password** (ver GUIA_FIREBASE.md).
Desde ahí puedes:

- Dar de alta productos con foto, categoría, precio, stock y descripción.
- Ver el inventario y detectar stock bajo.
- Ver y actualizar el estado de cada pedido/venta (incluyendo las notas
  de personalización que dejó el cliente).
- Ver los clientes registrados.

## Seguridad (importante)

Las reglas de Firestore que trae la guía (`GUIA_FIREBASE.md`) son
**abiertas** (cualquiera puede leer/escribir) para que puedas probar el
sitio rápido. Antes de usarlo con clientes reales, hay que restringirlas
(por ejemplo: solo el admin puede escribir productos, solo cada cliente
puede leer sus propios pedidos). Si quieres, puedo ayudarte a escribir
esas reglas más adelante.
