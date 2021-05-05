var socket = io();

let params = new URLSearchParams(window.location.search);   // Identificamos los params del url
if(!params.has('nombre') || !params.has('sala')){           // preguntamos si los params tienen el string 'nombre
    window.location = 'index.html';                         // Sino los tienen te redirige al index.html
    throw new Error('El nombre y sala son necesario')       // y lanza un error
}

let usuario = {                                             // Si tiene el nombre y la sala
    nombre: params.get('nombre'),                           // se asigna a usuario
    sala: params.get('sala')
}

socket.on('connect', function() {                           // Cuando un cliente se conecta (entra al localhost)
    console.log('Conectado al server');
    socket.emit('entrarChat',  usuario, (resp) => {         // El cliente emite un evento con el nombre del usuario y recibirá una respuesta
        console.log('Usuarios conectados: ', resp)          // La respuesta es generada por el server en este caso los usuarios conectados.
    })              
});

// Escuchar
socket.on('disconnect', function() {                        // El cliente se desconecta
    console.log('Perdimos conexión con el servidor');

});

// Enviar->Por consola
// socket.emit('crearMensaje',{
//     mensaje:
// 
// })

// Enviar por privado->Por consola
// socket.emit('crearMensaje',{
//     mensaje:,
//     para:
// })


socket.on('crearMensaje', ( mensaje ) => {                  // A la escucha de crearMensaje por parte del server
    console.log('Servidor: ', mensaje)                      // recibirá el mensaje de este.
});

socket.on('listaPersonas', ( personas ) => {                // A la escucha de listaPersonas por parte del server
    console.log( personas )                                 // recibirá la lista de personas conectadas.
});

socket.on('mensajePrivado', (mensaje) => {
    console.log('Mensaje Privado:', mensaje);
})
