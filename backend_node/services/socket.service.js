const socketIo = require('socket.io')

const socketConnection = (httpServer) => {
    const io = socketIo(httpServer);

    //handle new connection
    io.on('connection', (socket) => {
        console.log(`New connection ID: ${socket.id}`)
        
        //handle issue joins
        socket.on('issue:join', (data) => {
            console.log(`Connection ID: ${socket.id} - Joined to issue: ${data.issue}`)
            socket.join(data.issue)
        })

    })
}

export default socketConnection