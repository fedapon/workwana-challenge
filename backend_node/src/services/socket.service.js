import { Server as socketIo } from 'socket.io'
import { verifyJwt } from '../middlewares/auth.middleware.js'

let socketIoServer
let socketClient

const socketService = (httpServer) => {
    const io = new socketIo(httpServer, {
        cors: 'localhost'
    })
    socketIoServer = io

    //handle new connection
    io.on('connection', (socket) => {
        socket = socket
        console.log(`New connection ID: ${socket.id}`)

        //handle issue joins
        socket.on('issue:join', async (data) => {
            try {
                const payload = await verifyJwt(data.token)
                if (payload.issue != undefined) {
                    console.log(
                        `Connection ID: ${socket.id} - User ID: ${payload.id} - Joined to: issue:${payload.issue}`
                    )
                    socket.join(`issue:${payload.issue}`)
                } else {
                    socket.disconnect()
                }
            } catch (error) {
                console.log(error.message)
                socket.disconnect()
            }
        })
    })
}

export { socketService, socketIoServer, socketClient }
