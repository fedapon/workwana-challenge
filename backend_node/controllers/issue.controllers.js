import issueRepositori from '../../backend_node/repositories/issue.repositories.js'
import issueRepositories from '../../backend_node/repositories/issue.repositories.js'

async function join (req, res) {
    let data = await issueRepositories.getIssue(req.params.issue)
    if (data == null) {
        data = {
            status : 'joining',
            members: []
        }
    }

    let newMember = {
        name: req.body.name,
        status: 'waiting'
    }
    data.members.push(newMember)
    await issueRepositories.setIssue(req.params.issue, data)
    
    res.json(data)
}

function vote (req, res) {
    res.json({messaje: 'vote'})
}

async function status (req, res) {
    res.json(await issueRepositori.getIssue(req.params.issue))
}

export default {join, vote, status}