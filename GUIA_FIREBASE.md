# Guía: crear tu propio Firebase para Oréalis

Firebase es gratis para un proyecto de este tamaño (plan "Spark"). Esto
toma unos 10-15 minutos.

## 1. Crear el proyecto

1. Ve a https://console.firebase.google.com/ e inicia sesión con tu
   cuenta de Google.
2. Clic en **"Agregar proyecto"**.
3. Ponle un nombre, por ejemplo `orealis-tienda`.
4. Puedes desactivar Google Analytics si no lo necesitas (no es
   obligatorio para este sitio).
5. Espera a que se cree y entra al proyecto.

## 2. Registrar la app web

1. En la pantalla principal del proyecto, clic en el ícono **`</>`**
   (Web) para agregar una app.
2. Ponle un apodo, por ejemplo `orealis-web`. No necesitas marcar
   "Firebase Hosting" a menos que quieras publicar el sitio ahí.
3. Firebase te mostrará un bloque de código con un objeto
   `firebaseConfig = { apiKey: ..., authDomain: ..., ... }`.
4. Copia esos valores y pégalos en `firebase/config.js`, reemplazando
   los placeholders `TU_API_KEY`, `TU_PROYECTO`, etc.

## 3. Activar Firestore (la base de datos)

1. En el menú izquierdo: **Compilación > Firestore Database**.
2. Clic en **"Crear base de datos"**.
3. Elige la ubicación más cercana (por ejemplo `us-central` o
   `southamerica-east1`).
4. Empieza en **modo de prueba** (esto crea reglas abiertas temporales).
5. Ve a la pestaña **"Reglas"** y pega esto (idéntico a lo que trae el
   modo de prueba, solo para que quede explícito):

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

   ⚠️ Estas reglas permiten que cualquiera lea y escriba todo. Sirven
   para probar el sitio, pero **no son seguras para producción**. Antes
   de lanzarlo con clientes reales, hay que restringirlas.

## 4. Activar Authentication (login de clientes y del admin)

1. Menú izquierdo: **Compilación > Authentication**.
2. Clic en **"Comenzar"**.
3. En la pestaña **"Sign-in method"**, activa:
   - **Google** (para que los clientes inicien sesión al agregar al
     carrito). Te pedirá un correo de soporte: pon el tuyo.
   - **Correo electrónico/contraseña** (para el login del panel admin).
4. Ve a la pestaña **"Users"** y clic en **"Agregar usuario"**: crea
   tu propio usuario y contraseña de administrador (con ese entrarás
   a `admin/login.html`).

## 5. Crear las colecciones que usa el sitio

No es necesario crearlas a mano: se crean solas la primera vez que
agregas un producto desde `admin/productos.html`, o cuando alguien hace
login (colección `clientes`) o una compra (colección `ventas`).

Las colecciones que usa el sitio son:
- `productos` — cada producto del catálogo.
- `clientes` — cada cliente que inició sesión con Google.
- `ventas` — cada pedido realizado desde el checkout.

## 6. Probar

1. Abre `index.html` en tu navegador (o súbelo a un hosting).
2. Entra a `admin/login.html`, inicia sesión con el usuario que creaste
   en el paso 4, y agrega un producto de prueba.
3. Regresa a `index.html`: el producto debería aparecer en la sección
   "Catálogo".
4. Agrégalo al carrito (te pedirá login con Google), finaliza la
   compra, y revisa que:
   - Se creó el pedido en Firestore (`ventas`).
   - El stock del producto bajó.
   - Te llegó el aviso de WhatsApp (si ya configuraste
     `notificar_whatsapp.js`, ver README.md).

## 7. (Opcional) Publicar el sitio gratis

Puedes subir estos archivos tal cual a **Firebase Hosting**, **Netlify**
o **GitHub Pages** — es HTML/CSS/JS puro, no necesita servidor. Si
quieres, dime cuál prefieres y te doy los pasos exactos.
