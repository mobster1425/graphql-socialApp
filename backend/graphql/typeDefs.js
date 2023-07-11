const gql=require('graphql-tag');

module.exports=gql`
type Post {
    id: ID!
    content: String
    createdAt: String
    name: String
    comments: [Comment]!
    user:ID!
    likes: [Like]!
    likesCount: Int!
       commentsCount: Int!
}

type Comment {
    id: ID!
    name: String!
    content: String!
    createdAt: String!
}

type Like {
    id: ID!
    name: String!
    createdAt: String!
}

type User {
    id: ID!
    name: String!
    password: String
    token: String!
    email: String!
    createdAt: String
}

input RegisterInput {
    name: String!
    email: String!
    password: String!
   
}

type Query {
    getPosts: [Post]!,
    getPost(postId: ID!): Post
    getUsers: [User!]!
}

type Mutation {
    register(registerInput: RegisterInput): User!,
    login(email: String!, password: String!): User!,
    createPost( content: String!): Post!,
    deletePost(id: ID!): String!,
    createComment(postId: ID!, content: String!): Post!,
    deleteComment(postId: ID!, commentId: ID!): Post!,
    likePost(postId: ID!): Post!
}

type Subscription {
    newPost: Post!
    newLike:Post!
}
`








/*
const typeDefs=`
type User{
name: String!
email: String!
password:String
id:ID!

}

type Userdetail{
description: String!
link: String!
}



type AuthData{
user: User!
token: String!


}
type Like{
userid:ID!
postId: ID!

}
type Comment{
userId : ID!
postId: ID!
commentText: String!
CreatedAt : String!
}

type Post{
userId:ID!
title : String!
text: String!
comments:[Comment!]
likes:[Like!]
}

enum YesNo{
YES
NO
}


type Query{
getallposts:[Post!]
getpost(postid:ID!):Post
getuser:User
}

type mutation{
createpost(title:String!,
text:String!
):Post

deletepost(postid:ID! 
):String

register(
email:String!,
password:String!
):User

login(
email:String!,
password:String!):AuthData

createlike(postid:ID!):YesNo

createcomment(postid:ID!,
commenttext:String!):Comment

deletecomment(commentID:ID!,postID:ID!):String

createuserdetail(description:String!,
link:String!):Userdetail

updateuser(name:String
password:String):AuthData



},

type Subscription{
likes:Like!
addcomment:Comment!
deletecomment:Comment!
}
`

module.exports=typeDefs;
*/