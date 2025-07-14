import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./route/Userroute.js";
import cors from "cors";


dotenv.config();
const app = express()

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const URL = "mongodb://localhost:27017/football-backend";

try {
    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to mongo")
} catch (error) {
    console.log("Error: ",error);
}

app.use("/user",userRoute)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
});