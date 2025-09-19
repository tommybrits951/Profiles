
const User = require("../models/User")


const users = [{
  "first_name": "Tommy",
  "last_name": "Brits",
  "dob": "1986-07-14T00:00:00.000Z",
  "postal": 92553,
  "gender": "Male",
  "email": "tommybrits74@gmail.com",
  "password": "$2b$10$Rb.Evp3bAdzti16OZd47rODjXKpNFZs.BAttprHygEahlKTgNEUmK",
  "friends": [],
  "requests": [],
  "images": []
},
{
  "first_name": "Jackie",
  "last_name": "Cramer",
  "dob": "1987-09-22T00:00:00.000Z",
  "postal": 97878,
  "gender": "Female",
  "email": "jackie@jackie.com",
  "password": "$2b$10$gxb2APyC7/l55NoVKHdHQerzExBP9V3nZS7nrZQ7CbT9hx9ZlgJrG",
  "friends": [],
  "requests": [],
  "images": []
},
{
  "first_name": "Richard",
  "last_name": "Hennington",
  "dob": "1980-09-09T00:00:00.000Z",
  "postal": 89676,
  "gender": "Male",
  "email": "rich@rich.com",
  "password": "$2b$10$0.9jjbXsbrVLaT7K0JoDCeAyCy30DwbC/8tveHYp0JSpD8Hp33RBK",
  "friends": [],
  "requests": [],
  "images": []
},
{
  "first_name": "Kyle",
  "last_name": "Powers",
  "dob": "1986-07-11T00:00:00.000Z",
  "postal": 92553,
  "gender": "Male",
  "email": "kyle@kyle.com",
  "password": "$2b$10$7oND.WAVWVSvkZ8AuPB46OIIAwK4vfYbQ0VHSDV3MOgcGBDHAPl92",
  "friends": [],
  "requests": [],
  "images": []
},
{
  "first_name": "jenny",
  "last_name": "jenny",
  "dob": "1980-09-09T00:00:00.000Z",
  "postal": 92553,
  "gender": "Female",
  "email": "jenny@jenny.com",
  "password": "$2b$10$bNdUmeMkfteobfXf1latjOsz212GE79bHiFeVTKwXXab/QUVpZo3C",
  "friends": [],
  "requests": [],
  "images": []
},
{
  "first_name": "Todd",
  "last_name": "Ken",
  "dob": "1970-07-07T00:00:00.000Z",
  "postal": 92553,
  "gender": "Male",
  "email": "todd@todd.com",
  "password": "$2b$10$AIgbKc9gGpBesi7gv12fUuRNWXHF93eEXSIx/Qr19HJDRD0p4nCjq",
  "friends": [],
  "requests": [],
  "images": []
}]

async function insertUsers() {
try {
    let arr = []
    for (let i = 0; i < users.length; i++) {
        const user = new User({...users[i]})
         await user.save()
         arr.push(user)
    }
    console.log(arr)
} catch (err) {
    console.log(err)
}
}
module.exports = insertUsers