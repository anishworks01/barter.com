const Listing = require("../models/listing")
const ExpressError = require("../utils/ExpressError")



module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
}

module.exports.renderNewForm = async (req,res)=>{
        res.render("listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(!listing){
        req.flash("error","Listing not found!")
        res.redirect("/listings")
    }
    res.render("listings/show.ejs",{listing})
}

module.exports.createListing = async(req,res,next)=>{
        if(!req.file){
            throw new ExpressError(400,"Image upload failed. Please select an image and try again.");
        }
        // Cloudinary storage versions return different field names, so support both
        // the newer multer path/filename fields and Cloudinary's url/public_id fields.
        let url = req.file.path || req.file.secure_url || req.file.url;
        let filename = req.file.filename || req.file.public_id;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename}
        await newListing.save();
        req.flash("success","Successfully new listing Created!")
        res.redirect("/listings")
    }

module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not found!")
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl})
}

module.exports.updateListing = async(req,res)=>{
    let {id}= req.params
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file  !=="undefined"){
    // Keep edit uploads compatible with both multer and Cloudinary response fields.
    let url = req.file.path || req.file.secure_url || req.file.url;
    let filename = req.file.filename || req.file.public_id;
    listing.image = {url, filename}
    await listing.save()
    }
    req.flash("success","Successfully updated listing!")
    res.redirect("/listings/"+id)
}

module.exports.destroyListing = async(req,res)=>{
    let {id}=req.params;
    let deletedlist=await Listing.findByIdAndDelete(id);
    req.flash("success","Successfully deleted listing!")
    res.redirect("/listings")
}
