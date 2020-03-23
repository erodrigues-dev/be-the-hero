const express = require('express')

const app = express()


app.get('/', (req, res) => {
    res.send({ text: 'Hello world!!' })
})

app.listen(3333)