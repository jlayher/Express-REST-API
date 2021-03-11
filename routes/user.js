'use strict'

const express = require('express');

// require the User model
const { User } = require('../models');
// require middleware
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const router = express.Router();

// GET User (currently authenticated)
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {
    const users = await User.findAll({
        attributes: {
            exclude: [
                'password',
                'createdAt',
                'updatedAt'
            ]}
    })
    const { currentUser } = res.locals;
    let returnedUser;
    users.forEach(user => {
        if (user.id === currentUser.id) {
            returnedUser = user;
        }
    });
    res.json(returnedUser);
    //res.json(users);
}));

// POST create User
router.post('/users', asyncHandler( async (req, res) => {
    try {
        await User.create(req.body);
        res.redirect(201, '/');
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError'){
            const errors = err.errors.map(error=>error.message);
            res.status(400).json({ errors });
        } else {
            throw err;
        }
    }
}));

module.exports = router;