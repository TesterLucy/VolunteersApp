// Validación de mayor de edad en el registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se envíe el formulario

    const birthdate = new Date(document.getElementById('birthdate').value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    const dayDifference = today.getDate() - birthdate.getDate();

    if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
        alert("Debes ser mayor de 18 años para registrarte.");
    } else {
        alert("Registro exitoso.");
        // Aquí podrías enviar el formulario si pasa la validación
    }
});

// Evento para el formulario de "Olvidé mi contraseña"
document.getElementById('forgotPasswordForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    // Aquí puedes agregar la lógica para enviar el correo de recuperación
    alert("Se ha enviado un correo de recuperación a " + email);
});

// Evento para el botón de cancelar (aplicable para cualquier formulario)
document.getElementById('cancelButton').addEventListener('click', function() {
    window.location.href = 'wellcome.html'; // Limpia el formulario
});
