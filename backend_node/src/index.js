import { httpServer } from './services/http.service.js'
import { socketService } from './services/socket.service.js'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT | 8082

//http API service
httpServer.listen(port, () => {
    console.log(`Backend node listen in port ${port}`)
})

//realtime socket service
socketService(httpServer)
