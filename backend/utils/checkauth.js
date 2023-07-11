const jwt = require('jsonwebtoken');
//const { AuthenticationError } = require('apollo-server-express');
const { GraphQLError } = require('graphql');


module.exports = (context) => {
    const authHeader = context.req?.headers.authorization;
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try{
                const user = jwt.verify(token, process.env.JWT_SECRET);
                console.log('Authorization sucessful : userid=',user.id);
                return user;
            } catch (err) {
                throw new GraphQLError('invalid token',{
                    extentions: {
                    code: 'BAD_USER_INPUT',
                    }
                    })

            }
        }
        throw new Error('Authentication token must be Bearer');
    }
    throw new Error('Authentication header must be provided');
};