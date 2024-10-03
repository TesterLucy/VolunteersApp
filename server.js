const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const port = 3000;

// Usar CORS para permitir peticiones de cualquier origen
app.use(cors());

app.use(express.json());

// Ruta para registro de usuarios
app.post('/register', (req, res) => {
    const newUser = req.body;
    const usersFile = './users.json';

    // Leer el archivo JSON de usuarios y verificar si ya existe el usuario
    fs.readFile(usersFile, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer archivo' });
        }

        const users = JSON.parse(data);
        const userExists = users.some(user => user.username === newUser.username || user.email === newUser.email);

        if (userExists) {
            return res.status(400).json({ message: 'Usuario ya registrado' });
        }

        // Agregar nuevo usuario al archivo JSON
        users.push(newUser);
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al guardar usuario' });
            }

            res.status(201).json({ message: 'Registro exitoso' });
        });
    });
});

// Ruta para login de usuarios
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const usersFile = './users.json';

    // Leer el archivo JSON de usuarios y verificar credenciales
    fs.readFile(usersFile, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error al leer archivo' });
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.username === username && user.password === password);

        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        res.json({ message: 'Inicio de sesión exitoso' });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
