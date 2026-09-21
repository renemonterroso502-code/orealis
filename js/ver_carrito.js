/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 MOSTRAR CARRITO CLIENTE
=========================================
*/


import { db } from "../firebase/config.js";


import {

collection,
getDocs,
doc,
getDoc

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";




const tabla =
document.getElementById("tablaCarrito");


const totalTexto =
document.getElementById("totalCompra");



let carrito = 
JSON.parse(
localStorage.getItem("carrito")
) || [];





async function cargarCarrito(){


tabla.innerHTML="";


let total = 0;



if(carrito.length === 0){


tabla.innerHTML = `


<tr>

<td colspan="6" class="text-center">

<h4>

Carrito vacío

</h4>

<a href="../index.html"
class="btn btn-success">

Ver productos

</a>

</td>

</tr>


`;


totalTexto.innerHTML = 0;


return;

}




for(let item of carrito){



const productoRef =
doc(
db,
"productos",
item.id
);



const productoSnap =
await getDoc(productoRef);



if(productoSnap.exists()){



let producto =
productoSnap.data();



let subtotal =
Number(producto.precio)
*
Number(item.cantidad);



total += subtotal;



tabla.innerHTML += `


<tr>


<td>

<img src="${producto.imagen}"

width="70"

height="70"

style="object-fit:cover;border-radius:10px">

</td>



<td>

${producto.nombre}

</td>



<td>

Q${producto.precio}

</td>



<td>


<button

class="btn btn-danger btn-sm"

onclick="restar('${item.id}')">

-

</button>



${item.cantidad}



<button

class="btn btn-success btn-sm"

onclick="sumar('${item.id}')">

+

</button>



</td>



<td>

Q${subtotal}

</td>



<td>


<button

class="btn btn-outline-danger"

onclick="eliminar('${item.id}')">


<i class="fa fa-trash"></i>


</button>


</td>



</tr>


`;



}



}



totalTexto.innerHTML = total;



}







window.sumar =
function(id){



let producto =
carrito.find(
(p)=>p.id===id
);



producto.cantidad++;



guardar();



};







window.restar =
function(id){



let producto =
carrito.find(
(p)=>p.id===id
);



if(producto.cantidad > 1){


producto.cantidad--;


}else{


eliminar(id);


return;


}



guardar();



};







window.eliminar =
function(id){



carrito =
carrito.filter(
(p)=>p.id!==id
);



guardar();



};








function guardar(){


localStorage.setItem(

"carrito",

JSON.stringify(carrito)

);



cargarCarrito();


}






cargarCarrito();