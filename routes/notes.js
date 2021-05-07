const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware/middleware');
const asyncError = require('../utilities/asyncError');
const {validateNote} = require('../middleware/middleware');
const ExpressError = require('../utilities/expressError');
const {date, time} = require('../utilities/dateAndTime');


router.get('/notes/:userId', isLoggedIn, asyncError(async (req, res) => {
    // home page logic

    const { userId } = req.params;
    const user = await User.findById(userId).populate('notes');
    res.render('homePage', { userId, user });
}))

router.post('/notes/:userId', isLoggedIn, validateNote ,asyncError(async (req, res) => {
    // to add a new note

    const { userId } = req.params;
    const { title, note } = req.body;

    const newNote = new Note({ title: title, body: note, lastActivityDate: date, lastActivityTime: time })
    await newNote.save();
    const newNoteId = newNote._id;
    // res.send(newNoteId);
    const user = await User.findById(userId);
    // console.log(user);
    user.notes.push(newNote);
    await user.save();
    req.flash('success', 'New note added successfully !');
    res.redirect(`/notes/${userId}`);
}))

module.exports = router;