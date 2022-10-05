const http = require('http')
const app = require('./app')

const { PORT } = require('./constants')

http.createServer(app).listen(PORT,'0.0.0.0', () => {
    console.info(`Backend Server is running on ${PORT}..`)
})