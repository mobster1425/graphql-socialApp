const { GraphQLError } = require('graphql');
const checkAuth=require('../../utils/checkauth.js');
const Post=require('../../models/postModel.js');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    Mutation: {
        createComment: async (_, { postId, content }, context) => {
            const { name } = checkAuth(context);
            console.log("name=",name);

            if (content.trim() === "") {
            throw new GraphQLError('empty comment',{
                extentions: {
                code: 'BAD_USER_INPUT',
                }
                });
            }

            const post = await Post.findById({_id:postId});
            if (post) {
                post.comments.unshift({
                    content,
                    name,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found', {
                    errors: {
                        body: 'Post not found'
                    }
                });
            }
        },
        /*
        deleteComment: async (_, { postId, commentId }, context) => {
          //  const { name } = context.user;
          const { name } = checkAuth(context);
          console.log("name=",name);
            const post = await Post.findById({_id:postId});
console.log(`post to delete comment from is ${post}`);
            if (post) {
                const commentIndex = post.comments.findIndex(comment => comment._id === commentId);
                console.log("comment index =", commentIndex);
                console.log("comment =", post.comments[commentIndex]);
                console.log("comment name =", post.comments[commentIndex].name);

                if(post.comments[commentIndex].name === name) {
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                   // return post;
                   return 'Post deleted successfully';
                } else  {throw new GraphQLError('you cant delete this comment',{
                    extentions: {
                    code: 'BAD_USER_INPUT',
                    }
                    });}
            } else throw new GraphQLError('post not found',{
                extentions: {
                code: 'BAD_USER_INPUT',
                }
                });
        },
        */
         deleteComment : async (_, { postId, commentId }, context) => {
         
        
            const { name } = checkAuth(context);
  
            try {
              const post = await Post.findById(postId);
              
              if (!post) {
                throw new GraphQLError('Post not found', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                  },
                });
              }
              
              const commentIdObj = ObjectId(commentId); // Convert commentId to ObjectId
              
              const commentIndex = post.comments.findIndex(comment => comment._id.equals(commentIdObj));
              
              if (commentIndex === -1) {
                throw new GraphQLError('Comment not found', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                  },
                });
              }
              
              const comment = post.comments[commentIndex];
              
              if (comment.name !== name) {
                throw new GraphQLError('You cannot delete this comment', {
                  extensions: {
                    code: 'BAD_USER_INPUT',
                  },
                });
              }
              
              post.comments.splice(commentIndex, 1);
              await post.save();
              
              return post;
            } catch (error) {
              console.error("deleteing comment error is",error);
              throw new GraphQLError('An error occurred while deleting the comment', {
                extensions: {
                  code: 'INTERNAL_SERVER_ERROR',
                  exception: {
                    message: error.message,
                  },
                },
              });
            }
        
        
        
        },
        likePost: async (_, { postId }, context) => {
            //const name = context.user.name;
            const { name } = checkAuth(context);
            console.log("name=",name);
            const post = await Post.findById({_id:postId});
console.log(`post is ${post}`);
            if (post) {
                /*
                if (post.likes.find(like => like.name === name)) {
                    post.likes = post.likes.filter(like => like.name !== name);
                } else {
                    post.likes.push({
                        name,
                        createdAt: new Date().toISOString()
                    })
                }
                */
                post.likes.unshift({
                   
                    name,
                    createdAt: new Date().toISOString()
                });
                await post.save();
                context.pubSub.publish('NEW_LIKE', {
                    newLike: post,
                });
                return post;
            } else throw new GraphQLError('Post not found',{
                extentions: {
                code: 'BAD_USER_INPUT',
                }
                });
        }
    },
    
        Subscription: {
            newLike: {
                subscribe: (_,__,{pubSub}) => pubSub.asyncIterator('NEW_LIKE')
            }
    }
}