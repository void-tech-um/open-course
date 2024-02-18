import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";

// STUDY GROUP POST COMPONENT

export default function Post(props) {
const { postid } = props;

const [post, setPost] = useState([]);
const [postHasRendered, setPostHasRendered] = useState(false);

useEffect(() => {
    let ignoreStaleRequest = false;
    const postURL = `/api/v1/posts/${JSON.stringify(postid)}/`;
    fetch(postURL, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    })
    .then((response) => {
        // do error handling
        if (!response.ok) {
        console.log("error");
        throw Error(response.statusText);
        }
        return response.json();
    })
    .then((json) => {
        const utcDate = moment.utc(json.created).toDate();
        const local = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
        return {
        postShowUrl: json.postShowUrl,
        imgUrl: json.imgUrl,
        created: moment(local).fromNow(),
        owner: json.owner,
        };
    })
    .then((postInfo) => {
        setPost(postInfo);
        setPostHasRendered(true);
    })
    .catch((error) => {
        console.log(error);
    });
    return () => {
    // This is a cleanup function that runs whenever the Post component
    // unmounts or re-renders. If a Post is about to unmount or re-render, we
    // should avoid updating state.
    ignoreStaleRequest = true;
    };
}, []);

const handleSubmit = (event) => {
    event.preventDefault();
    setInputVal("");
};

const handleChange = (event) => {
    setInputVal(event.target.value);
};

if (postHasRendered) {
    return (
    <div>
        <h1>Post Title</h1>
    </div>
    );
}
return <div>Loading...</div>;
}

Post.propTypes = {
postid: PropTypes.number.isRequired,
};