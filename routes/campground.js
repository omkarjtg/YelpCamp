const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/CatchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const { index, renderNewForm, createNewCamp, showCampground, renderEditForm, editCamp, deleteCamp } = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(index));

router.get('/new', isLoggedIn, (renderNewForm));

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(createNewCamp));


router.get('/:id', catchAsync(showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(editCamp));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCamp));

module.exports = router;