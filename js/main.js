/*
=================================
 ORÉALIS - DECORACIONES Y CORTE LÁSER
 MAIN.JS
=================================
*/


// Esperar que cargue la página

document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Oréalis iniciada"
);



/*
==============================
 CAMBIO DE NAVBAR AL HACER SCROLL
==============================
*/


const navbar =
document.querySelector(".navbar");



window.addEventListener(
"scroll",
()=>{


if(window.scrollY > 50){

navbar.classList.add(
"shadow"
);


}else{


navbar.classList.remove(
"shadow"
);


}


});





/*
==============================
 CERRAR MENU MOVIL
==============================
*/


const enlaces =
document.querySelectorAll(
".nav-link"
);



const menu =
document.querySelector(
".navbar-collapse"
);



enlaces.forEach(
(enlace)=>{


enlace.addEventListener(
"click",
()=>{


if(menu.classList.contains("show")){


document
.querySelector(".navbar-toggler")
.click();


}


});


});






/*
==============================
 ANIMACION DE TARJETAS
==============================
*/


const cards =
document.querySelectorAll(
".card"
);



const observer =
new IntersectionObserver(
(entries)=>{


entries.forEach(
(entry)=>{


if(entry.isIntersecting){


entry.target.classList.add(
"mostrar"
);


}


});


},
{
threshold:0.2
}
);



cards.forEach(
(card)=>{


observer.observe(card);


});






/*
==============================
 AÑO AUTOMATICO FOOTER
==============================
*/


const year =
document.getElementById(
"year"
);



if(year){


year.textContent =
new Date()
.getFullYear();


}













/*
==============================
 BOTONES PRODUCTOS
==============================
*/


const productos =
document.querySelectorAll(
"#tienda .btn-primary"
);



productos.forEach(
(boton)=>{


boton.addEventListener(
"click",
()=>{


alert(
"Producto seleccionado. Sistema de compras próximamente disponible."
);


});


});






/*
==============================
 FORMULARIO CONTACTO
==============================
*/


const formulario =
document.querySelector(
"#contacto form"
);



if(formulario){


formulario.addEventListener(
"submit",
(e)=>{


e.preventDefault();



alert(
"Mensaje enviado correctamente."
);



formulario.reset();



});


}





});