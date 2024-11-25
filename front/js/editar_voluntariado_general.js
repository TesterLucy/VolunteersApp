// Evento para el botón de salir
document.getElementById('salirButton').addEventListener('click', function () {
    window.location.href = '../../index.html'; // Redirige a la página de bienvenida
});

// Cargar información de todos los voluntarios
fetch('http://localhost:3000/get-all-volunteers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const voluntariosLista = document.getElementById('voluntarios-lista');
            const voluntarios = data.volunteers;

            // Limpiar el contenedor
            voluntariosLista.innerHTML = '';

            // Clasificar y mostrar voluntarios
            voluntarios.forEach(voluntario => {
                // Crear el contenedor del voluntario
                const voluntarioDiv = document.createElement('div');
                voluntarioDiv.classList.add('voluntario');

                // Crear el contenido estático (vista normal)
                const contentDiv = document.createElement('div');
                contentDiv.classList.add('content');

                const voluntarioTitulo = document.createElement('h3');
                voluntarioTitulo.textContent = `Voluntario #${voluntario.id}`;

                const voluntarioSummary = document.createElement('p');
                voluntarioSummary.textContent = voluntario.summary;

                const voluntarioDescripcion = document.createElement('p');
                voluntarioDescripcion.textContent = voluntario.description;

                const voluntarioUbicacion = document.createElement('p');
                voluntarioUbicacion.textContent = `Ubicación: ${voluntario.location}`;

                const editarBoton = document.createElement('button');
                editarBoton.textContent = 'Editar';
                editarBoton.classList.add('editar-button');

                // Añadir los elementos estáticos
                contentDiv.appendChild(voluntarioTitulo);
                contentDiv.appendChild(voluntarioSummary);
                contentDiv.appendChild(voluntarioDescripcion);
                contentDiv.appendChild(voluntarioUbicacion);
                contentDiv.appendChild(editarBoton);

                // Crear el formulario de edición
                const form = document.createElement('form');
                form.style.display = 'none'; // Oculto por defecto

                const summaryInput = document.createElement('input');
                summaryInput.type = 'text';
                summaryInput.value = voluntario.summary;

                const nombreInput = document.createElement('input');
                nombreInput.type = 'text';
                nombreInput.value = voluntario.description;

                const ubicacionInput = document.createElement('input');
                ubicacionInput.type = 'text';
                ubicacionInput.value = voluntario.location;

                const guardarBoton = document.createElement('button');
                guardarBoton.textContent = 'Guardar';
                guardarBoton.classList.add('save-button');

                const cancelarBoton = document.createElement('button');
                cancelarBoton.textContent = 'Cancelar';
                cancelarBoton.classList.add('cancel-button');

                // Añadir inputs y botones al formulario
                form.appendChild(summaryInput);
                form.appendChild(nombreInput);
                form.appendChild(ubicacionInput);
                form.appendChild(guardarBoton);
                form.appendChild(cancelarBoton);

                // Evento de "Editar"
                editarBoton.addEventListener('click', () => {
                    contentDiv.style.display = 'none'; // Ocultar la vista normal
                    form.style.display = 'flex'; // Mostrar el formulario
                });

                // Evento de "Cancelar"
                cancelarBoton.addEventListener('click', (e) => {
                    e.preventDefault();
                    form.style.display = 'none'; // Ocultar el formulario
                    contentDiv.style.display = 'block'; // Mostrar la vista normal
                });

                // Evento de "Guardar"
                guardarBoton.addEventListener('click', (e) => {
                    e.preventDefault();

                    // Actualizar datos en el servidor
                    fetch(`http://localhost:3000/update-volunteer/${voluntario.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            summary: summaryInput.value,
                            description: nombreInput.value,
                            location: ubicacionInput.value,
                        }),
                    })
                        .then(response => response.json())
                        .then(updatedData => {
                            if (updatedData.success) {
                                // Actualizar la vista
                                voluntarioSummary.textContent = summaryInput.value;
                                voluntarioDescripcion.textContent = nombreInput.value;
                                voluntarioUbicacion.textContent = `Ubicación: ${ubicacionInput.value}`;

                                // Volver a la vista normal
                                form.style.display = 'none';
                                contentDiv.style.display = 'block';
                            } else {
                                console.error('Error al actualizar el voluntario');
                            }
                        })
                        .catch(error => console.error('Error en la solicitud:', error));
                });

                // Añadir el contenido y el formulario al contenedor principal
                voluntarioDiv.appendChild(contentDiv);
                voluntarioDiv.appendChild(form);

                // Añadir el contenedor del voluntario a la lista
                voluntariosLista.appendChild(voluntarioDiv);
            });
        } else {
            console.error('Error al cargar los datos de voluntarios');
        }
    })
    .catch(error => console.error('Error al cargar los voluntarios:', error));
