document.getElementById('loginForm').addEventListener('submit', function (event) {
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
            console.log(data); // Verifica qué datos está enviando el backend

            if (data.message === 'Inicio de sesión exitoso') {
                alert('Inicio de sesión exitoso');

                // Normalizar el valor del rol para evitar errores (asegúrate de usar minúsculas)
                const userRole = data.role ? data.role.trim().toLowerCase() : '';

                // Guardar el rol en localStorage
                localStorage.setItem('userRole', userRole);

                // Redirigir según el rol
                if (userRole === 'admin') {
                    console.log('Redirigiendo al panel de admin');
                    window.location.href = '../html/editar_voluntariado_general.html';
                } else if (userRole === 'superadmin') {
                    console.log('Redirigiendo al panel de superadmin');
                    window.location.href = '../html/opcionesSuperadmin.html';
                } else if (userRole === 'voluntario') {
                    console.log('Redirigiendo al panel de voluntario');
                    window.location.href = '../html/nuevo_voluntariado.html';
                } else {
                    alert('No olvides registrarte');
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar iniciar sesión. Inténtalo nuevamente.');
        });
});

// Botón de cancelar
document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('loginForm').reset();
    window.location.href = '../../index.html'; // Página de bienvenida
});

// Botón de "Olvidé mi contraseña"
document.getElementById('forgotPasswordButton').addEventListener('click', function () {
    document.getElementById('loginForm').reset();
    window.location.href = '../html/forgotpass.html'; // Página de recuperación de contraseña
});
