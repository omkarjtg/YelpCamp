const campgrounds = require("./models/campgrounds");
const Review = require('./models/reviews');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = 'pk.eyJ1Ijoib21rYXJqdGciLCJhIjoiY2xubjF1ODI2MDFtejJsbzZudDVqanI3ciJ9.t0zeFGyJpuEBjmCQ8XMGEQ';
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need to be logged in');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await campgrounds.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    };
};

module.exports.getCoordinates = async function (locationQuery) {
    try {

        const geoData = await geocoder.forwardGeocode({
            query: locationQuery,
            limit: 1
        }).send();

        if (geoData && geoData.body && geoData.body.features && geoData.body.features.length > 0) {
            const coordinates = geoData.body.features[0].geometry.coordinates;
            return {
                type: 'Point',
                coordinates: [coordinates[0], coordinates[1]]
            };
        } else {
            throw new Error('Location not found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}

