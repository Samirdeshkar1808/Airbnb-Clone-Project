const Listing = require("../models/listing")
const geocodeLocation = require('../utils/geocode');

module.exports.index = async (req,res)=>{
     
   const allListings =  await Listing.find({});

   res.render("listings/index",{allListings});  //hamne views ke andar listings wale folder me index.js rakha hai.
     
}


module.exports.renderNewForm = (req,res)=>{
    
     res.render("listings/new");
 }



module.exports.showListing = async(req,res)=>{
  
   let {id} = req.params;

 const specific = await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner").populate("latitude").populate("longitude");//.populate baad me samjhega. (phase 2)



  if(!specific){
    
    req.flash("error","listing does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show",{specific});
    
}


module.exports.createListing = async(req,res,next)=>{
    

   try{
    let url = req.file.path;

    let filename = req.file.filename;

    let listing = req.body.listing;

    const fullLocation = `${listing.location}, ${listing.country}`;
    const coords = await geocodeLocation(fullLocation);


    const newListing = new Listing(listing);

    newListing.owner = req.user._id;  
 
    newListing.image = {url , filename};

    newListing.latitude = coords.latitude;
    newListing.longitude = coords.longitude;

    await newListing.save();

    //flash
    req.flash("success","New listing Created!");

    res.redirect("/listings");
   }
   catch (err) {
  console.error("Error creating listing:", err);
  req.flash("error", "Something went wrong.");
  res.redirect("/listings/new");
}

   
}

module.exports.renderEditForm = async (req,res)=>{
    
     let {id} = req.params;

     const specific = await Listing.findById(id);
     if(!specific){
    
      req.flash("error","listing does not exist!");
      return res.redirect("/listings");
     }

     let originalImageUrl = specific.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250,h_300")  //height is 300 and width is 250


     res.render("listings/edit",{specific,originalImageUrl});
}


module.exports.updateListing = async(req,res)=>{
    
    let {id} = req.params;

   let listing = req.body.listing;

    let updatedListing = await Listing.findByIdAndUpdate(id,{...listing});

     if( req.file ){  //if req.file exist then only update image
      let url = req.file.path;

      let filename = req.file.filename;

      updatedListing.image = {url , filename};

      await updatedListing.save();

     }

     //update co-ordinates 

     const fullLocation = `${updatedListing.location}, ${updatedListing.country}`;
     const coords = await geocodeLocation(fullLocation);

      updatedListing.latitude = coords.latitude;
      updatedListing.longitude = coords.longitude;

      await updatedListing.save();

    req.flash("success","listing Updated!");

    res.redirect(`/listings/${id}`);

    
}


module.exports.destroyListing = async(req,res)=>{
     
    let {id} = req.params;

   let deletedlisting = await Listing.findByIdAndDelete(id);

   console.log(deletedlisting);

   req.flash("success","Listing is Deleted");

   res.redirect("/listings");
}