// //MENU

// // 1.- cargarClases()
// // 2.- funcion inicializarSelectores()
// // 3.- cambiarEstado(botonId)
// // 4.- inicializarEventos()

function cargarClases() {
    const selectoresClases = document.querySelectorAll('.cursoSelect');
    const selectoresFechas = document.querySelectorAll('.fechaSelect');

    Array_Clases.forEach((curso, index) => {
        selectoresClases.forEach(selector => {
            selector.add(new Option(curso.titulo, curso.id));
        });
    });

    selectoresClases.forEach((selector, index) => {
        selector.addEventListener('change', () => {
            const cursoSeleccionadoId = selector.value;
            const cursoSeleccionado = Array_Clases.find(curso => curso.id === cursoSeleccionadoId);

            const fechaSelect = selectoresFechas[index];
            fechaSelect.innerHTML = '';

           // ==============================Agregando Operadores Ternarios.============================
                
            cursoSeleccionado && cursoSeleccionado.fechas
            ? cursoSeleccionado.fechas.forEach(fecha => fechaSelect.add(new Option(fecha, fecha)))
            : fechaSelect.add(new Option('No hay fechas disponibles', ''));

            // ==============================Agregando Operadores Ternarios.============================

            const tarjeta = selector.closest('.card');
            const imagen = tarjeta.querySelector('img');
            imagen.src = cursoSeleccionado && cursoSeleccionado.imagen ? cursoSeleccionado.imagen : './assets/img/default_image.png';
        });
    });
}

function inicializarSelectores() {
    const selectElement = document.querySelector('.form-select');
    const cantidad_clases = document.querySelector("#columnas-CantidadClases");

    selectElement.addEventListener('change', function() {
        const valorSeleccionado = parseInt(selectElement.value);
        cantidad_clases.innerHTML = "";

// ==============================Agregando Operadores Ternarios.============================
        cantidad_clases.style.display = (valorSeleccionado === 0) ? "none" : "";
// ==============================Agregando Operadores Ternarios.============================
        for (let i = 0; i < valorSeleccionado; i++) {
            const div = document.createElement("div");
            div.classList.add('col-12', 'col-md-4', 'p-1');
            const botonId = `boton-${i}`;
            div.innerHTML = `
                <div class="card border-1 text-center">
                    <label class="pb-3 text-center">¿Qué clase quieres tomar?</label>
                    <select class="form-select cursoSelect pb-3 text-center" aria-label="Default select example">
                        <option selected>Elige tu clase</option>
                    </select>
                    <img class="img-fluid rounded w-50 mx-auto d-block rutaSelect m-2" src="./assets/img/imagenes/Eligetuclase.png" alt="">
                    <label class="pb-1 text-center">Fecha</label>
                    <select class="form-select fechaSelect text-center" aria-label="Default select example">
                        <option selected>Elige tu fecha</option>
                    </select>
                    <button class="btn btn-secondary btn-md mx-auto d-block m-2" id="${botonId}" onclick="cambiarEstado('${botonId}')">Agregar</button>
                </div>

            `;
            cantidad_clases.appendChild(div);
        }

        cargarClases();

        carrito.vaciar();
        actualizarTablaCarrito();
    });
}


function cambiarEstado(botonId) {
    const boton = document.getElementById(botonId);
    const select1 = boton.parentNode.querySelector(".cursoSelect");
    const select2 = boton.parentNode.querySelector(".fechaSelect");

    const IDClaseSeleccionada = select1.value;
    const uniqueItemId = IDClaseSeleccionada + '-' + botonId; // Agregar botonId para asegurar unicidad

    // ==============================Agregando Operadores Ternarios.============================


    boton.innerHTML = (boton.innerHTML === "Agregar") ? "Listo" : "Agregar";
    boton.classList.toggle('btn-secondary');
    boton.classList.toggle('btn-success');
    select1.disabled = !select1.disabled;
    select2.disabled = !select2.disabled;
// ==============================Agregando Operadores Ternarios.============================

    if (boton.innerHTML === "Listo") {
        const curso = Array_Clases.find(curso => curso.id === IDClaseSeleccionada);
        carrito.agregarItem({
            "id": uniqueItemId, // Usamos el ID único
            "titulo": curso.titulo,
            "fecha": select2.value,
            "imagen": curso.imagen,
            "precio": curso.precio
        });
    } else {
        carrito.eliminarItem(uniqueItemId); // Eliminar usando el ID único
    }
    actualizarTablaCarrito(); // Actualizar la tabla cada vez que se agrega o elimina un ítem
}

function inicializarEventos() {
    inicializarSelectores();
}