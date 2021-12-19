import issueRepository from '../repositories/issue.repository.js'
import { socketIoServer } from '../services/socket.service.js'
import jwt from 'jsonwebtoken'

async function join(req, res) {
    let issueObj = await issueRepository.getIssue(req.params.issue)
    if (issueObj == null) {
        issueObj = {
            status: 'joining',
            members: []
        }
    }
    let newMember = {
        id: issueObj.members.length + 1,
        name: req.body.name,
        role: req.body.role,
        status: 'joined'
    }
    issueObj.members.push(newMember)

    let token = await generateToken(req.params.issue, newMember.id)
    await issueRepository.setIssue(req.params.issue, issueObj)
    emitUpdates(req.params.issue, issueObj)

    return res.json({ ...newMember, token })
}

async function generateToken(issue, id) {
    return new Promise(function (resolve, reject) {
        jwt.sign(
            { issue, id },
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

async function vote(req, res) {
    if (req.params.issue !== req.body.issue) {
        return res
            .status(403)
            .json({ messaje: 'token is not authorized for this room' })
    }

    let issueObj = await issueRepository.getIssue(req.params.issue)
    if (issueObj == null) {
        return res.status(404).json({ messaje: 'issue does not exist' })
    }
    const userIndex = issueObj.members.findIndex((member) => {
        return member.id == req.body.id
    })
    if (userIndex == null) {
        return res.status(404).json({ messaje: 'user joined to this issue' })
    }
    //moderator can change status but can not vote
    if (issueObj.members[userIndex].role === 'moderator') {
        if (req.body.value) {
            return res
                .status(400)
                .json({ messaje: 'moderator is not allowed to vote' })
        }
        issueObj.status = req.body.status
        await issueRepository.setIssue(req.params.issue, issueObj)
        emitUpdates(req.params.issue, issueObj)
        return res.json({ messaje: 'status succesfully changed' })
    }

    if (issueObj.status !== 'voting') {
        return res.status(403).json({
            messaje: 'you can not vote until moderator change status to voting'
        })
    }

    if (voteIsInvalid(req.body.value)) {
        return res.status(400).json({ messaje: 'invalid vote has been sent' })
    }

    const member = issueObj.members[userIndex]
    if (member.status === 'voted' || member.status === 'passed') {
        return res.status(403).json({
            messaje: 'vote rejected because you have already voted or passed'
        })
    }
    let newMemberData = { ...member }
    if (req.body.value == '?') {
        newMemberData.status = 'passed'
    } else {
        newMemberData.status = 'voted'
        newMemberData.value = req.body.value
    }
    issueObj.members.splice(userIndex, 1, newMemberData)

    await issueRepository.setIssue(req.params.issue, issueObj)
    emitUpdates(req.params.issue, issueObj)

    return res.json({ messaje: 'succesfull voted' })
}

function voteIsInvalid(vote) {
    const validVotes = [1, 2, 3, 5, 8, 13, 20, 40, '?']
    const userVote = validVotes.find((item) => {
        return item == vote
    })
    return userVote == undefined ? true : false
}

async function status(req, res) {
    let issueObj = await issueRepository.getIssue(req.params.issue)
    if (issueObj == null) {
        return res.json({ messaje: 'issue does not exist' })
    }
    if (issueObj.status == 'reveal') {
        issueObj.avg = getVoteAverage(issueObj)
        return res.json(issueObj)
    }
    return res.json(hideNotAllowedInformationToUsers(issueObj))
}

function getVoteAverage(issueObj) {
    let voters = 0
    const sum = issueObj.members.reduce((total, item) => {
        if (item.hasOwnProperty('value')) {
            voters++
            return total + parseInt(item.value)
        }
        return total
    }, 0)
    return sum / voters
}

function hideNotAllowedInformationToUsers(issueObj) {
    if (issueObj.status != 'reveal') {
        let filteredObj = { ...issueObj }
        for (let i = 0; i < filteredObj.members.length; i++) {
            delete filteredObj.members[i].value
        }
        return filteredObj
    }
    return { ...issueObj }
}

function emitUpdates(room, issueObj) {
    let emitData = hideNotAllowedInformationToUsers(issueObj)
    socketIoServer
        .to(`issue:${room}`)
        .emit('server:update', JSON.stringify(emitData))
}

export default { join, vote, status }
