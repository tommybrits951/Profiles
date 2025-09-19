
function checkFields(req, res, next) {
    const {first_name, last_name, dob, postal, email, password} = req.body;
    if (!first_name || !last_name || !dob || !postal || !email || !password) {
        return res.status(400).json({message: "All fields required."})
    }
    let first = first_name.split("")
    first[0] = first[0].toUpperCase()
    let temp = ""
    for (let i = 0; i < first.length; i++) {
        temp += first[i]
    }
    req.body.first_name = temp
    temp = ""
    let last = last_name.split("")
    last[0] = last[0].toUpperCase()
    for (let i = 0; i < last.length; i++) {
        temp += last[i]
    }
    req.body.last_name = temp
    next()    
}


module.exports = checkFields