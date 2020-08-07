const PORT = 3000
const express = require('express')
const app = express()
const http = require('http')

const server = http.createServer(app)
server.listen(PORT, () => console.log('Listening to port: ' + PORT + '...'))
app.use(express.static('public'))

const socketIo = require('socket.io')
const io = socketIo.listen(server)

//arrays personas conectadas
userOfId = new Array()
idsOfUser = new Array()

io.on('connect', (socket) => {
    console.log('Connection with id: ' + socket.id)

    socket.on('datos_usuario', (data) => {
        username = data.username
        id_socket = socket.id
        // guardando user por id
        userOfId[id_socket] = username

        // guardando id por user
        if (!idsOfUser[username]) {
            idsOfUser[username] = new Array()
        }
        idsOfUser[username].push(id_socket)
        console.log('<<<<USER OF ID>>>>')
        console.log(userOfId)
        console.log('<<<<IDS OF USER>>>>')
        console.log(idsOfUser)
        console.log(`USERS  ONLINE: ${Object.keys(idsOfUser).length}`)
        console.log()

        io.emit('new_connection', { newUser: username })
    })
    socket.on('send_msg', (data) => {
        // console.log(data)
        io.emit('new_msg', { username: data.username, mensaje: data.mensaje })
    })
    socket.on('disconnect', (data) => {
        id_user = socket.id
        if (userOfId[id_user]) {


            // cogemos el usuario que se desconecta y lo eliminamos de la lista de usersOfId
            usuario = userOfId[id_user]
            delete userOfId[id_user]

            // cogemos los ids del usuario que se desconecta
            array_ids = idsOfUser[usuario]
            for (let i = 0; i < array_ids.length; i++) {
                if (id_user === array_ids[i]) {
                    id_to_delete = i
                }

            }
            idsOfUser[usuario].splice(id_to_delete, 1)
            // si era la unica id del user borrem user
            if (idsOfUser[usuario].length < 1) {
                delete idsOfUser[usuario]
            }
            io.emit('left_connection', { userLeft: usuario })
            console.log(`USERS  ONLINE: ${Object.keys(idsOfUser).length}`)
        }
    })

})