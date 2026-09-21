/*
=========================================
 CLIENTES - PANEL ADMINISTRADOR
 ORÉALIS - DECORACIONES Y CORTE LÁSER
=========================================
*/

import { db, auth } from "../../firebase/config.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// =========================================
// ESPERAR SESIÓN
// =========================================

function esperarSesion() {

    return new Promise((resolve) => {

        onAuthStateChanged(
            auth,
            (user) => resolve(user)
        );

    });

}


// =========================================
// INICIAR
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        // =================================
        // COMPROBAR SESIÓN
        // =================================

        const usuario =
            await esperarSesion();


        if (!usuario) {

            window.location.href = "login.html";

            return;

        }


        // =================================
        // BOTÓN SALIR
        // =================================

        const salir =
            document.querySelector(
                'a[href="../index.html"]'
            );


        if (salir) {

            salir.addEventListener(
                "click",
                async (e) => {

                    e.preventDefault();

                    await signOut(auth);

                    window.location.href =
                        "../index.html";

                }
            );

        }


        // =================================
        // ELEMENTOS HTML
        // =================================

        const tabla =
            document.getElementById(
                "tablaClientes"
            );


        const buscador =
            document.getElementById(
                "buscarCliente"
            );


        const totalClientesEl =
            document.getElementById(
                "totalClientes"
            );


        // =================================
        // VARIABLES
        // =================================

        let clientes = [];


        // =================================
        // CARGAR CLIENTES
        // =================================

        async function cargarClientes() {

            try {

                const datos =
                    await getDocs(
                        collection(
                            db,
                            "clientes"
                        )
                    );


                clientes = [];


                datos.forEach(
                    (documento) => {

                        const cliente =
                            documento.data();


                        cliente.id =
                            documento.id;


                        clientes.push(cliente);

                    }
                );


                // Total
                totalClientesEl.textContent =
                    clientes.length;


                // Mostrar
                aplicarBusqueda();


            } catch (error) {

                console.error(
                    "Error cargando clientes:",
                    error
                );


                tabla.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            class="text-center text-danger"
                        >

                            <i
                                class="fa-solid fa-triangle-exclamation"
                            ></i>

                            <br>

                            Error al cargar los clientes.

                            <br>

                            <small>
                                ${error.message}
                            </small>

                        </td>

                    </tr>

                `;

            }

        }


        // =================================
        // MOSTRAR CLIENTES
        // =================================

        function mostrarClientes(lista) {

            tabla.innerHTML = "";


            // No hay clientes
            if (lista.length === 0) {

                tabla.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            class="text-center text-muted"
                        >

                            <i
                                class="fa-solid fa-users-slash fa-2x"
                            ></i>

                            <br>

                            No hay clientes registrados.

                        </td>

                    </tr>

                `;

                return;

            }


            lista.forEach(
                (cliente, indice) => {

                    const fila =
                        document.createElement("tr");


                    // =================================
                    // DATOS
                    // =================================

                    const nombre =
                        cliente.nombre ||
                        cliente.name ||
                        "-";


                    const correo =
                        cliente.correo ||
                        cliente.email ||
                        "-";


                    const telefono =
                        cliente.telefono ||
                        cliente.phone ||
                        "-";


                    const fecha =
                        obtenerFecha(
                            cliente.fechaRegistro
                        );


                    // =================================
                    // FILA
                    // =================================

                    fila.innerHTML = `

                        <td>
                            ${indice + 1}
                        </td>

                        <td>
                            <strong>
                                ${escaparHTML(nombre)}
                            </strong>
                        </td>

                        <td>
                            ${escaparHTML(correo)}
                        </td>

                        <td>
                            ${escaparHTML(telefono)}
                        </td>

                        <td>
                            ${fecha}
                        </td>

                    `;


                    tabla.appendChild(fila);

                }
            );

        }


        // =================================
        // BUSCAR
        // =================================

        function aplicarBusqueda() {

            const texto =
                buscador.value
                    .toLowerCase()
                    .trim();


            if (texto === "") {

                mostrarClientes(clientes);

                return;

            }


            const resultados =
                clientes.filter(
                    (cliente) => {

                        const nombre =
                            String(
                                cliente.nombre ||
                                cliente.name ||
                                ""
                            ).toLowerCase();


                        const correo =
                            String(
                                cliente.correo ||
                                cliente.email ||
                                ""
                            ).toLowerCase();


                        const telefono =
                            String(
                                cliente.telefono ||
                                cliente.phone ||
                                ""
                            ).toLowerCase();


                        return (

                            nombre.includes(texto) ||

                            correo.includes(texto) ||

                            telefono.includes(texto)

                        );

                    }
                );


            mostrarClientes(resultados);

        }


        // =================================
        // FECHA
        // =================================

        function obtenerFecha(fecha) {

            if (!fecha) {

                return "-";

            }


            try {

                // Timestamp de Firebase

                if (
                    typeof fecha.toDate ===
                    "function"
                ) {

                    fecha =
                        fecha.toDate();

                }


                const fechaFinal =
                    new Date(fecha);


                if (
                    isNaN(
                        fechaFinal.getTime()
                    )
                ) {

                    return "-";

                }


                return fechaFinal.toLocaleDateString(
                    "es-GT",
                    {

                        day: "2-digit",

                        month: "2-digit",

                        year: "numeric"

                    }
                );

            } catch (error) {

                return "-";

            }

        }


        // =================================
        // SEGURIDAD HTML
        // =================================

        function escaparHTML(texto) {

            return String(texto)

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
                )

                .replace(
                    /"/g,
                    "&quot;"
                )

                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        // =================================
        // BUSCADOR
        // =================================

        buscador.addEventListener(
            "input",
            aplicarBusqueda
        );


        // =================================
        // INICIAR
        // =================================

        cargarClientes();

    }
);
