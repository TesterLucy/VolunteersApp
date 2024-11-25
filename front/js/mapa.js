const map = L.map('map').setView([4.611, -74.08175], 12); // Coordenadas de Bogotá

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

fetch('http://localhost:3000/get-normal-volunteers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const locations = data.volunteers;

            locations.forEach(location => {
                // Crear el marcador basado en el tipo de voluntariado
                const marker = L.marker(location.coords, {
                    icon: L.divIcon({
                        className: 'marker-normal',
                        iconSize: [25, 41],
                    })
                }).addTo(map);

                // Agregar un evento de clic al marcador
                marker.on('click', function() {
                    // Redirigir a la página de detalles con el ID del voluntariado
                    window.location.href = `detalles.html?id=${location.id}`;
                });
            });
        } else {
            console.error('Error al cargar los datos de voluntariado');
        }
    })
    .catch(error => console.error('Error al cargar los detalles:', error));

// Agregar otra llamada para voluntarios con experiencia si es necesario
fetch('http://localhost:3000/get-experience-volunteers')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const locations = data.volunteers;

            locations.forEach(location => {
                // Crear el marcador basado en el tipo de voluntariado
                const marker = L.marker(location.coords, {
                    icon: L.divIcon({
                        className: 'marker-experience',
                        iconSize: [25, 41],
                    })
                }).addTo(map);

                // Agregar un evento de clic al marcador
                marker.on('click', function() {
                    // Redirigir a la página de detalles con el ID del voluntariado
                    window.location.href = `detalles.html?id=${location.id}`;
                });
            });
        } else {
            console.error('Error al cargar los datos de voluntariado');
        }
    })
    .catch(error => console.error('Error al cargar los detalles:', error));