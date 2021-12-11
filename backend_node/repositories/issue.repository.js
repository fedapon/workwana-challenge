import redis from '../services/redis.service.js'

async function getIssue(issueNumber) {
    const issueObject = await redis.get(`issue:${issueNumber}`)
    return await JSON.parse(issueObject)
}

async function setIssue(issueNumber, issueObject) {
    await redis.set(
        `issue:${issueNumber}`,
        JSON.stringify(issueObject),
        'ex',
        3600
    )
}

export default { getIssue, setIssue }
