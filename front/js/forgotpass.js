// Función para validar el formato del correo
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Evento para el formulario de "Olvidé mi contraseña"
document.getElementById('forgotPasswordForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío del formulario

    const email = document.getElementById('email').value;

    // Validación simple del formato de correo
    if (!validateEmail(email)) {
        alert("Por favor, introduce un correo electrónico válido.");
        return;
    }

    // Enviar solicitud de recuperación de contraseña
    fetch('http://localhost:3000/recover-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            window.location.href = '../html/verificarcodi.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Hubo un error al procesar la solicitud. Inténtalo de nuevo más tarde.");
    });
});

// Evento para el botón de cancelar
document.getElementById('cancelButton')?.addEventListener('click', function() {
    window.location.href = '../html/login.html';
});
