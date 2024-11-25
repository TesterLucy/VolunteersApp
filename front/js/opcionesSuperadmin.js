document.getElementById('EditVolunteerButton').addEventListener('click', function () {
    window.location.href = '../html/editar_voluntariado_general.html'; // Cambia 'voluntariado_normal.html' por tu página de voluntariado normal
});
document.getElementById('EditVolunterButton').addEventListener('click', function () {
    window.location.href = '../html/editar_voluntarios_general.html'; // Cambia 'voluntariado_experiencia.html' por tu página de voluntariado para experiencia laboral
});
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.clear(); // Borra todo el localStorage
    window.location.href = '../html/login.html'; // Redirige al login
});
