/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 SISTEMA DE PRODUCTOS FIREBASE
=========================================
*/


import { db, auth } from "../../firebase/config.js";


import {
collection,
addDoc,
getDocs,
deleteDoc,
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



const formulario =
document.getElementById("productoForm");


const tabla =
document.getElementById("listaProductos");


const inputImagen =
document.getElementById("imagen");


const vista =
document.getElementById("vistaImagen");


const buscador =
document.getElementById("buscarProducto");



let editando = null;

let productos = [];




// ===============================
// Vista previa imagen (comprimida)
// ===============================

// Firestore no permite guardar más de ~1MB en un solo campo,
// así que antes de guardar la imagen la redimensionamos y
// comprimimos con un canvas.

const ANCHO_MAXIMO = 900;
const CALIDAD_JPEG = 0.7;


function comprimirImagen(archivo){

return new Promise((resolve, reject) => {

const lector = new FileReader();

lector.onload = function(e){

const img = new Image();

img.onload = function(){

let ancho = img.width;
let alto = img.height;

if(ancho > ANCHO_MAXIMO){
alto = Math.round(alto * (ANCHO_MAXIMO / ancho));
ancho = ANCHO_MAXIMO;
}

const canvas = document.createElement("canvas");
canvas.width = ancho;
canvas.height = alto;

const ctx = canvas.getContext("2d");
ctx.drawImage(img, 0, 0, ancho, alto);

let calidad = CALIDAD_JPEG;
let resultado = canvas.toDataURL("image/jpeg", calidad);

// Si aún pesa mucho, bajamos la calidad hasta que quepa
// cómodamente dentro del límite de Firestore (1MB por campo).
const LIMITE_BYTES = 700000;

while(resultado.length > LIMITE_BYTES && calidad > 0.3){
calidad -= 0.1;
resultado = canvas.toDataURL("image/jpeg", calidad);
}

resolve(resultado);

};

img.onerror = reject;

img.src = e.target.result;

};

lector.onerror = reject;

lector.readAsDataURL(archivo);

});

}


inputImagen.addEventListener(
"change",
async ()=>{


let archivo =
inputImagen.files[0];


if(archivo){


try{

const dataUrlComprimido =
await comprimirImagen(archivo);

vista.src =
dataUrlComprimido;

vista.style.display =
"block";

}
catch(error){

console.error(
"Error al procesar la imagen:",
error
);

alert(
"No se pudo procesar esa imagen. Intenta con otra."
);

}


}


});






// ===============================
// Mostrar productos
// ===============================


async function cargarProductos(){


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



tabla.innerHTML += `


<tr>


<td>

<img src="${p.imagen}"

width="60"

height="60"

style="object-fit:cover;border-radius:10px">

</td>



<td>

<b>${p.nombre}</b>

<br>

<small>
${p.categoria}
</small>

</td>



<td>

Q${p.precio}

</td>



<td>

${p.stock}

</td>



<td>


<button

class="btn btn-warning btn-sm"

onclick="editarProducto('${p.id}')">


<i class="fa fa-edit"></i>


</button>




<button

class="btn btn-danger btn-sm"

onclick="eliminarProducto('${p.id}')">


<i class="fa fa-trash"></i>


</button>



</td>



</tr>


`;


});


}






// cargar al iniciar

cargarProductos();








// ===============================
// Guardar producto
// ===============================


formulario.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



let producto={


nombre:
document.getElementById("nombre").value,


categoria:
document.getElementById("categoria").value,


precio:
Number(
document.getElementById("precio").value
),


stock:
Number(
document.getElementById("stock").value
),


descripcion:
document.getElementById("descripcion").value,


imagen:
vista.src || "../img/producto1.jpg"


};






if(editando !== null){



await updateDoc(

doc(
db,
"productos",
editando
),

producto

);



editando=null;



}else{



await addDoc(

collection(db,"productos"),

producto

);



}



alert(
"Producto guardado"
);



formulario.reset();


vista.style.display="none";


cargarProductos();



});








// ===============================
// Editar
// ===============================


window.editarProducto =
function(id){



let p =
productos.find(
(x)=>x.id==id
);



if(!p)return;



document.getElementById("nombre").value =
p.nombre;


document.getElementById("categoria").value =
p.categoria;


document.getElementById("precio").value =
p.precio;


document.getElementById("stock").value =
p.stock;


document.getElementById("descripcion").value =
p.descripcion;



vista.src =
p.imagen;


vista.style.display =
"block";



editando=id;



window.scrollTo({

top:0,

behavior:"smooth"

});



}








// ===============================
// Eliminar
// ===============================


window.eliminarProducto =
async function(id){



if(confirm("¿Eliminar producto?")){



await deleteDoc(

doc(

db,

"productos",

id

)

);



cargarProductos();



}



}








// ===============================
// Buscar
// ===============================


buscador.addEventListener(
"input",
()=>{


let texto =
buscador.value.toLowerCase();



let resultado =
productos.filter(
(p)=>

p.nombre
.toLowerCase()
.includes(texto)

);




tabla.innerHTML="";



resultado.forEach(
(p)=>{



tabla.innerHTML += `


<tr>


<td>

<img src="${p.imagen}"

width="60"

height="60">

</td>



<td>

<b>${p.nombre}</b>

<br>

<small>${p.categoria}</small>

</td>



<td>

Q${p.precio}

</td>



<td>

${p.stock}

</td>



<td>


<button

class="btn btn-warning btn-sm"

onclick="editarProducto('${p.id}')">


<i class="fa fa-edit"></i>


</button>



<button

class="btn btn-danger btn-sm"

onclick="eliminarProducto('${p.id}')">


<i class="fa fa-trash"></i>


</button>



</td>



</tr>


`;



});



});



});
