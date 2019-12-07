const express = require('express')
const postsRouter = require('./routers/posts')
const idRouter = require('./routers/id')

const port = 8080
const host = '127.0.0.1'
const app = express()

app.use(express.json())
app.use('/', postsRouter)
app.use('/api/posts', idRouter)


app.listen(port, host, () => {
    console.log(`server running at http://${host}:${port}`)
})

