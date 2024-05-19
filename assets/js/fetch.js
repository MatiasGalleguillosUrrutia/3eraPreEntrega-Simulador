//==========================REALIZAMOS UN FETCH PARA OBTENER LA LISTA DE PRODUCTOS EN JSON================


let Array_Clases;

function cargarClasesDesdeJSON() {
    fetch('productos.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al cargar el archivo');
        }
        return response.json();
      })
      .then(data => {
        Array_Clases = data;
        cargarClases();
      })
      .catch(error => {
        console.error('Error:', error);
      });
}
