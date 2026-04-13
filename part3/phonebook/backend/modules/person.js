import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
    .connect(url, { family: 4 })
    .then((result) => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB", error.message);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String || Number,
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Person", personSchema);
