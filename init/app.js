const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust")
}

main().then(() => {
    console.log("Connected to database WanderLust!");
}).catch((err) => {
    console.log(err);
})

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: '6841b058943c9d7d1ef1286f'}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized.")
}

initDB();