import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import '../static/css/style.css';

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

//if (postHasRendered) {
    return (
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
        <div class = "post-border">
            <div class="user-info profile-right">
                <div class="circle"></div>
                <input class="star" type="checkbox" title="bookmark page" checked/> 
                <p class="user_name">Username </p>
                <p class="email">UmichEmail</p>
            </div>
            <div class = "tags profile-right">
                <button class = "info-tag" type = "button">Topic</button>
                <button class = "info-tag tag-spacing" type = "button">Topic</button>
                <button class = "info-tag tag-spacing" type = "button">Topic</button>
                <button class = "info-tag tag-spacing" type = "button">Topic</button>
            </div>
            <div class = "post-info profile-right">
                <p class = "study-group">STUDY GROUP</p>
                <h1>TITLE</h1>
                <p class = "brief-descript">Brief Description</p>
                <p class = "date-room"><i class="far fa-calendar"></i> Date</p>
                <p class = "post-time-address align-with-icon">time</p>
                <p class = "add-to-calendar align-with-icon">Add to calendar</p>
                <p><i class = "date-room material-icons">location_on</i>Room</p>
                <p class = "post-time-address align-with-icon">Address</p>
            </div>
            <div class = "join-section profile-right">
                <h2 class = "join-button">Join</h2>
            </div>

        </div>
    </div>
    );
//}
return <div>Loading...</div>;
}

Post.propTypes = {
postid: PropTypes.number.isRequired,
};