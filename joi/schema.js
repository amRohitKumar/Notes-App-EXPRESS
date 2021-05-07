const Joi = require('joi');

module.exports.notesSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(25)
        .required(),
    body: Joi.string(),
})

module.exports.usersSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .required(),
    emailId: Joi.string()
        .email()
        .required(),
})