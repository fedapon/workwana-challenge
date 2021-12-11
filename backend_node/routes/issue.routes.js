import express from "express"
import issueControllers from "../../backend_node/controllers/issue.controllers.js"

const issueRoutes = express.Router()

issueRoutes.post("/:issue/join", issueControllers.join)

issueRoutes.post("/:issue/vote", issueControllers.vote)

issueRoutes.get("/:issue", issueControllers.status)

export default issueRoutes
