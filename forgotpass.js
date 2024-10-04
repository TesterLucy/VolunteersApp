// Evento para el formulario de "Olvidé mi contraseña"
document.getElementById('forgotPasswordForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario

    const email = document.getElementById('email').value;

    // Validación simple del formato de correo
    if (!validateEmail(email)) {
        alert("Por favor, introduce un correo electrónico válido.");
        return;
    }

    // Simula el envío de la solicitud de recuperación de contraseña
    sendPasswordResetRequest(email)
        .then(response => {
            if (response.success) {
                alert("Se ha enviado un correo de recuperación a " + email);
            } else {
                alert("No se encontró ninguna cuenta con ese correo electrónico.");
            }
        })
        .catch(error => {
            console.error(error);
            alert("Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde.");
        });
});
// Evento para el botón de cancelar
document.getElementById('cancelButton')?.addEventListener('click', function() {
    window.location.href = 'login.html';
});
