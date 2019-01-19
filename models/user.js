let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    forename: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    surname: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
});

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    let user = this;
    bcrypt.hash(user.password, 'my salt', (err, hash) =>{
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

let User = mongoose.model("User", userSchema);
module.exports = User;