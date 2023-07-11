const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    minlength:3,
    maxlength:50,
    trim:true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      validate:{
        validator:validator.isEmail,
        message:'please provide a valid email',

      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength:6,
      select:false,
    },
    createdAt:{
        type:String
    }
  },
  {
    timestamps: true,
  }
);


UserSchema.pre('save', async function () {
    // console.log(this.modifiedPaths())
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })
  
  UserSchema.methods.createJWT = function () {
    return jwt.sign({ id:this._id,email:this.email,name:this.name,createdAt:new Date().toISOString() },
     process.env.JWT_SECRET, {
      expiresIn: '1d',
    })
  }
  
  UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
   // console.log(this.password);
    return isMatch
  }

const User= mongoose.model("User", UserSchema);

module.exports=User;