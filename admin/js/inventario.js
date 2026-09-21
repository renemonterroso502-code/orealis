/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 INVENTARIO FIREBASE
=========================================
*/


import { db, auth } from "../../firebase/config.js";


import {
collection,
getDocs,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



function esperarSesion(){


return new Promise(
(resolve)=>{


onAuthStateChanged(
auth,
(user)=>resolve(user)
);


}
);


}



document.addEventListener(
"DOMContentLoaded",
async ()=>{



// comprobar sesión

let usuario =
await esperarSesion();



if(!usuario){


window.location.href="login.html";


return;


}



const salir =
document.querySelector(
'a[href="../index.html"]'
);


if(salir){


salir.addEventListener(
"click",
async (e)=>{


e.preventDefault();



await signOut(auth);



window.location.href =
"../index.html";


});


}



const tabla =
document.getElementById(
"tablaInventario"
);



const buscador =
document.getElementById(
"buscarInventario"
);



let productos = [];




// ===============================
// CARGAR INVENTARIO
// ===============================


async function cargarInventario(){


tabla.innerHTML="";



const datos =
await getDocs(
collection(db,"productos")
);



productos=[];



datos.forEach(
(documento)=>{


let p =
documento.data();


p.id =
documento.id;


productos.push(p);



mostrarProducto(p);


});


}




// ===============================
// MOSTRAR PRODUCTO
// ===============================


function mostrarProducto(p){



let estado;

let color;



if(Number(p.stock)<=0){


estado="Agotado";

color="danger";


}

else if(Number(p.stock)<=5){


estado="Bajo";

color="warning";


}

else{


estado="Disponible";

color="success";


}




tabla.innerHTML += `


<tr>


<td>


<img src="${p.imagen}"

width="60"

height="60"

style="
object-fit:cover;
border-radius:10px">


</td>




<td>


<b>${p.nombre}</b>


<br>


<small>

${p.categoria}

</small>


</td>




<td>


<h5>

${p.stock}

</h5>


</td>




<td>


<span class="badge bg-${color}">

${estado}

</span>


</td>





<td>


<button

class="btn btn-success btn-sm"

onclick="sumarUno('${p.id}')">


<i class="fa fa-plus"></i>


</button>


</td>






<td>


<button

class="btn btn-danger btn-sm"

onclick="restarUno('${p.id}')">


<i class="fa fa-minus"></i>


</button>


</td>






<td>


<button

class="btn btn-primary btn-sm"

onclick="cantidad('${p.id}')">


<i class="fa fa-list-ol"></i>


Cantidad


</button>


</td>



</tr>


`;



}





// ===============================
// SUMAR +1
// ===============================


window.sumarUno =
async function(id){



let producto =
productos.find(
(p)=>p.id==id
);



let nuevoStock =
Number(producto.stock)+1;



await updateDoc(

doc(
db,
"productos",
id
),

{

stock:nuevoStock

}


);



cargarInventario();



};






// ===============================
// RESTAR -1
// ===============================


window.restarUno =
async function(id){



let producto =
productos.find(
(p)=>p.id==id
);



if(Number(producto.stock)>0){



let nuevoStock =
Number(producto.stock)-1;



await updateDoc(

doc(
db,
"productos",
id
),

{

stock:nuevoStock

}


);



cargarInventario();



}



};








// ===============================
// AGREGAR CANTIDAD
// ===============================


window.cantidad =
async function(id){



let numero =
prompt(
"Ingresar cantidad:"
);



if(numero){



let producto =
productos.find(
(p)=>p.id==id
);



let nuevoStock =
Number(producto.stock)
+
Number(numero);



await updateDoc(

doc(
db,
"productos",
id
),

{

stock:nuevoStock

}


);



cargarInventario();



}



};







// ===============================
// BUSCAR
// ===============================


buscador.addEventListener(
"input",
()=>{


let texto =
buscador.value.toLowerCase();



tabla.innerHTML="";



productos

.filter(
(p)=>

p.nombre
.toLowerCase()
.includes(texto)

)

.forEach(
(p)=>{


mostrarProducto(p);


});


});






// iniciar

cargarInventario();



});