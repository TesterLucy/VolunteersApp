document.addEventListener("DOMContentLoaded", function () {
    const voluntariosLista = document.getElementById("voluntarios-lista");

    // Obtener lista de voluntarios// Cargar la lista de voluntarios desde el servidor
fetch("http://localhost:3000/api/users")
.then((response) => {
    if (!response.ok) {
        throw new Error("Error al cargar la lista de usuarios");
    }
    return response.json();
})
.then((users) => {
    const voluntarios = users.filter(user => user.role === "voluntario");

    const voluntariosLista = document.getElementById('voluntarios-lista');
    voluntarios.forEach(voluntario => {
        const voluntarioDiv = document.createElement("div");
        voluntarioDiv.classList.add("voluntario");
        voluntarioDiv.innerHTML = `
            <h3>${voluntario.username}</h3>
            <p>Email: ${voluntario.email}</p>
            <p>Cédula: ${voluntario.cedula}</p>
            <p>Fecha de nacimiento: ${voluntario.birthdate}</p>
            <button class="editar-button" data-id="${voluntario.username}">Editar</button>
        `;
        voluntariosLista.appendChild(voluntarioDiv);
    });

    // Añadir evento a los botones de edición
    document.querySelectorAll(".editar-button").forEach(button => {
        button.addEventListener("click", function () {
            const username = this.getAttribute("data-id");
            // Mostrar el formulario de edición
            const editFormContainer = document.getElementById('editFormContainer');
            const saveButton = document.getElementById('saveButton');
            const cancelButton = document.getElementById('cancelButton');

            // Obtener los datos del voluntario a editar
            const voluntario = voluntarios.find(v => v.username === username);
            document.getElementById('editUsername').value = voluntario.username; // No editable
            document.getElementById('editEmail').value = voluntario.email;
            document.getElementById('editCedula').value = voluntario.cedula;
            document.getElementById('editBirthdate').value = voluntario.birthdate;

            // Mostrar el formulario de edición
            editFormContainer.style.display = 'block';

            // Acción al guardar
            saveButton.addEventListener('click', function(event) {
                event.preventDefault(); // Evitar recargar la página

                const updatedUser = {
                    username: document.getElementById('editUsername').value,
                    email: document.getElementById('editEmail').value,
                    cedula: document.getElementById('editCedula').value,
                    birthdate: document.getElementById('editBirthdate').value,
                    role: "voluntario" // Asumimos que el rol no cambia
                };

                // Actualizar el usuario en el servidor
                fetch(`http://localhost:3000/api/users/${username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                })
                .then(response => response.json())
                .then(data => {
                    alert("Datos actualizados con éxito");
                    location.reload(); // Recargar para reflejar los cambios
                })
                .catch(error => {
                    console.error('Error al actualizar el usuario:', error);
                });
            });

            // Acción al cancelar
            cancelButton.addEventListener('click', function() {
                editFormContainer.style.display = 'none';
            });
        });
    });
})
.catch(error => {
    console.error(error);
    document.getElementById('voluntarios-lista').innerHTML = `<p>Error al cargar la lista de voluntarios</p>`;
});


    // Botón de cerrar sesión
    document.getElementById("logoutButton").addEventListener("click", function () {
        localStorage.clear();
        window.location.href = "../html/login.html";
    });

    // Botón de salir
    document.getElementById("salirButton").addEventListener("click", function () {
        window.location.href = "../html/voluntariado_normal.html";
    });
});
