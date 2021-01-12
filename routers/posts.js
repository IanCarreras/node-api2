const express = require('express')
const db = require('../data/db')

const router = express.Router()

router.get('/api/posts', (req, res) => {
    db.find()
        .then(posts => {
            res.json(posts)
        })
        .catch(err => {
            res.status(500).json({ error: 'The posts information could not be retrieved.'})
        })
})

router.post('/api/posts', (req, res) => {
    const { title, contents } = req.body
    const payload = {
        title,
        contents
    }

    if (!title || !contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    }

    db.insert(payload)
        .then(id => {
            db.findById(id.id)
                .then(post => res.status(201).json(post))
                .catch(err => res.status(500).json({ error: 'There was an error while atrieving the post'}))
        }) 
        .catch(err => {
            res.status(500).json({ error: 'There was an error while saving the post to the database'})
        })
})

module.exports = router