import issueRepository from "../../backend_node/repositories/issue.repository.js"

async function join(req, res) {
    let data = await issueRepository.getIssue(req.params.issue)
    if (data == null) {
        data = {
            status: "joining",
            members: [],
        }
    }

    let newMember = {
        name: req.body.name,
        status: "waiting",
    }
    data.members.push(newMember)
    await issueRepository.setIssue(req.params.issue, data)

    return res.json(data)
}

function vote(req, res) {
    return res.json({ messaje: "vote" })
}

async function status(req, res) {
    let data = await issueRepository.getIssue(req.params.issue)
    if (data == null) {
        return res.json({ messaje: "issue does not exist" })
    }
    return res.json(await issueRepository.getIssue(req.params.issue))
}

export default { join, vote, status }
