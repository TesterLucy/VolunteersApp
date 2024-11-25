// Evento para el botón de salir
document.getElementById('salirButton').addEventListener('click', function() {
    window.location.href = '../html/nuevo_voluntariado.html';
});
// Cargar información de voluntariados desde el servidor
fetch('http://localhost:3000/get-normal-volunteers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const voluntariosLista = document.getElementById('voluntarios-lista');
            const voluntarios = data.volunteers;

            // Limpiar el contenedor
            voluntariosLista.innerHTML = '';

            // Crear la lista de voluntariados, comenzando desde el ID 1
            Object.keys(voluntarios).forEach(id => {
                if (parseInt(id) > 0) { // Asegúrate de que solo se incluyan IDs mayores a 0
                    const voluntario = voluntarios[id];

                    // Crear el elemento contenedor para cada voluntariado
                    const voluntarioDiv = document.createElement('div');
                    voluntarioDiv.classList.add('voluntario');

                    // Crear el título y resumen de cada voluntariado
                    const voluntarioTitulo = document.createElement('h3');
                    voluntarioTitulo.textContent = `Voluntariado #${id}`; // Usar el ID directamente

                    const voluntarioSummary = document.createElement('p');
                    voluntarioSummary.textContent = voluntario.summary;

                    // Agregar el evento de clic para redirigir a los detalles
                    voluntarioDiv.addEventListener('click', function() {
                        window.location.href = `detalles.html?id=${id}`;
                    });

                    // Añadir el título y descripción al contenedor del voluntariado
                    voluntarioDiv.appendChild(voluntarioTitulo);
                    voluntarioDiv.appendChild(voluntarioSummary);

                    // Añadir el contenedor del voluntariado a la lista
                    voluntariosLista.appendChild(voluntarioDiv);
                }
            });
        } else {
            console.error('Error al cargar los datos de voluntariados');
        }
    })
    .catch(error => console.error('Error al cargar los voluntariados:', error));
    
    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.clear(); // Borra todo el localStorage
        window.location.href = '../html/login.html'; // Redirige al login
    });
    