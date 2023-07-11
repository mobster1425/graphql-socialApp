import { gql } from "@apollo/client";

export const GET_POSTS = gql`
{
    getPosts {
        id 
        content 
        name 
        createdAt
        comments {
            content
            id
        }
        likes {
            name
            id
        }
        likesCount
        commentsCount
    }
}
`;

export const GET_POST = gql`
    query GetPost ($postId: ID!) {
        getPost(postId: $postId) {
            id content name createdAt
            comments {
                content
                name
                id
            }
            likes {
                name
                id
            }
            likesCount
            commentsCount
        }
    }
`;

export const CREATE_POST = gql`
    mutation createPost ($content: String!) {
        createPost(content: $content) {
            id content createdAt name likesCount
            commentsCount
            comments {
                id name content createdAt
            }
            likes {
                id name createdAt
            }
        }
    }
`;

export const CREATE_COMMENT = gql`
    mutation CreateComment($postId: ID!, $content: String!) {
        createComment(postId: $postId, content: $content) {
            id
            commentsCount
            comments {
                id name createdAt content
            }
        }
    }
`;

export const DELETE_POST = gql`
    mutation deletePost ($postId: ID!) {
        deletePost(id: $postId)
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($postId: ID!, $commentId: ID!) {
        deleteComment(postId: $postId, commentId: $commentId) {
        id
        commentsCount
        comments{
            id name createdAt content
        }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation Login($email: String!, $password: String!) {
        login( email: $email password: $password ) {
            id email name createdAt token
        }
    }
`;

export const REGISTER_USER = gql`
    mutation Register ($name: String! $email: String! $password: String!) {
        register(
            registerInput: {
                name: $name
                email: $email
                password: $password
                
            }
        ) {
            id email name createdAt token
        }
    }
`;

export const LIKE_POST = gql`
    mutation Login($postId: ID!) {
        likePost(postId: $postId) {
            id
            likesCount
            likes {
                name
                id
            }
        }
    }
`;