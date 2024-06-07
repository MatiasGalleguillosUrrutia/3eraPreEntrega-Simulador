// carrito.js

class Carrito {
    constructor() {
        this.items = this.cargarCarrito();
    }

    async agregarItemDesdeServidor(id) {
        try {
            const productos = await cargarProductos();
            const item = productos.find(producto => producto.id === id);
            if (item) {
                this.items.push(item);
                this.guardarCarrito();
                
                // Mostrar un pop-up de confirmación
                Swal.fire({
                    title: 'Producto agregado',
                    text: `${item.titulo} ha sido añadido al carrito.`,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });

                actualizarTablaCarrito();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Producto no encontrado.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar los productos.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    agregarItem(item) {
        this.items.push(item);
        this.guardarCarrito();
        
        // Mostrar un pop-up de confirmación
        Swal.fire({
            title: 'Producto agregado',
            text: `${item.titulo} ha sido añadido al carrito.`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

    eliminarItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.guardarCarrito();
    }

    obtenerItems() {
        return this.items;
    }

    vaciar() {
        this.items = [];
        this.guardarCarrito();
    }

    calcularTotal() {
        const descuento = calcularDescuento(this.items);
        return descuento;
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
    }

    cargarCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
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

function inicializarCarrito() {
    document.getElementById('vaciar-carrito').addEventListener('click', function (e) {
        e.preventDefault();
        carrito.vaciar();
        actualizarTablaCarrito();
    });

    actualizarTablaCarrito(); // Cargar la tabla con los datos del carrito al cargar la página
}

// Función para calcular descuentos
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


document.getElementById('agregar-desde-servidor').addEventListener('click', () => {
    const idProducto = 1; // ID de ejemplo
    carrito.agregarItemDesdeServidor(idProducto);
});
