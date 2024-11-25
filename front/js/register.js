document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se envíe el formulario de inmediato

    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        cedula: document.getElementById('cedula').value,
        birthdate: document.getElementById('birthdate').value
    };

    console.log(userData);  // Verifica los datos que se están enviando

    // Verifica si el usuario es mayor de 18 años antes de enviar los datos al servidor
    const birthdate = new Date(userData.birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();
    const dayDifference = today.getDate() - birthdate.getDate();

    if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
        alert("Debes ser mayor de 18 años para registrarte.");
    } else {
        // Enviar los datos al servidor para el registro
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Registro exitoso') {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                window.location.href = 'login.html'; // Redirige a la página de inicio de sesión
            } else {
                alert(data.message); // Muestra el error si el usuario ya existe
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar registrarse. Inténtalo nuevamente.');
        });
    }
});

document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('registerForm').reset();
    window.location.href = '../../index.html'; // Cambia 'voluntariado_normal.html' por tu página de voluntariado normal
});
