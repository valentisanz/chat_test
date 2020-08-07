const socket = io.connect()
login()
socket.on('new_connection', (data) => {
    $("#msg_div").append(`<p>><b>${data.newUser} </b>se ha unido al chat!</p>`);

})
socket.on('left_connection', (data) => {
    $("#msg_div").append(`<p>><b>${data.userLeft} </b>se ha desconectado.</p>`);

})
socket.on('new_msg', (data) => {
    $("#msg_div").append(`<p><b>${data.username}: </b>${data.mensaje}</p>`);
    // $("#login_form").css('display', 'none');
    // $("#register_msg").append(`<p>Registrado como: <b>${data.newUser} </b></p>`);

})

function login() {
    username = prompt("Please enter your username: ");
    socket.emit('datos_usuario', { username })
}
function sendMsg() {
    mensaje = $('#msg_text').val()
    socket.emit('send_msg', { mensaje, username })
}