const UserDAL = require('mongoose')

main().then(res => {
    console.log('connect to mongodb is successfully')
}).catch(err => {
    throw err;
});

async function main() {
    await UserDAL.connect('mongodb://localhost:27017/mindx_web58');
}

module.exports = UserDAL