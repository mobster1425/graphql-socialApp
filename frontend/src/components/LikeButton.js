import React from "react";
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Icon, Label, Popup } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { LIKE_POST } from "../utils/graphqlQueries";


export default function LikeButton ({ post: {id, likesCount, likes} }) {

    const [liked, setLiked] = useState(false);
    const { user } = useContext(AuthContext);

    const [likePost] = useMutation(LIKE_POST, {
        variables: {postId: id}
    });

    const likeButton = user ? (
        liked ? (<Button color="blue">
            <Icon name="heart" />
        </Button>) : (
        <Button color="blue" basic>
            <Icon name="heart" />
        </Button>
        )
    ) : (
        <Button color="blue" as={Link} to={'/login'} basic>
            <Icon name="heart" />
        </Button>
    );

    useEffect(() => {
        if (user && likes.find(like => like.name === user.name))
            setLiked(true);
        else
            setLiked(false);
    }, [user, likes]);   

    return (
        <Popup
            content="Like Post"
            trigger={
                <Button as="div" labelPosition="right" onClick={likePost}>
                    {likeButton}
                    <Label basic color="blue" pointing="left">
                        {likesCount}
                    </Label>
                </Button>
            }
        />
    )
};