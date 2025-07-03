const Listing = require("./models/listing.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js"); 
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        //to save redirect url
        req.session.redirectURL = req.originalUrl;
        req.flash("error", "You must be logged in to WanderLust!");
        return res.redirect("/login");
    } else {
        next();
    }
    
}

module.exports.saveRedirectURL = (req, res, next) => {
    if(req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to make changes to the listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {

    let {error} = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
   
        if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to make changes to this review.");
        return res.redirect(`/listings/${id}`);
        } 
        next();
}