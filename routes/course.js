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
        include: [
            {
                model: User,
                attributes: { exclude: ['password', 'createdAt', 'updatedAt']}
            }
        ]
    });
    res.json(courses);
}));


// GET specific course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [
            {
                model: User,
            },
        ],
    });
    res.json(course);
}));

// POST (create) new course
//add try catch block after adding sequelize validation errors
// Add authentication middleware
router.post('/courses', asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.redirect(201, `/courses/${course.id}`);
}));

// PUT (update) a course
//add try catch block after adding sequelize validation errors
// Add authentication middleware
router.put('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.update(req.body);
        res.status(204);
    }
}));

// DELETE a course
// Add authentication middleware
router.delete('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy(req.body);
        res.status(204);
    }
}));

module.exports = router;