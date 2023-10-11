const express = require('express');
const router = express.Router({ mergeParams: true});


const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');  
const { validateReview, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/reviews');



router.post('/', validateReview, catchAsync(createReview));


router.delete('/:reviewId', isReviewAuthor, catchAsync(deleteReview));

module.exports = router;