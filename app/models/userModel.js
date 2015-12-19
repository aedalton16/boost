// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    username            : {
        type : String,
        unique : true,
        required: true
    },
    password:{
        type     : String, //encrypt 
        unique: false,
        required: true
    },
    provider: String
    // for now only local
    // facebook         : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // },
    // twitter          : {
    //     id           : String,
    //     token        : String,
    //     displayName  : String,
    //     username     : String
    // },
    // google           : {
    //     id           : String,
    //     token        : String,
    //     email        : String,
    //     name         : String
    // }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// userSchema.virtual('password').set(function(password){

// })


userSchema
  .virtual('user_info')
  .get(function () {
    return { '_id': this._id, 'username': this.username };
  });

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
