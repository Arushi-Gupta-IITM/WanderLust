const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateListing} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.index)) //new route
.post(isLoggedIn, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.create)); //create route


//new route
router.get("/new", isLoggedIn, listingController.new);

router.route("/:id")
.get(wrapAsync(listingController.show)) //show route
.delete(isLoggedIn, isOwner,  wrapAsync(listingController.delete)); //delete route

router.route("/:id/edit")
.get(isLoggedIn, isOwner, wrapAsync(listingController.edit)) //edit route
.put(isLoggedIn, isOwner, upload.single('listing[image][url]'), validateListing, wrapAsync(listingController.update)); //update route

router.route("/searchByCategory/:category")
.get(isLoggedIn, wrapAsync(listingController.showFilteredListings));

module.exports = router;

 //index route
// router.get("/", wrapAsync(listingController.index));

//show route
//router.get("/:id", wrapAsync(listingController.show));

//create route
//router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.create));

//edit route
//router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

//update route
//router.put("/:id/edit", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.update));

//delete route
//router.delete("/:id", isLoggedIn, isOwner,  wrapAsync(listingController.delete));

