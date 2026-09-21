/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 SISTEMA CARRITO CLIENTE
=========================================
*/

import { iniciarSesionYRegistrarCliente } from "./auth-cliente.js";

let carrito = 
JSON.parse(
localStorage.getItem("carrito")
) || [];




// =================================
// AGREGAR PRODUCTO AL CARRITO
// =================================

export async function agregarCarrito(id){


// Primero exigimos login con Google (y registramos/actualizamos
// al cliente en Firestore). Si el usuario ya tenía sesión iniciada,
// esto no vuelve a abrir el popup.
try{

await iniciarSesionYRegistrarCliente();

}catch(error){

if(error.code === "auth/popup-closed-by-user"){

// El usuario cerró el popup sin iniciar sesión:
// no agregamos el producto y salimos.
return;

}

console.error(
"Error al iniciar sesión / registrar cliente:",
error
);

alert(
"No se pudo iniciar sesión. Intenta de nuevo."
);

return;

}



let existe =
carrito.find(
(p)=>p.id === id
);



if(existe){


existe.cantidad++;


}else{


carrito.push({

id:id,

cantidad:1

});


}



guardarCarrito();


alert(
"Producto agregado al carrito"
);


}






// =================================
// OBTENER CARRITO
// =================================

export function obtenerCarrito(){

return carrito;

}






// =================================
// GUARDAR CARRITO
// =================================

export function guardarCarrito(){


localStorage.setItem(
"carrito",
JSON.stringify(carrito)
);


}






// =================================
// MOSTRAR CANTIDAD
// =================================

export function cantidadCarrito(){


return carrito.reduce(

(total,p)=> total + p.cantidad,

0

);


}






// =================================
// LIMPIAR CARRITO
// =================================

export function vaciarCarrito(){


carrito=[];


guardarCarrito();


}




// Para botones onclick del HTML

window.agregarCarrito = agregarCarrito;