function join (req, res) {
    res.json({messaje: 'join'})
}

function vote (req, res) {
    res.json({messaje: 'vote'})
}

function status (req, res) {
    res.json({messaje: 'status'})
}

export default {join, vote, status}