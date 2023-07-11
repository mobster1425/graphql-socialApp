const postResolvers = require('./resolvers/posts.js');
const userResolvers = require('./resolvers/users.js');
const commentResolvers = require('./resolvers/comments.js');

module.exports = {
    Post: {
        likesCount: (parent) => parent.likes.length,
        commentsCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentResolvers.Mutation
    },
    Subscription: {
        ...postResolvers.Subscription,
        ...commentResolvers.Subscription
    }
}