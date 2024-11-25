// Cambiar contraseña
document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userData = {
        email: document.getElementById('email').value,
        newPassword: document.getElementById('newPassword').value
    };

    fetch('http://localhost:3000/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Contraseña cambiada con éxito. Ahora puedes iniciar sesión.');
            window.location.href = '../html/login.html'; // Redirige a la página de inicio de sesión
        } else {
            alert('Hubo un problema al cambiar la contraseña.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al cambiar la contraseña.');
    });
});