
//===============================UNA VEZ CARGADA LA PAGINA COMPLETA SE PUEDE APRETAR EL BOTON VACIAR CARRITO=====================================


function inicializarEventos() {
    document.getElementById('vaciar-carrito').addEventListener('click', function (e) {
        e.preventDefault();
        carrito.vaciar();
        actualizarTablaCarrito();
    });

    actualizarTablaCarrito(); // Cargar la tabla con los datos del carrito al cargar la página
}