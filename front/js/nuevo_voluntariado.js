// Redirige a la página de voluntariado normal
document.getElementById('normalVolunteerButton').addEventListener('click', function () {
    window.location.href = '../html/voluntariado_normal.html'; // Cambia 'voluntariado_normal.html' por tu página de voluntariado normal
});

// Redirige a la página de voluntariado para experiencia laboral
document.getElementById('experienceVolunteerButton').addEventListener('click', function () {
    window.location.href = '../html/voluntariado_experiencia.html'; // Cambia 'voluntariado_experiencia.html' por tu página de voluntariado para experiencia laboral
});

// Redirige a la página del mapa
document.getElementById('mapaButton').addEventListener('click', function () {
    window.location.href = '../html/mapa.html'; // Asegúrate de que el archivo 'mapa.html' esté en la carpeta correcta
});
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.clear(); // Borra todo el localStorage
    window.location.href = '../html/login.html'; // Redirige al login
});
