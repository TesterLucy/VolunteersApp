// Evento para gestionar el inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se envíe el formulario
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validación simple de inicio de sesión
    if (username === "admin" && password === "1234") {
        alert("Inicio de sesión exitoso");
        // Redireccionar o realizar alguna acción
        window.location.href = 'dashboard.html'; // Cambia la ruta a la página deseada
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});

// Evento para el botón de cancelar
document.getElementById('cancelButton').addEventListener('click', function() {
    document.getElementById('loginForm').reset();
    window.location.href = 'wellcome.html';  // Limpia el formulario
});
// Evento para manejar el clic en "Olvidé mi contraseña"
document.getElementById('forgotPasswordButton').addEventListener('click', function() {
    // Puedes redirigir a una página de recuperación de contraseña o abrir un modal
    window.location.href = "forgotpass.html"; // Redirige a la página de recuperación de contraseña
});