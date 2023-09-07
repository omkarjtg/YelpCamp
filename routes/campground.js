const express = require('express');
const router = express.Router();    


const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgrounds');

const { campgroundSchema } = require('../schemas.js')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};


router.get('/', catchAsync(async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground });
}));

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Added a campground successfully');
    res.redirect(`/campgrounds/${newCamp._id}`);
}));

router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, id });
}));
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    req.flash('success', 'Updated the campground successfully');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCamground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted the campground successfully');
    res.redirect('/campgrounds');
}));

module.exports= router;