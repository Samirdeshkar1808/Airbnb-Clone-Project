const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync")

const Listing = require("../models/listing");

const {isLoggedIn, isOwner,validateListing} = require("../middleware");

const listingController = require("../controllers/listings.js")

const multer = require("multer");

const {storage} = require("../cloudConfig.js")


const upload = multer({storage});


router.route("/")
   //Index route
  .get(wrapAsync(listingController.index)) 

   //create route (connected with new route)
  
   .post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));




//new route 
 router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")

  //show route
  .get(wrapAsync(listingController.showListing))

  //udate (connected with edit)

  .put(isLoggedIn,isOwner, upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))

  //delete route
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//Edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));


module.exports = router;