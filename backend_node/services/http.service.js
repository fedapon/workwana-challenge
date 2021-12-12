import express from 'express'
import cors from 'cors'
import http from 'http'
import issueRoutes from '../routes/issue.routes.js'

const app = express()
const httpServer = http.createServer(app)

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/issue', issueRoutes)

export {app, httpServer}