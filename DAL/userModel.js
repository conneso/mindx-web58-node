const userSchema = require('./userSchema')
const userDAL = require('./userDAL')

const UserModel = userDAL.model('users', userSchema)

module.exports = UserModel