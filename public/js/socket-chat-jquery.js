//let params = new URLSearchParams(window.location.search);
let nombre = (new URLSearchParams(window.location.search)).get('nombre');
let sala = (new URLSearchParams(window.location.search)).get('sala');

// Referencias de JQuery

let divUsuarios = $('#divUsuarios');
let formEnviar = $('#formEnviar');  // Formulario de posteo de mensajes
let txtMensaje = $('#txtMensaje');  // Caja de texto de los mensajes - input
let divChatbox = $('#divChatbox');  // Renderización de los mensajes - chat

//Funciones para renderizar usuarios

const renderizarUsuarios = ( personas ) => { // [{},{},{}]
    console.log(personas);

    let html = '';

    html += '<li>';
    html +=     '<a href="javascript:void(0)" class="active"> Chat de <span>'+ params.get('sala') +' Juegos</span></a>';
    html += '</li>';

    for( let i=0; i<personas.length; i++){

    html += '<li>';
    html +=     '<a data-id="'+ personas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
    html += '</li>';
    
    }

    divUsuarios.html(html);

}

const renderizarMensajes = (mensaje, yo) => {

    let html ='';
    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();
    let adminClass = 'info';

    if( mensaje.nombre === 'Administrador'){
        adminClass = 'danger';
    }

    if( yo ){

        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ mensaje.nombre +'</h5>';
        html += '    <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';

    }else{
        html += '<li class="animated fadeIn">';

        //No queremos que aparezca la imagen del administrador al salir
        if (mensaje.nombre !== 'administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }

        html += '        <div class="chat-content">';
        html += '            <h5>'+ mensaje.nombre +'</h5>';
        html += '            <div class="box bg-light-'+adminClass+'">'+ mensaje.mensaje +'</div>';
        html += '        </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



// listeners

divUsuarios.on('click', 'a', () => {
               //a 
    let id = $(this).data('id');

    if(id){
        console.log(id);
    }
});

formEnviar.on('submit', (e) => {

    e.preventDefault();
    if(txtMensaje.val().trim().length === 0){
        return
    }

    socket.emit('crearMensaje', {                               // Aquí creamos el mensaje de form en el html
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, (mensaje) => {                                           // Recibe el callback del server con el mensaje enviado
        txtMensaje.val('').focus();                             // y lo igualamos a '' para vaciar el cuadro de texto
        renderizarMensajes(mensaje, true);                      // Por último renderizamos el mensaje enviado en el chat
        scrollBottom()                                          // establecemos el yo en true para decir que nosotros enviamos el mensaje
    });                                                         




});