const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware/middleware');
const asyncError = require('../utilities/asyncError');
const { notesSchema } = require('../joi/schema');
const ExpressError = require('../utilities/expressError');

router.get('/notes/:userId', isLoggedIn, asyncError(async (req, res) => {
    // home page logic

    const { userId } = req.params;
    const user = await User.findById(userId).populate('notes');
    res.render('homePage', { userId, user });
}))

router.post('/notes/:userId', isLoggedIn, asyncError(async (req, res) => {
    // to add a new note

    const { userId } = req.params;
    const { title, note } = req.body;

    let d = new Date();
    const date = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
    const time = `${d.getHours()}:${d.getMinutes()}`;

    const {error} = notesSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    }
    const newNote = new Note({ title: title, body: note, lastActivityDate: date, lastActivityTime: time })
    await newNote.save();
    const newNoteId = newNote._id;
    // res.send(newNoteId);
    const user = await User.findById(userId);
    // console.log(user);
    user.notes.push(newNote);
    await user.save();
    res.redirect(`/notes/${userId}`);
}))

module.exports = router;