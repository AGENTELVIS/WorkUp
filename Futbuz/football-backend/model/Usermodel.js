import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: { 
        type: String,
        required: true,
    },
    email: {
        type: String ,
        required: true,
        unique: true,
        match: [/[^\s@ ]+@[^\s@]+\.[^\s@]+/, 'Invalid Email']
    },
    password: {
        type: String,
        required: true,
    },
    
});

const User = mongoose.model("User", userSchema);

export default User;

