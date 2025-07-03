const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.show = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");

    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.create = async (req, res, next) => {
        let listing = req.body.listing; 

        let responce = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
            })
            .send(); 
            
        console.log(responce.body.features[0].geometry);

        let url = req.file.path;
        let filename = req.file.filename;

        if(!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listings.")
        } 
        

        const newListing = new Listing ({
        title: listing.title,
        description: listing.description,
        image: {
            filename: filename,
            url: url
        },
        price: listing.price,
        country: listing.country,
        location: listing.location,
        category: listing.category
    });

    newListing.owner = req.user._id;
    newListing.geometry = responce.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_150,w_200");

    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.update = async (req, res) => {
    let {id} = req.params;
 

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {filename, url};
        await listing.save();
    }
   
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let {id} = req.params;
   
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    console.log(deletedListing);
    res.redirect("/listings")
}

module.exports.showFilteredListings = async(req, res) => {
    let {category} = req.params;
    const allListings = await Listing.find({category: category});
    res.render("listings/index.ejs", {allListings});
}