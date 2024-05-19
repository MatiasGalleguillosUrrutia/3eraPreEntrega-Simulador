//========================UTILIZAMOS LOS DATOS DEL FETCH PARA AGREGARLOS A UN SELECT OPTION================

function cargarClases() {
    const selectoresClases = document.querySelectorAll('.cursoSelect');
    const selectoresFechas = document.querySelectorAll('.fechaSelect');
    

    // Llenar los selectores de cursos
    Array_Clases.forEach((curso, index) => {
      selectoresClases.forEach(selector => {
        selector.add(new Option(curso.titulo, curso.id));
      });

        
    });


    // Evento de cambio en los selectores de cursos
    selectoresClases.forEach((selector, index) => {
        selector.addEventListener('change', () => {
        const cursoSeleccionadoId = selector.value;
        const cursoSeleccionado = Array_Clases.find(curso => curso.id === cursoSeleccionadoId);

        // Limpiar las opciones actuales del selector de fechas correspondiente
        const fechaSelect = selectoresFechas[index];
        fechaSelect.innerHTML = '';

        // Llenar el selector de fechas con las fechas del curso seleccionado
        if (cursoSeleccionado && cursoSeleccionado.fechas) {
            cursoSeleccionado.fechas.forEach(fecha => {
            fechaSelect.add(new Option(fecha, fecha));
            });
        } else {
            fechaSelect.add(new Option('No hay fechas disponibles', ''));
        }

        // Agregar la ruta de la imagen a cada tarjeta
        const tarjeta = selector.closest('.card');
        const imagen = tarjeta.querySelector('img');
        if (cursoSeleccionado && cursoSeleccionado.imagen) {
            imagen.src = cursoSeleccionado.imagen;
        } else {
            imagen.src = ''; // Ruta de imagen por defecto si no hay imagen definida en el curso seleccionado
        }

        });
    });
}


//=======A PARTIR DE DATOS DEL HTML LOGRAMOS TENER UN VALUE ///Y apartir de la cantidad creamos div================

// Agrega un evento 'change' al elemento select de la cantidad de clases
const selectElement = document.querySelector('.form-select');
const cantidad_clases = document.querySelector("#columnas-CantidadClases");


selectElement.addEventListener('change', function() {
    const valorSeleccionado = parseInt(selectElement.value);
    cantidad_clases.innerHTML = "";

    // Muestra u oculta el div dependiendo de si se seleccionó la opción "Elige tu clase"
    if (valorSeleccionado === 0) {
        cantidad_clases.style.display = "none"; // Ocultar el div
        
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
                <label class="pb-1  text-center">Fecha</label>
                <select class="form-select fechaSelect text-center" aria-label="Default select example">
                    <option selected>Elige tu fecha</option>
                </select>
                <button class="btn btn-secondary " id="${botonId}" onclick="cambiarEstado('${botonId}')">Agregar</button>
            </div>
        `;
        cantidad_clases.appendChild(div);
    }
    
    cargarClases(); // DEBO LLAMAR ESTA FUNCION PARA QUE SE VEA EN LOS SELECT CREADOS
    
    carrito.vaciar()
    actualizarTablaCarrito()
});
