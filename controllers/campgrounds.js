const Campground = require("../models/campgrounds");
const campControllers = {};


campControllers.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground });
};

campControllers.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

campControllers.createNewCamp =async (req, res) => {
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Added a campground successfully');
    res.redirect(`/campgrounds/${newCamp._id}`);
};

campControllers.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, id });
};

campControllers.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

campControllers.editCamp = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    req.flash('success', 'Updated the campground successfully');
    res.redirect(`/campgrounds/${campground._id}`);
};

campControllers.deleteCamp = async (req, res) => {
    const { id } = req.params;
    const deletedCamground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted the campground successfully');
    res.redirect('/campgrounds');
};

module.exports = campControllers;