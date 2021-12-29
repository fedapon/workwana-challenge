import express from 'express'
import issueController from '../controllers/issue.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const issueRoutes = express.Router()

issueRoutes.post('/:issue/join', issueController.join)

issueRoutes.post('/:issue/vote', authMiddleware, issueController.vote)

issueRoutes.get('/:issue', issueController.status)

export default issueRoutes
