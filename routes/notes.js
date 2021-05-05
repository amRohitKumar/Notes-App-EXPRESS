const express = require('express');
const router = express.Router();
const Note = require('../models/note');


router.get('/notes/:userId', (req, res) => {
    const {userId} = req.params;

    res.render('homePage', {userId});
})

router.post('/notes/:userId', async (req, res) => {
    const {userId} = req.params;
    const { title, note} = req.body;
    let d = new Date();
    const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
    const time = `${d.getHours()}:${d.getMinutes()}`;
    const newNote = new Note({title: title, body: note, lastActivityDate: date, lastActivityTime: time})
    await newNote.save();
    res.redirect(`/notes/${userId}`);
})

module.exports = router;