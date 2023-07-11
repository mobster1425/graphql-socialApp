const Post=require('../../models/postModel.js');
const { GraphQLError } = require('graphql');
const checkAuth=require('../../utils/checkauth.js');
//const { PubSub } = require('graphql-subscriptions');
const checkauth = require('../../utils/checkauth.js');
//const pubsub = new PubSub()

module.exports={
    Query:{
        getPosts:async ()=>{
          //  console.log("posts");
try{
  //  console.log('before posts came');
    const posts = await Post.find({}).sort({ createdAt: -1 });
   // return posts;
 //  console.log('after posts came');
  // console.log(`posts are ${posts}`);
  // return posts.map(post => post.toObject());
  return posts;
}catch(err){
    throw new Error(err);
}
        },
getPost:async(_,{postId})=>{

    try {
        const post = await Post.findById(postId);
        if (post) return post;
        else throw new Error('Post not found');
    } catch (error) {
        throw new Error(error);
    }
},
        },

        Mutation: {
            createPost: async (_, { content }, context) => {
                const user = checkAuth(context);
    try {
        console.log('before creating post');
   
                if (content.trim() === "") {
                    throw new Error('Post body must not be empty');
                }
                console.log('after trimming');
    const newPost=new Post({
                    user: user.id,
                name: user.name,
               
                    content,
                    createdAt: new Date().toISOString()
                });
                console.log('after newPost');
                const post = await newPost.save();
                console.log(`new post is ${post}`);
    
               context.pubSub.publish('NEW_POST', {
                    newPost: post,
                });
                return post;
            } catch (error) {
                console.log('Error creating post:', error);
                throw new GraphQLError('creating post failed',{
                extentions: {
                code: 'BAD_USER_INPUT',
                }
                })
            }
            },
            deletePost: async (_, { id }, context) => {
                const user = checkAuth(context);
    
                try{
                    const post = await Post.findById({_id:id,user:user.id});
                    if (user.name === post.name) {
                        await post.delete();
                        return 'Post deleted successfully';
                    } else {
                       // throw new AuthenticationError('Invalid Action');
                       throw new GraphQLError('invalid action',{
                        extentions: {
                        code: 'BAD_USER_INPUT',
                        }
                        })
                    }
                } catch (err) {
                    throw new Error(err);
                }
            }
        },
        Subscription: {
            newPost: {
                subscribe: (_,__,{pubSub}) => pubSub.asyncIterator('NEW_POST')
            }
    }
}