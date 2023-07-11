const mongoose = require("mongoose");



const PostsSchema = new mongoose.Schema(
  {
   
    name: {
        type: String,
      },
      createdAt:{
        type:String
    },
    content: {
      type: String,
      required:[true,"please add some contents"],
    },
    likes: [{
        name:{
            type:String,

        },  
        createdAt:{
            type:String,
        }

    }],
    comments: [
        {
        name:{
            type:String,

        },  content:{
            type:String,

        },
        createdAt:{
            type:String,
        }
    }
],
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}
  },
  {
    timestamps: true,
  }
);


const Posts= mongoose.model("Posts", PostsSchema);

module.exports=Posts;