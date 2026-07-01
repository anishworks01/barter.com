const mongoose = require ("mongoose");
const initData = require("./data.js")
const Listing = require ("../models/listing.js")
const mongo_url = 'mongodb://127.0.0.1:27017/barter'
async function main(){
    await mongoose.connect(mongo_url)
}
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
    
})
async function main(){
    await mongoose.connect(mongo_url)
}
const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner : "6a3ee8b8e15036e9e8ad4d8c"}))
    await Listing.insertMany(initData.data)
    console.log("DB Initialized with sample data in it");
}
initDB();