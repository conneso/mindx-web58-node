const express = require('express')
const morgan = require('morgan')
    // const swaggerUi = require('swagger-ui-express')
    // const swaggerDocument = require('./swagger.json')
const path = require('path')
const rfs = require('rotating-file-stream')
const config = require('./config/config.json')

const port = config.port
var app = express()

//json formater
app.use(express.json())

//khai bao ket noi toi file log
var accessLogStream = rfs.createStream('user-api-access.log', {
    interval: '1d', //rolling daily
    path: path.join(__dirname, 'log')
})

//khai bao logger
app.use(morgan('common', { stream: accessLogStream }))

//#region khai bao routing
app.use('/', (err, req, res, next) => {
    if (err) throw err
    next()
})

const artistRouter = require('./routes/artist')
const artworkRouter = require('./routes/artwork')
const userRouter = require('./routes/users')

app.use('/api/artists', artistRouter)
app.use('/api/artworks', artworkRouter)
app.use('/api/users', userRouter)
    //#endregion
    // app.use('/docs',
    //     swaggerUi.serve,
    //     swaggerUi.setup(swaggerDocument)
    // );
    // require('./swagger-setup')(app);
const database = require('./DAL/database')
const mindx_web58 = new database()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

    mindx_web58.connect().then((err, result) => {
        if (err) throw err
        console.log('connect to mongodb is successfully')
    })
})