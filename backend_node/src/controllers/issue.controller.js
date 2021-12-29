import issueRepository from '../repositories/issue.repository.js'
import {
    generateToken,
    voteIsInvalid,
    getVoteAverage,
    hideNotAllowedInformationToUsers,
    emitUpdates
} from './issue.helpers.controller.js'

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

export default { join, vote, status }
