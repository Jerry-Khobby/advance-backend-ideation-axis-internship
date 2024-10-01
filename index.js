const express= require("express");
const app= express();
const bodyParser= require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser= require("cookie-parser");
const dotenv = require("dotenv").config();
const setupSwagger = require("./docs/swagger");
const route= require("./routes/route");



// middle wares 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
  secret:"Your secret key",
  saveUnitialized:false,
  resave:false,
}))
app.use(cors());

app.use(express.json());
// route setup 
app.use(route);
// setup for swagger
setupSwagger(app);







const URI= process.env.MONGO_URI;
mongoose.connect(URI);
const database= mongoose.connection; 

database.on("error",(error)=>{
  console.error("MongooDb connection error",error);

})

database.once("open",()=>{
  console.log("Connected to the database successfully");
})

const port_number= process.env.PORT|| 5000;
app.listen(port_number,()=>{
  console.log(`The server is listening successfully on ${port_number}`);
})



