const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Para generar códigos únicos
const port = 3000;
const usersFile = './users.json';

// Usar CORS para permitir peticiones de cualquier origen
app.use(cors());
app.use(express.json());

// Configurar el transporte de Nodemailer
const transporter = nodemailer.createTransport({
    port: 587,
    host: 'smtp.gmail.com',
    auth: {
        user: 'replyno311@gmail.com', // Tu correo de envío
        pass: 'dcbi zizz ltxa utbc' // Asegúrate de usar una contraseña segura
    }
});
const corsOptions = {
    origin: 'http://localhost:3000', // Especifica el origen de tu frontend
    methods: ['GET', 'POST'],
    credentials: true, // Permitir que se envíen cookies o credenciales
};
// Mapa temporal para almacenar códigos de recuperación (en producción usar una base de datos)
let resetCodes = {};
//Usuario
// Ruta para registro de usuarios
app.post('/register', (req, res) => {
    const newUser = req.body;

    // Validar que todos los campos necesarios estén presentes
    if (!newUser.username || !newUser.email || !newUser.password || !newUser.cedula || !newUser.birthdate) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Leer el archivo JSON de usuarios
    fs.readFile(usersFile, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer archivo de usuarios' });
        }

        const users = JSON.parse(data);
        const userExists = users.some(user => user.username === newUser.username || user.email === newUser.email);

        if (userExists) {
            return res.status(400).json({ message: 'Usuario ya registrado' });
        }

        // Agregar el nuevo usuario al archivo JSON
        users.push(newUser);
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar usuario' });
            }

            res.status(201).json({ message: 'Registro exitoso' });
        });
    });
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Leer archivo de usuarios
    fs.readFile(usersFile, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer archivo de usuarios:', err);
            return res.status(500).json({ message: 'Error al leer archivo de usuarios' });
        }

        const users = JSON.parse(data); // Parsear archivo JSON
        const user = users.find(u => u.username === username && u.password === password); // Buscar usuario por credenciales

        if (!user) {
            // Usuario no encontrado o credenciales incorrectas
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        res.json({
            message: 'Inicio de sesión exitoso',
            role: user.role 
        });
    });
});
// Middleware para verificar el rol de usuario
// Ejemplo de rutas protegidas por roles
const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        const { username } = req.body; // Extrae el nombre de usuario desde el body

        // Leer archivo de usuarios
        fs.readFile(usersFile, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error al leer archivo de usuarios:', err);
                return res.status(500).json({ message: 'Error al leer archivo de usuarios' });
            }

            const users = JSON.parse(data); // Parsear archivo JSON
            const user = users.find(u => u.username === username); // Buscar usuario por nombre

            if (!user) {
                // Usuario no encontrado
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            if (user.role !== requiredRole) {
                // Usuario no tiene el rol requerido
                return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta.' });
            }

            next(); // Si el rol coincide, continúa al siguiente middleware o ruta
        });
    };
};
//
// Cambio de contraseña
app.post('/recover-password', (req, res) => {
    const { email } = req.body;

    fs.readFile('./users.json', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer archivo de usuarios.' });
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'No se encontró ninguna cuenta con ese correo electrónico.' });
        }

        // Generar un código único de 6 dígitos
        const code = crypto.randomInt(100000, 999999).toString();

        // Almacenar el código temporalmente
        resetCodes[email] = code;

        // Envía el correo con el código de recuperación
        const mailOptions = {
            from: 'replyno311@gmail.com',
            to: email,
            subject: 'Código de Recuperación de Contraseña',
            text: `Tu código de recuperación es: ${code}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
            }
            res.json({ success: true, message: 'Se ha enviado un correo de recuperación con el código a ' + email });
        });
    });
});
app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;

    if (resetCodes[email] && resetCodes[email] === code) {
        // Código correcto, permitir al usuario proceder
        res.json({ success: true, message: 'Código verificado. Puedes proceder a cambiar tu contraseña.' });
    } else {
        // Código incorrecto
        res.status(400).json({ success: false, message: 'Código incorrecto o expirado.' });
    }
});
app.post('/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    // Leer el archivo de usuarios y actualizar la contraseña
    fs.readFile(usersFile, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer archivo de usuarios.' });
        }

        const users = JSON.parse(data);
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Actualizar la contraseña
        users[userIndex].password = newPassword;

        // Guardar los cambios en el archivo
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar la nueva contraseña.' });
            }

            // Eliminar el código de recuperación
            delete resetCodes[email];

            res.json({ success: true, message: 'Contraseña actualizada con éxito. Redirigiendo a inicio de sesión...' });
        });
    });
});

// Obtener voluntarios
app.get('/get-normal-volunteers', (req, res) => {
    const volunteerFile = './voluntariados.json';

    // Leer el archivo JSON de voluntariados
    fs.readFile(volunteerFile, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer el archivo de voluntariados.' });
        }

        const volunteers = JSON.parse(data);
        // Filtrar solo voluntarios normales
        const normalVolunteers = Object.keys(volunteers)
            .filter(key => volunteers[key].type === 'normal')
            .map(key => ({
                id: key,
                summary: volunteers[key].summary,
                description: volunteers[key].description,
                coords: volunteers[key].coords,
            }));

        res.json({ success: true, volunteers: normalVolunteers });
    });
});
app.get('/get-experience-volunteers', (req, res) => {
    const volunteerFile = './voluntariados.json';

    // Leer el archivo JSON de voluntariados
    fs.readFile(volunteerFile, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer el archivo de voluntariados.' });
        }

        const volunteers = JSON.parse(data);
        // Filtrar solo voluntarios con experiencia
        const experienceVolunteers = Object.keys(volunteers)
            .filter(key => volunteers[key].type === 'experience')
            .map(key => ({
                id: key,
                summary: volunteers[key].summary,
                description: volunteers[key].description,
                coords: volunteers[key].coords,
            }));

        res.json({ success: true, volunteers: experienceVolunteers });
    });
});
app.get('/get-volunteer-details', (req, res) => {
    const volunteerId = req.query.id; // Obtener el ID de los parámetros de consulta
    const volunteerFile = './voluntariados.json';

    // Leer el archivo JSON de voluntariados
    fs.readFile(volunteerFile, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer el archivo de voluntariados.' });
        }

        const volunteers = JSON.parse(data);

        // Verificar si el voluntariado con el ID proporcionado existe
        if (volunteers[volunteerId]) {
            res.json({ success: true, volunteer: volunteers[volunteerId] });
        } else {
            res.status(404).json({ success: false, message: 'Detalles de voluntariado no encontrados.' });
        }
    });
})
//
//admin
app.post('/voluntario-route', verifyRole('voluntario'), (req, res) => {
    res.json({ message: 'Bienvenido, voluntario. Tienes acceso a esta ruta.' });
});

app.post('/admin-route', verifyRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenido, administrador. Tienes acceso a esta ruta.' });
});

app.post('/superadmin-route', verifyRole('superadmin'), (req, res) => {
    res.json({ message: 'Bienvenido, superadministrador. Tienes acceso a esta ruta.' });
});

// Endpoint para obtener todos los voluntarios (normales y con experiencia)
app.get('/get-all-volunteers', (req, res) => {
    const volunteerFile = './voluntariados.json';

    // Leer el archivo JSON de voluntariados
    fs.readFile(volunteerFile, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer el archivo de voluntariados.' });
        }

        const volunteers = JSON.parse(data);

        // Transformar los datos para enviarlos en formato más útil para el frontend
        const allVolunteers = Object.keys(volunteers).map(key => ({
            id: key,
            summary: volunteers[key].summary,
            description: volunteers[key].description,
            type: volunteers[key].type, // 'normal' o 'experience'
            location: volunteers[key].location,
            coords: volunteers[key].coords,
        }));

        res.json({ success: true, volunteers: allVolunteers });
    });
});
// Ruta del archivo JSON
const volunteerFile = './voluntariados.json';

// Endpoint para actualizar un voluntario por ID
app.put('/update-volunteer/:id', (req, res) => {
    const volunteerId = req.params.id; // ID del voluntario a actualizar
    const { summary ,description, location } = req.body; // Datos actualizados

    // Leer el archivo JSON
    fs.readFile(volunteerFile, (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error al leer el archivo de voluntariados.' });
        }

        // Parsear el contenido del archivo JSON
        let volunteers = JSON.parse(data);

        // Verificar si el ID existe en el archivo
        if (!volunteers[volunteerId]) {
            return res.status(404).json({ success: false, message: 'Voluntario no encontrado.' });
        }

        // Actualizar los datos del voluntario
        volunteers[volunteerId].summary = summary || volunteers[volunteerId].summary;
        volunteers[volunteerId].description = description || volunteers[volunteerId].description;
        volunteers[volunteerId].location = location || volunteers[volunteerId].location;

        // Escribir los cambios en el archivo JSON
        fs.writeFile(volunteerFile, JSON.stringify(volunteers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error al guardar los cambios en el archivo de voluntariados.' });
            }

            res.json({ success: true, message: 'Voluntario actualizado con éxito.', volunteer: volunteers[volunteerId] });
        });
    });
});
// Endpoint para obtener todos los usuarios
app.get('/api/users', (req, res) => {
    fs.readFile(usersFile, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer archivo de usuarios:', err);
            return res.status(500).json({ message: 'Error al leer usuarios' });
        }

        const users = JSON.parse(data);
        res.json(users);
    });
});
app.put('/api/users/:username', (req, res) => {
    const currentUsername = req.params.username; // Nombre de usuario actual
    const updatedUser = req.body; // Datos actualizados del usuario

    // Leer archivo de usuarios
    fs.readFile(usersFile, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error al leer archivo de usuarios:', err);
            return res.status(500).json({ message: 'Error al leer archivo de usuarios' });
        }

        let users = JSON.parse(data);
        const userIndex = users.findIndex(u => u.username === currentUsername);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el nuevo username ya existe
        const usernameExists = users.some(u => u.username === updatedUser.username && u.username !== currentUsername);
        if (usernameExists) {
            return res.status(400).json({ message: 'El nuevo nombre de usuario ya está en uso' });
        }

        // Actualizar el usuario
        users[userIndex] = { ...users[userIndex], ...updatedUser };

        // Guardar el archivo actualizado
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar los cambios:', err);
                return res.status(500).json({ message: 'Error al guardar los cambios' });
            }

            res.json({ message: 'Usuario actualizado con éxito' });
        });
    });
});
// Leer el archivo JSON de voluntariados
const readVolunteerData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'voluntariados.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

app.post('/send-certificate', (req, res) => {
    const { volunteerName, volunteerEmail, volunteerType } = req.body;

    if (!volunteerEmail) {
        return res.status(400).json({ success: false, message: 'Correo electrónico es obligatorio' });
    }

    // Contenido del certificado en HTML
    const certificateHTML = `
        <div style="font-family: Arial, sans-serif; text-align: center; border: 2px solid #000; padding: 20px; width: 80%; margin: auto;">
            <h1 style="color: #4CAF50;">Certificado de Voluntariado</h1>
            <p>Por medio del presente, se certifica que:</p>
            <h2>${volunteerName}</h2>
            <p>Ha participado activamente en un voluntariado de tipo:</p>
            <h3>${volunteerType}</h3>
            <p>¡Gracias por su esfuerzo y dedicación!</p>
        </div>
    `;

    // Configuración del correo
    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: volunteerEmail,
        subject: 'Certificado de Voluntariado',
        html: certificateHTML
    };

    // Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ success: false, message: 'Error al enviar el certificado' });
        } else {
            console.log('Correo enviado: ' + info.response);
            res.status(200).json({ success: true, message: 'Certificado enviado con éxito' });
        }
    });
});

// Endpoint para generar el certificado y enviar el correo
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
