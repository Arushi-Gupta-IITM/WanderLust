const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
    },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["Rooms", "Farms", "Camping", "Mountains", "Iconic-Cities", "Beaches", "Castle", "Arctic"],
        required: true
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;