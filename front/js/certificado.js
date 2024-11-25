document.addEventListener('DOMContentLoaded', () => {
    // Preguntar al usuario por los datos
    const name = prompt("Por favor, ingresa tu nombre completo:");
    const type = prompt("¿Qué tipo de voluntariado realizaste?");
    const date = new Date().toLocaleDateString();

    // Validar que el usuario haya ingresado los datos
    if (!name || !type) {
        alert("No se ingresaron todos los datos. Por favor, recarga la página e intenta de nuevo.");
        return;
    }

    // Rellenar el certificado con los datos del usuario
    document.getElementById('volunteerName').textContent = name;
    document.getElementById('volunteerType').textContent = type;
    document.getElementById('issueDate').textContent = date;

    alert("¡Certificado generado con éxito!");
});
