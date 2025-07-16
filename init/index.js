const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((item)=>({...item,owner:"68568e958f9e965f025bb325"})); // Set a default owner for all listings
  // console.log("data was deleted");
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();