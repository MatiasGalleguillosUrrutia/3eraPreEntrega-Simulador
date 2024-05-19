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

            if (cursoSeleccionado && cursoSeleccionado.fechas) {
                cursoSeleccionado.fechas.forEach(fecha => {
                    fechaSelect.add(new Option(fecha, fecha));
                });
            } else {
                fechaSelect.add(new Option('No hay fechas disponibles', ''));
            }

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

        if (valorSeleccionado === 0) {
            cantidad_clases.style.display = "none";
        } else {
            cantidad_clases.style.display = "";
        }

        for (let i = 0; i < valorSeleccionado; i++) {
            const div = document.createElement("div");
            div.classList.add('col-12', 'col-md-4', 'p-1');
            const botonId = `boton-${i}`;
            div.innerHTML = `
                <div class="card border-1 ">
                    <label class="pb-3 text-center">¿Qué clase quieres tomar?</label>
                    <select class="form-select cursoSelect pb-3 text-center" aria-label="Default select example">
                        <option selected>Elige tu clase</option>
                    </select>
                    <img class="img-fluid rounded w-50 mx-auto d-block rutaSelect m-2" src="./assets/img/imagenes/Eligetuclase.png" alt="">
                    <label class="pb-1 text-center">Fecha</label>
                    <select class="form-select fechaSelect text-center" aria-label="Default select example">
                        <option selected>Elige tu fecha</option>
                    </select>
                    <button class="btn btn-secondary" id="${botonId}" onclick="cambiarEstado('${botonId}')">Agregar</button>
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

    if (boton.innerHTML === "Agregar") {
        boton.innerHTML = "Listo";
        boton.classList.remove('btn-secondary');
        boton.classList.add('btn-success');
        select1.disabled = true;
        select2.disabled = true;

        const TituloClaseSeleccionada = Array_Clases.find(curso => curso.id === IDClaseSeleccionada).titulo;
        const RutaImagenClaseSeleecionada = Array_Clases.find(curso => curso.id === IDClaseSeleccionada).imagen;
        const PrecioClaseSeleecionada = Array_Clases.find(curso => curso.id === IDClaseSeleccionada).precio;

        carrito.agregarItem({
            "id": uniqueItemId, // Usamos el ID único
            "titulo": TituloClaseSeleccionada,
            "fecha": select2.value,
            "imagen": RutaImagenClaseSeleecionada,
            "precio": PrecioClaseSeleecionada
        });
    } else {
        boton.innerHTML = "Agregar";
        boton.classList.remove('btn-success');
        boton.classList.add('btn-secondary');
        select1.disabled = false;
        select2.disabled = false;

        carrito.eliminarItem(uniqueItemId); // Eliminar usando el ID único
    }

    actualizarTablaCarrito(); // Actualizar la tabla cada vez que se agrega o elimina un ítem
}

function inicializarEventos() {
    inicializarSelectores();
}