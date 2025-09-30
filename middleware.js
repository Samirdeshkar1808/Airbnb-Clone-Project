const Listing = require("./models/listing");
const review = require("./models/review");

const {listingSchema,reviewSchema } = require("./schema");//it is an object
const ExpressError = require("./utils/ExpressError")




module.exports.isLoggedIn = (req,res,next)=>{
     
    if(!req.isAuthenticated()){
    
     req.session.redirectUrl = req.originalUrl; //but passport isko delete kardega isliye hamne niche dusra middleware banaya.

     req.flash("error","Login required");
     return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
     
    if(req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
     
         //authorisation  route

         let {id} = req.params;

         let actualListing = await Listing.findById(id);

         if(!actualListing.owner._id.equals(res.locals.currUser._id)){

             req.flash("error","Acess Denied");

            return  res.redirect(`/listings/${id}`);
         }

         next();
}


module.exports.isReviewAuthor = async(req,res,next)=>{
     
         
         let {id,reviewId} = req.params;

         let actualreview = await review.findById(reviewId);

         if(!actualreview.author._id.equals(res.locals.currUser.id)){

             req.flash("error","Acess Denied");

            return  res.redirect(`/listings/${id}`);
         }

         next();
}

module.exports.validateListing = (req,res,next)=>{

    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}

module.exports.validateReview = (req,res,next)=>{

    let {error} = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
         throw new ExpressError(400,errMsg);
    }else{
        next();
    }

}