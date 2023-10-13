const Campground = require("../models/campgrounds");
const campControllers = {};
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { cloudinary, storage } = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


campControllers.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground });
};

campControllers.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

campControllers.createNewCamp = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const newCamp = new Campground(req.body.campground);
    console.log(req.body);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.image = req.files.map(file => ({ url: file.path, filename: file.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp);
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
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.image.push(...imgs);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    await campground.save();
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