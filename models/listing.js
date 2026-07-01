const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title :{
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        url: String,
        filename: String,
        // set : (v)=> v ==="" ? "https://img.magnific.com/free-vector/flat-design-no-photo-sign_23-2149272417.jpg?semt=ais_hybrid&w=740&q=80" : v
    },
    price : {
        type : Number,
        required : true
    },
    location: {
        type : String,
        required : true
    },
    country: {
        type: String,
        required: true
    },
    trade: {
        type: String,
        required : true
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;