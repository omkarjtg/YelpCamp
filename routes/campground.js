const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/CatchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const {index, renderNewForm, createNewCamp, showCampground, renderEditForm, editCamp, deleteCamp} = require('../controllers/campgrounds');


router.get('/', catchAsync(index));

router.get('/new', isLoggedIn, (renderNewForm));

router.post('/', isLoggedIn, validateCampground, catchAsync(createNewCamp));

router.get('/:id', catchAsync(showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(editCamp));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCamp));

module.exports = router;