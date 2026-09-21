/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 PRODUCTOS CLIENTES (agrupados por categoría)
=========================================
*/


import { db } from "../firebase/config.js";

import { agregarCarrito } from "./carrito.js";


import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const lista =
document.getElementById("listaProductos");


// Guarda los datos completos de cada producto para poder
// mostrarlos en el modal al hacer clic en la tarjeta.
const productosData = {};



function tarjetaProducto(id, producto){

productosData[id] = producto;

return `

<div class="producto-slide">

<div class="card shadow h-100 producto-card" onclick="abrirModalProducto('${id}')">

<img src="${producto.imagen}"
class="card-img-top"
style="height:220px;object-fit:cover">

<div class="card-body d-flex flex-column">

<h5>
${producto.nombre}
</h5>

<h4 class="text-success mt-auto mb-0">
Q${producto.precio}
</h4>

</div>

</div>

</div>

`;

}



window.abrirModalProducto = function(id){

const producto = productosData[id];

if(!producto) return;


document.getElementById("modalProductoNombre").textContent =
producto.nombre;

document.getElementById("modalProductoImagen").src =
producto.imagen;

document.getElementById("modalProductoDescripcion").textContent =
producto.descripcion;

document.getElementById("modalProductoStock").textContent =
`Stock disponible: ${producto.stock}`;

document.getElementById("modalProductoPrecio").textContent =
`Q${producto.precio}`;


const boton = document.getElementById("modalProductoBtn");

boton.onclick = function(){
agregarCarrito(id);
bootstrap.Modal.getOrCreateInstance(
document.getElementById("modalProducto")
).hide();
};


bootstrap.Modal.getOrCreateInstance(
document.getElementById("modalProducto")
).show();

};



function categoriaHTML(nombreCategoria, productos){

const slides =
productos
.map((p) => tarjetaProducto(p.id, p.producto))
.join("");

return `

<div class="categoria-bloque mb-5">

<h3 class="categoria-titulo mb-3">
${nombreCategoria}
</h3>

<div class="categoria-slider">
${slides}
</div>

</div>

`;

}



async function cargarProductos(){


try{


const querySnapshot =
await getDocs(
collection(db,"productos")
);



lista.innerHTML="";



if(querySnapshot.empty){


lista.innerHTML = `

<div class="alert alert-warning">

No hay productos disponibles

</div>

`;

return;

}



// Agrupar productos por categoría, respetando el orden
// en que aparece cada categoría por primera vez.

const categorias = new Map();

querySnapshot.forEach((documento) => {

const producto = documento.data();
const nombreCategoria = producto.categoria || "Otros";

if(!categorias.has(nombreCategoria)){
categorias.set(nombreCategoria, []);
}

categorias.get(nombreCategoria).push({
id: documento.id,
producto: producto
});

});


let html = "";

categorias.forEach((productos, nombreCategoria) => {
html += categoriaHTML(nombreCategoria, productos);
});

lista.innerHTML = html;


}
catch(error){


console.error(
"Error cargando productos:",
error
);



lista.innerHTML = `


<div class="alert alert-danger">

Error al cargar productos

</div>


`;



}



}



window.addEventListener(
"DOMContentLoaded",
cargarProductos
);