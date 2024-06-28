const Joi = require('joi');

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    age: Joi.number().integer().min(18).required(),
    city: Joi.string().required(),
    zipCode: Joi.string().regex(/^\d{5,6}$/).required(),
    password: Joi.string().required(),
});

const userIdSchema = Joi.object({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/), // mongoDB ObjectId format
});

const validateUser = (user) => {
    return userSchema.validate(user);
};

const validateUserId = (req, res, next) => {
    const { error } = userIdSchema.validate({ userId: req.params.userId });
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

module.exports = {
    validateUser,
    validateUserId,
};
