const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje} = require('../utilidades/utilidades');

const usuarios = new Usuarios();


io.on('connect', (client) => {                     // Cuando alguien se conecta crea un cliente, io le asigna un id.

    client.on('entrarChat', (data, callback) => {  // El cliente estará a la escucha de entrarChat y recibirá el usuario que envia.

        if(!data.nombre || !data.sala){
            return callback({
                error:true,
                mensaje: 'El nombre/sala son necesarios'
            });
        }
        
        client.join(data.sala);                                                        // El cliente se conectara a la sala que se expecifique  

        usuarios.agregarPersona( client.id, data.nombre, data.sala);                   // Agregamos el usuario conectado a personas[]
        
        client.broadcast.to(data.sala).emit(                                           // Se emite el evento listaPersonas enviando las personas conectadas
            'listaPersonas', usuarios.getPersonasPorSala(data.sala));                  // hacia la sala en la que participa
                                                                                       
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje(           // Emitimos un crearMensaje para avisar que el fulano entro en el chat 
            'administrador',
            `${ data.nombre } se unió`
        ));    

        callback( usuarios.getPersonasPorSala(data.sala) );                            // Se ejecuta una función de respuesta al socket-chat con las personas
    });                                                                                // conectadas a una sala 

    client.on('disconnect', () => {                                                    // El cliente conectado estará a la escucha del evento disconnect

        let personaBorrada = usuarios.borrarPersona(client.id)                         // Borrará de personas[] el usuario que se desconecto
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje(    // y emitirá un evento 'crearMensaje' que enviará a socket-chat
            'administrador',                                                           // en la sala donde estaba conectado.
            `${personaBorrada.nombre} abandono el chat`                                // un mensaje sobre quien abandono el chat    
        ))
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala)); 
    })                                                                                 // Adicionalmente se emite de nuevo la lista de personas conectadas
                                                                                       // pero solo a la sala donde estaba conectado    


    client.on('crearMensaje', ( data, callback ) => {                           // Server escuchará el evento crearMensaje y recibirá la data
    
        let persona = usuarios.getPersona(client.id);                           // obtendremos el nombre de la persona 
        let mensaje = crearMensaje(persona.nombre, data.mensaje)                // construira el mensaje
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);        // y lo emitirá para todo los clientes que esten en la misma sala
        
        callback( mensaje );                                                    // Adicionalmente emitira este cb a socket-chat-jquery donde se emitio
    })

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id) 
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    })               //id de la persona objetivo
                    // socket.emit('mensajePrivado',{
                    // mensaje: 'Hola a Juan', para:'lsdfowperpoiskd'    
                    //})



});