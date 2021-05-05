const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');


router.get('/notes/:userId', (req, res) => {
    const {userId} = req.params;

    res.render('homePage', {userId});
})

router.post('/notes/:userId', async (req, res) => {
    // to add a new note
    // res.send("working ");
    const {userId} = req.params;
    // res.send(userId);
    const { title, note} = req.body;
    let d = new Date();
    const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
    const time = `${d.getHours()}:${d.getMinutes()}`;
    const newNote = new Note({title: title, body: note, lastActivityDate: date, lastActivityTime: time})
    await newNote.save();
    const newNoteId = newNote._id;
    // res.send(newNoteId);
    const user = await User.findById(userId);
    // console.log(user);
    user.notes.push(newNote);
    await user.save();
    res.redirect(`/notes/${userId}`);
})

module.exports = router;