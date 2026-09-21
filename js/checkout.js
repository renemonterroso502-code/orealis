/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 CHECKOUT / CREAR VENTA
=========================================
*/


import { db } from "../firebase/config.js";

import { avisarAdmin } from "./notificar_whatsapp.js";


import {

collection,
addDoc,
doc,
getDoc,
updateDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";





const formulario =
document.getElementById("formCompra");


const totalTexto =
document.getElementById("totalCompra");




let carrito = 
JSON.parse(
localStorage.getItem("carrito")
) || [];





let productosCompra = [];

let total = 0;






// =================================
// CARGAR TOTAL
// =================================

async function cargarCompra(){


total = 0;

productosCompra=[];



for(let item of carrito){


const referencia =
doc(
db,
"productos",
item.id
);



const productoSnap =
await getDoc(referencia);



if(productoSnap.exists()){



let producto =
productoSnap.data();



let subtotal =
Number(producto.precio)
*
Number(item.cantidad);



total += subtotal;



productosCompra.push({


id:item.id,


nombre:
producto.nombre,


cantidad:
item.cantidad,


precio:
producto.precio,


subtotal:subtotal


});



}



}



totalTexto.innerHTML = total;



}




cargarCompra();






// =================================
// CREAR VENTA
// =================================


formulario.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



let nombre =
document.getElementById("nombre").value;


let telefono =
document.getElementById("telefono").value;


let direccion =
document.getElementById("direccion").value;


let notas =
document.getElementById("notas").value;





try{



// guardar venta


await addDoc(

collection(db,"ventas"),

{


cliente:nombre,


telefono:telefono,


direccion:direccion,


notas:notas,


productos:productosCompra,


total:total,


fecha:new Date(),


estado:"Pendiente"


}

);




// avisar al admin por WhatsApp (no bloquea la compra si falla)

let listaProductos =
productosCompra
.map((p)=>`${p.nombre} x${p.cantidad}`)
.join(", ");


avisarAdmin(

"🛒 Nuevo pedido\n"+
`Cliente: ${nombre}\n`+
`Tel: ${telefono}\n`+
`Direccion: ${direccion}\n`+
`Productos: ${listaProductos}\n`+
`Notas: ${notas || "Ninguna"}\n`+
`Total: Q${total}`

);





// descontar inventario


for(let item of carrito){



const referencia =
doc(

db,

"productos",

item.id

);



const productoSnap =
await getDoc(referencia);



if(productoSnap.exists()){


let producto =
productoSnap.data();



let nuevoStock =

Number(producto.stock)

-

Number(item.cantidad);





await updateDoc(

referencia,

{

stock:nuevoStock

}

);



}



}







localStorage.removeItem(
"carrito"
);




alert(
"Compra realizada correctamente"
);



window.location.href="../index.html";





}

catch(error){


console.error(
"Error creando venta:",
error
);


alert(
"Error al procesar compra"
);



}



});