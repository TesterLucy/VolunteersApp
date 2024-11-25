// Verificar código
document.getElementById('verifyCodeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userData = {
        email: document.getElementById('email').value,
        code: document.getElementById('code').value
    };

    fetch('http://localhost:3000/verify-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Código verificado correctamente. Ahora puedes cambiar tu contraseña.');
            window.location.href = '../html/cambiarcontra.html'; // Redirige al formulario de cambio de contraseña
        } else {
            alert('El código ingresado no es válido o ha expirado.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al verificar el código.');
    });
});