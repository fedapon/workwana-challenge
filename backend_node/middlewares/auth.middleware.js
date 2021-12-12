import jwt from 'jsonwebtoken'

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization
    if (authHeader == undefined) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    const bearerToken = authHeader.split(" ")[1]
    try {
        const payload = await verifyJwt(bearerToken)
        req.body.issue = payload.issue
        req.body.id = payload.id
        return next()
    } catch (error) {
        return res.status(403).json({ messaje: "Forbidden", error: error.message })
    }
}

async function verifyJwt(token) {
    return new Promise(function (resolve, reject) {
        jwt.verify(
            token,
            process.env.SECRET,
            (error, authData) => {
                if (error) {
                    reject(error)
                }
                resolve(authData)
            }
        )
    })
}

export {authMiddleware, verifyJwt}