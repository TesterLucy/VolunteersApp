// Obtener el ID del voluntariado desde la URL
const urlParams = new URLSearchParams(window.location.search);
const volunteerId = urlParams.get('id');

// Validar el ID antes de hacer la solicitud
if (volunteerId === null || isNaN(volunteerId) || parseInt(volunteerId) < 1) {
    document.getElementById('description').innerText = "ID de voluntariado no válido.";
} else {
    // Solicitar los detalles del voluntariado desde el servidor
    fetch(`http://localhost:3000/get-volunteer-details?id=${volunteerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Mostrar la descripción obtenida del servidor
                document.getElementById('description').innerText = data.volunteer.description;
            } else {
                document.getElementById('description').innerText = "Detalles no encontrados.";
            }
        })
        .catch(error => {
            console.error('Error al cargar los detalles:', error);
            document.getElementById('description').innerText = "Hubo un error al cargar los detalles.";
        });
}

document.getElementById('backToMapButton').addEventListener('click', function() {
    window.location.href = '../html/mapa.html'; // Regresa al mapa
});
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.clear(); // Borra todo el localStorage
    window.location.href = '../html/login.html'; // Redirige al login
});
document.getElementById('acceptButton').addEventListener('click', function() {
    localStorage.clear(); // Borra todo el localStorage
    window.location.href = '../html/certificado.html'; // Redirige al login
});