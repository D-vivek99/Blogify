const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/logo-m.png',
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],    // this means the value for role has to be one of these two, otherwise mongoose will throw an error.
        default: "USER",
    }
}, {timestamps: true});


// Mongoose middleware - pre()
userSchema.pre('save', function (next){     // can't use arrow function here, because of this keyword that is used here
    const user = this;

    // if given paths are not modified, then end it there or throw some error
    if(!user.isModified("password")) return;

    // else we will be cryption the password, i.e salt & pepper hashing
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    // console.log(hashedPassword);

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    //Fetching from DB
    const salt = user.salt;
    const hashedPassword = user.password;

    // since actual password is not stored anywhere, so to verify the password, we will be hashing the password provided by user with the same salt (fetched from DB) and comparing this with correct hashedPassword(from DB) with user provided hashed password.
    const userProvidedHash = createHmac("sha256", salt).update(password).digest('hex');

    if(hashedPassword !== userProvidedHash) throw new Error("Incorrect Password");

    const token = createTokenForUser(user);
    return token;
});

const User = model('user', userSchema);
module.exports = User;