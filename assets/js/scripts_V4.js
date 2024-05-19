// alert("Bienvenido a Academia de Danza. Si quieres realizar compras de clases favor ingresar la cantidad de clases que quiere tomar. Por alta demanda, queda disponible \
// compras de 1 clase o 2 clases.")

//Estoy usando la rama de V5

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

    actualizarTablaCarrito(); // Cargar la tabla con los datos del carrito al cargar la página
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

