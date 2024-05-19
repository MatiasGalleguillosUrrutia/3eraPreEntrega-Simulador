// alert("Bienvenido a Academia de Danza. Si quieres realizar compras de clases favor ingresar la cantidad de clases que quiere tomar. Por alta demanda, queda disponible \
// compras de 1 clase o 2 clases.")



//==========================REALIZAMOS UN FETCH PARA OBTENER LA LISTA DE PRODUCTOS EN JSON================
let Array_Clases; // Declara la variable fuera del fetch

fetch('../productos.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al cargar el archivo');
    }
    return response.json();
  })
  .then(data => {
    Array_Clases = data; // Guarda los datos en Array_Clases
    
    // Cualquier código que necesite acceder a Array_Clases debe estar dentro de este bloque o ser llamado desde aquí
    // console.log(Array_Clases); // Muestra Array_Clases una vez cargado
    
    // Por ejemplo, puedes llamar a una función que utilice Array_Clases aquí
    cargarClases();
  })
  .catch(error => {
    console.error('Error:', error);
  });




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

//=======A PARTIR DE DATOS DEL HTML LOGRAMOS TENER UN VALUE Y apartir de la cantidad creamos diferentes div================

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



//======================Carrito====================================================

class Carrito {
    constructor() {
        this.items = [];
    }

    agregarItem(item) {
        this.items.push(item);
    }

    eliminarItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    obtenerItems() {
        return this.items;
    }

    vaciar() {
        this.items = [];
    }

    calcularTotal() {
        // const subtotal = this.items.reduce((acc, item) => acc + item.precio, 0);
        const descuento = calcularDescuento(this.items);
        return descuento;
    }
}

const carrito = new Carrito();

function actualizarTablaCarrito() {
    const tbody = document.querySelector('#lista-carrito tbody');
    tbody.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos ítems
    carrito.obtenerItems().forEach(item => {
        const fila = tbody.insertRow();
        fila.insertCell(0).innerHTML = `<img src="${item.imagen}" style="width:50px;">`;
        fila.insertCell(1).textContent = item.titulo;
        fila.insertCell(2).textContent = item.fecha;
        
        // Uso de parseFloat para asegurar que conservamos decimales
        const precio = item.precio;
        
        fila.insertCell(3).textContent = isNaN(precio) ? 'No disponible' : precio;

        const botonEliminar = fila.insertCell(4).appendChild(document.createElement('a'));
        botonEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
        </svg>`;
        botonEliminar.onclick = () => {
            carrito.eliminarItem(item.id);
            actualizarTablaCarrito(); // Actualiza la tabla después de eliminar un ítem
        };
    });

    // Agregar fila para mostrar el total
    const filaTotal = tbody.insertRow();
    filaTotal.insertCell(0).textContent = 'Total:';
    filaTotal.insertCell(1);
    filaTotal.insertCell(2);
    
    const total = carrito.calcularTotal();
    filaTotal.insertCell(3).textContent = isNaN(total) ? 'Error en cálculo' : total;
    filaTotal.insertCell(4);
    
}

//===================================CAMBIAMOS EL ESTADO DEL BOTON AGREGAR O LISTO==========================================================

let itemCounter = 0; // Inicializas un contador fuera de la función

function cambiarEstado(botonId) {
    const boton = document.getElementById(botonId);
    const select1 = boton.parentNode.querySelector(".cursoSelect");
    const select2 = boton.parentNode.querySelector(".fechaSelect");

    if (boton.innerHTML === "Agregar") {
        boton.innerHTML = "Listo";
        boton.classList.remove('btn', 'btn-secondary');
        boton.classList.add('btn', 'btn-success');
        select1.disabled = true;
        select2.disabled = true;

        const IDClaseSeleccionada = select1.value;
        const TituloClaseSeleccionada = Array_Clases.find(curso => curso.id === IDClaseSeleccionada).titulo;
        const RutaImagenClaseSeleecionada = Array_Clases.find(curso => curso.id === IDClaseSeleccionada).imagen;
        const PrecioClaseSeleecionada = Array_Clases.find(curso => curso.id === IDClaseSeleccionada).precio;

        // Agregamos un contador al ID para hacerlo único
        const uniqueItemId = IDClaseSeleccionada + '-' + itemCounter++;
        
        carrito.agregarItem({
            "id": uniqueItemId, // Usamos el ID único
            "titulo": TituloClaseSeleccionada,
            "fecha": select2.value,
            "imagen": RutaImagenClaseSeleecionada,
            "precio": PrecioClaseSeleecionada
        });
        actualizarTablaCarrito();  // Actualiza la tabla cada vez que se agrega un ítem
    } else {
        boton.innerHTML = "Agregar";
        boton.classList.remove('btn', 'btn-success');
        boton.classList.add('btn', 'btn-secondary');
        select1.disabled = false;
        select2.disabled = false;

        // Para eliminar, necesitarás encontrar el ID correcto con un método similar
        carrito.eliminarItem(select1.value); // Aquí necesitarás ajustar cómo manejas el ID único al eliminar
        actualizarTablaCarrito();  // Actualiza la tabla cada vez que se elimina un ítem
    }
}

//===============================UNA VEZ CARGADA LA PAGINA COMPLETA SE PUEDE APRETAR EL BOTON VACIAR CARRITO=====================================

document.addEventListener('DOMContentLoaded', function () {
   
    // Vincular eventos a botones y otros elementos
    document.getElementById('vaciar-carrito').addEventListener('click', function (e) {
        e.preventDefault();
        carrito.vaciar();
        actualizarTablaCarrito();
    });

    // Agregar eventos a otros botones de acción como se necesite
});

//==============================================AQUI ASIGNAMOS PRECIOS A LOS PACKS.======================================================================
function calcularDescuento(items) {
    const cantidad = items.length;
    if (cantidad === 2) {
        return 15000;  
    }
    if (cantidad === 4) {
        return 29000;  
    }
    if (cantidad === 6) {
        return 43000; 
    }
    if (cantidad === 8) {
        return 57000; 
    }
    return 0; // No hay descuento
}




//=====================================Funcion para guardar la lista del carrito en el Local Storage==================================
// Añadir un producto al carrito
function agregarAlCarrito(productoId) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(productoId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
  
  // Recuperar los productos del carrito
  function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
  }
  
  // Mostrar los productos del carrito al usuario
  function mostrarCarrito() {
    let carrito = obtenerCarrito();
    carrito.forEach(productoId => {
      // Lógica para mostrar cada producto
    });
  }
  