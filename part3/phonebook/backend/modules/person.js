import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
    .connect(url, { family: 4 })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB", error.message);
    });

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: (v) => /^\d{2,3}-\d+$/.test(v),
            message: (props) => `${props.value} invalid number`,
        },
        required: true,
        minLength: 8,
    },
});

personSchema.set("toJSON", {
    transform: (returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default mongoose.model("Person", personSchema);
