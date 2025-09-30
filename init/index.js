const mongoose = require("mongoose");
const initdata = require("./data.js");

const Listing = require("../models/listing.js");


//DB connection
async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

main()
 .then(()=>{
    console.log("connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 }) 

 const initDB = async()=>{
    await Listing.deleteMany(); //ye pehle ka pura sample data delete karega.

    initdata.data = initdata.data.map((obj)=> ({...obj, owner : "68d779299b41542da18e2a95"})) //ye demo account ki id hai.

     //iska matlab jo hamari original data ki file hai us file ke andar ke data ke array me ek object add kardo 
     // jiska naam owner hai aur jiski value : id hai.

    await Listing.insertMany(initdata.data);

    console.log("Data was initialised.")
 }

initDB();