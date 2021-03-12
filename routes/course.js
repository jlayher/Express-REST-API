'use strict'

const express = require('express');

// require the Course and User models
const { Course, User } = require('../models');
// require middleware
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const router = express.Router();

// GET all courses
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [{
                model: User,
                attributes: { 
                    exclude: [
                        'password', 'createdAt', 'updatedAt'
                    ]}
        }],
        attributes: {
            exclude: [
                'password', 'createdAt', 'updatedAt'
            ]
        }
    });
    res.json(courses);
}));

// GET specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: {
                    exclude: [
                        'password', 'createdAt', 'updatedAt'
                    ]
                }
            },
        ],
        attributes: {
            exclude: [
                'password', 'createdAt', 'updatedAt'
            ]
        }
    });
    res.json(course);
}));

// POST (create) new course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).location(`/courses/${course.id}`).end();
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.map(err => err.message);
            res.status(400).json({errors});
        } else {
            throw err;
        }
    }
}));

// PUT (update) a course
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const currentUser = req.currentUser;
        //if (course) {
            if (course.userId === currentUser.id) {
                await course.update(req.body);
                res.status(204).end();
            } else {
                res.status(403).json( {'message': 'You do not have authorization to make changes to this course'})
            }
        //}
    } catch (error) {
        console.error(error);
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// DELETE a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        const currentUser = req.currentUser;
        if (course) {
            if(course.userId === currentUser.id) {
                await course.destroy(req.body);
                res.status(204).end();
            } else {
                res.status(403).json({ 'message': 'You do not have authorization to delete this course'});
            }
        }
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw err;
        }
    }
}));

module.exports = router;