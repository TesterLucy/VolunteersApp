document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se envíe el formulario de inmediato

    const loginData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    // Enviar los datos al servidor para el inicio de sesión
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Inicio de sesión exitoso') {
            alert('Inicio de sesión exitoso');
            window.location.href = 'nuevo_voluntariado.html'; // Redirige a la página del dashboard
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
    });
});
document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('loginForm').reset();
    window.location.href = 'wellcome.html'; // Cambia 'voluntariado_normal.html' por tu página de voluntariado normal
});
document.getElementById('forgotPasswordButton').addEventListener('click', function () {
    document.getElementById('loginForm').reset();
    window.location.href = 'forgotpass.html'; // Cambia 'voluntariado_normal.html' por tu página de voluntariado normal
});