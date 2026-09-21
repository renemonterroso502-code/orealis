/*
=========================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 GESTIÓN DE VENTAS / PEDIDOS
=========================================
*/


import { db, auth } from "../../firebase/config.js";


import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
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
"tablaVentas"
);


const buscador =
document.getElementById(
"buscarVenta"
);


const filtroEstado =
document.getElementById(
"filtroEstado"
);


const totalPendientesEl =
document.getElementById(
"totalPendientes"
);


const totalEntregadosEl =
document.getElementById(
"totalEntregados"
);


const totalVendidoEl =
document.getElementById(
"totalVendido"
);



let ventas = [];




// ===============================
// CARGAR VENTAS
// ===============================


async function cargarVentas(){


const datos =
await getDocs(
collection(db,"ventas")
);



ventas=[];



datos.forEach(
(documento)=>{


let v =
documento.data();


v.id =
documento.id;


ventas.push(v);


});




// ordenar por fecha, más reciente primero


ventas.sort(
(a,b)=>{


let fechaA =
a.fecha && a.fecha.seconds
? a.fecha.seconds
: 0;


let fechaB =
b.fecha && b.fecha.seconds
? b.fecha.seconds
: 0;


return fechaB - fechaA;


}
);



actualizarResumen();


aplicarFiltros();


}





// ===============================
// RESUMEN
// ===============================


function actualizarResumen(){


let pendientes =
ventas.filter(
(v)=>v.estado==="Pendiente"
).length;


let entregados =
ventas.filter(
(v)=>v.estado==="Entregado"
).length;


let total =
ventas

.filter(
(v)=>v.estado==="Entregado"
)

.reduce(
(suma,v)=>suma + Number(v.total || 0),
0
);



totalPendientesEl.textContent =
pendientes;


totalEntregadosEl.textContent =
entregados;


totalVendidoEl.textContent =
"Q"+total;


}





// ===============================
// FORMATEAR FECHA
// ===============================


function formatearFecha(fecha){


if(!fecha || !fecha.seconds){


return "-";


}



let f =
new Date(fecha.seconds*1000);



return f.toLocaleDateString()+" "+f.toLocaleTimeString(
[],
{hour:"2-digit",minute:"2-digit"}
);


}





// ===============================
// COLOR SEGÚN ESTADO
// ===============================


function colorEstado(estado){


if(estado==="Entregado"){

return "success";

}


if(estado==="Cancelado"){

return "danger";

}


return "warning";


}





// ===============================
// MOSTRAR VENTA
// ===============================


function mostrarVenta(v){


let listaProductos =
(v.productos || [])
.map(
(p)=>

`${p.nombre} x${p.cantidad}`

)
.join("<br>");




tabla.innerHTML += `


<tr>


<td>

<b>${v.cliente || "-"}</b>

</td>




<td>

${v.telefono || "-"}

<br>

<small class="text-muted">

${v.direccion || "-"}

</small>

</td>




<td>

${listaProductos || "-"}

${
v.notas
? `<br><small class="text-primario"><i class="fa-solid fa-pen"></i> ${v.notas}</small>`
: ""
}

</td>




<td>

<b>Q${v.total || 0}</b>

</td>




<td>

${formatearFecha(v.fecha)}

</td>




<td>

<span class="badge bg-${colorEstado(v.estado)}">

${v.estado || "Pendiente"}

</span>

</td>




<td>


<div class="d-flex gap-1 flex-wrap">


<button

class="btn btn-success btn-sm"

${v.estado==="Entregado" ? "disabled" : ""}

onclick="marcarEntregado('${v.id}')">


<i class="fa fa-check"></i>

Entregado

</button>




<button

class="btn btn-outline-danger btn-sm"

${v.estado==="Cancelado" ? "disabled" : ""}

onclick="cancelarVenta('${v.id}')">


<i class="fa fa-xmark"></i>

Cancelar

</button>




<button

class="btn btn-danger btn-sm"

onclick="eliminarVenta('${v.id}')">


<i class="fa fa-trash"></i>

</button>


</div>


</td>



</tr>


`;



}





// ===============================
// APLICAR FILTROS (búsqueda + estado)
// ===============================


function aplicarFiltros(){


tabla.innerHTML="";



let texto =
buscador.value.toLowerCase();


let estado =
filtroEstado.value;



let resultado =
ventas.filter(
(v)=>{


let coincideTexto =
(v.cliente || "")
.toLowerCase()
.includes(texto);



let coincideEstado =
estado==="todos"
||
v.estado===estado;



return coincideTexto && coincideEstado;


}
);




if(resultado.length===0){


tabla.innerHTML = `

<tr>

<td colspan="7" class="text-center text-muted py-4">

No hay pedidos que coincidan

</td>

</tr>

`;


return;

}




resultado.forEach(
(v)=>{


mostrarVenta(v);


}
);


}





// ===============================
// MARCAR ENTREGADO
// ===============================


window.marcarEntregado =
async function(id){


await updateDoc(

doc(
db,
"ventas",
id
),

{

estado:"Entregado"

}

);



cargarVentas();


};





// ===============================
// CANCELAR VENTA
// ===============================


window.cancelarVenta =
async function(id){


if(!confirm(
"¿Cancelar este pedido?"
)){


return;


}



await updateDoc(

doc(
db,
"ventas",
id
),

{

estado:"Cancelado"

}

);



cargarVentas();


};





// ===============================
// ELIMINAR VENTA
// ===============================


window.eliminarVenta =
async function(id){


if(!confirm(
"¿Eliminar este pedido? Esta acción no se puede deshacer."
)){


return;


}



await deleteDoc(

doc(
db,
"ventas",
id
)

);



cargarVentas();


};





// ===============================
// EVENTOS DE FILTRO
// ===============================


buscador.addEventListener(
"input",
aplicarFiltros
);


filtroEstado.addEventListener(
"change",
aplicarFiltros
);





// iniciar

cargarVentas();



});