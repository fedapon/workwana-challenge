import express from 'express'
import issueRoutes from '../backend_node/routes/issue.routes.js'
import dotenv from 'dotenv'

dotenv.config()

const port = process.env.PORT | 8082

const app = express()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/issue', issueRoutes)

app.listen(port, () => {
    console.log(`Backend node listen in port ${port}`)
})
