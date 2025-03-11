import mongoose from "mongoose";

// making sure the usernames and emails are unique
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true, select: false, minlength: 6 }, // atleast 6 characters
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model("user", userSchema);