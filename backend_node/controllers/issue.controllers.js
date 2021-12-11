import issueRepository from '../../backend_node/repositories/issue.repository.js'
import jwt from 'jsonwebtoken'

async function join(req, res) {
    let issue = req.params.issue
    let data = await issueRepository.getIssue(issue)
    if (data == null) {
        data = {
            status: 'joining',
            members: [],
        }
    }

    let newMember = {
        id: data.members.length + 1,
        name: req.body.name,
        status: 'waiting',
    }
    data.members.push(newMember)
    await issueRepository.setIssue(issue, data)

    let token = await generateToken(issue, newMember.id)

    return res.json({ ...newMember, token })
}

async function generateToken(issue, userId) {
    return new Promise(function (resolve, reject) {
        jwt.sign(
            { issue, userId },
            process.env.SECRET,
            { expiresIn: '1d' },
            (error, token) => {
                if (error) {
                    reject(error)
                }
                resolve(token)
            }
        )
    })
}

function vote(req, res) {
    return res.json({ messaje: 'vote' })
}

async function status(req, res) {
    let data = await issueRepository.getIssue(req.params.issue)
    if (data == null) {
        return res.json({ messaje: 'issue does not exist' })
    }
    return res.json(await issueRepository.getIssue(req.params.issue))
}

export default { join, vote, status }
