import express from 'express';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

// Random name
const adjectives = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'black', 'white'];
const nouns = ['cat', 'dog', 'bird', 'fish', 'rabbit', 'turtle', 'snake', 'hamster', 'lizard'];

// Array para almacenar nombres ya utilizados
const usedNames = [];

// Función para obtener un nombre aleatorio no utilizado
const getRandomName = () => {
    let name;
    do {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        name = `${adj}-${noun}`;
    } while (usedNames.includes(name));
    usedNames.push(name);
    return name;
}

// Obtener la hora actual en formato HH:MM
const getTime = () => {
    const date = new Date();
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
};

io.on('connection', socket => {
    console.log('Client connected', socket.id);

    // Obtener un nombre único para este cliente
    const name = getRandomName();

    // Enviar el nombre al cliente recién conectado
    socket.emit('assignName', name);

    socket.on('message', (body) => {
        console.log(body);
        // Almacena el mensaje en la base de datos

        // Envía el mensaje a todos los clientes
        socket.broadcast.emit('message', {
            body,
            from: name,
            time: getTime()
        });
    });
});

server.listen(4000);
console.log("Server on port", 4000);
