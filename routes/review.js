const express = require('express');
const router = express.Router({ mergeParams: true});


const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');  

const Campground = require('../models/campgrounds');
const Review = require('../models/reviews.js');
const { reviewSchema } = require('../schemas.js')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Review posted successfully');
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.get('/', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    res.redirect(`/campgrounds/${camp._id}/reviews`, { camp });
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;