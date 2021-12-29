import jwt from 'jsonwebtoken'
import { socketIoServer } from '../services/socket.service.js'

export async function generateToken(issue, id) {
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

export function voteIsInvalid(vote) {
    const validVotes = [1, 2, 3, 5, 8, 13, 20, 40, '?']
    const userVote = validVotes.find((item) => {
        return item == vote
    })
    return userVote == undefined ? true : false
}

export function getVoteAverage(issueObj) {
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

export function hideNotAllowedInformationToUsers(issueObj) {
    if (issueObj.status != 'reveal') {
        let filteredObj = { ...issueObj }
        for (let i = 0; i < filteredObj.members.length; i++) {
            delete filteredObj.members[i].value
        }
        return filteredObj
    }
    return { ...issueObj }
}

export function emitUpdates(room, issueObj) {
    let emitData = hideNotAllowedInformationToUsers(issueObj)
    socketIoServer
        .to(`issue:${room}`)
        .emit('server:update', JSON.stringify(emitData))
}
