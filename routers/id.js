const express = require('express')
const db = require('../data/db')

const router = express.Router()

router.get('/:id', (req, res) => {
    let id = req.params.id
    db.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            }
            res.status(200).json(post)
        }) 
        .catch(err => res.status(500).json({ error: 'The post information could not be retieved.'}))
})

router.get('/:id/comments', (req, res) => {
    let id = req.params.id
    db.findPostComments(id)
        .then(comments => {
            if (!comments) {
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            }
            res.status(200).json(comments)
        })
        .catch(err => res.status(500).json({ error: 'The comments information could not be retrieved.'}))
})

router.post('/:id/comments', (req, res) => {
    const { text, post_id } = req.body
    if (!text) {
        res.status(400).json({ errorMessage: 'Please provide text for the comment.'})
    }
    db.insertComment({ text, post_id })
        .then(id => {
            if (!id) {
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            }
            db.findCommentById(id.id)
                .then(comment => res.status(200).json(comment))
        })
        .catch(err => res.status(500).json({ error: 'There was an error while saving the comment to the database'}))
})

router.put('/:id', (req, res) => {
    let id = req.params.id
    const { title, contents } = req.body

    if (!title || !contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.'})
    }
    db.update(id, { title, contents })
        .then(updated => {
            if (updated === 0) {
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            }
            db.findById(id)
                .then(post => {
                    if (!post) {
                        res.status(404).json({ message: 'The post with the specified ID does not exist.'})
                    }
                    res.status(200).json(post)
                }) 
                .catch(err => res.status(500).json({ error: 'The post information could not be retieved.'}))
        })
        .catch(err => res.status(500).json({ error: 'The post information could not be modified.'}))
})

router.delete('/:id', (req, res) => {
    let id = req.params.id
    let postToBeDeleted = db.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            }
            res.status(200).json(post)
        }) 
        .catch(err => res.status(500).json({ error: 'The post information could not be retieved.'}))
    
    db.remove(id)
        .then(deleted => {
            if (deleted === 0) {
                res.status(404).json({ message: 'The post with the specified ID does not exist.'})
            } 
            res.status(200).json(postToBeDeleted)
        })
        .catch(err => res.status(500).json({ error: 'The post could not be removed'}))
})

module.exports = router