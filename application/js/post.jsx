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
    // const postURL = `/api/v1/posts/${JSON.stringify(postid)}/`;
    const postURL = `/api/v1/posts/`;
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
        console.log("hello")
        const utcDate = moment.utc(json.created).toDate();
        const local = moment(utcDate).local().format("YYYY-MM-DD HH:mm:ss");
        return {
            postShowUrl: json.postShowUrl,
            imgUrl: json.imgUrl,
            created: moment(local).fromNow(),
            owner: json.owner,
            post_id: postid,
            imgUrl: json.imgUrl,
            username: json.owner,
            email:json.email,
            title: json.title,
            description: json.description,
            course_code: json.course_code,
            schedule_link: json.schedule_link,
            type: json.type,
            tags: json.tags            
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
        <div class = "post-border">
        <div class = "user-info">
            <p class = "user_name">{post.post_id}</p>
            <p class = "email">{post.email}</p>
            <input class="star" type="checkbox" title="bookmark page" checked/><br/>
        </div>
        <div class = "tags">
        {/* {post.tags.map((tag) =>{
                <button class = "info-tag" type = "button">tag.tag_name</button>
            })} */}

        </div>
        <div class = "post-info">
            <p class = "study-group">STUDY GROUP</p>
            <h1>post.title</h1>
            <p class = "brief-descript">post.description</p>
            <p>post.created</p>
            <p class = "label">json.created</p>
            <p class = "add-to-calendar">Add to calendar</p>
        </div>
        <div class = "join-section">
            <h2 class = "rounded-blue-button">Join</h2>
        </div>
    </div>        
    // <div class = "post-border">
    //     <div class = "user-info">
    //         <p class = "user_name">UserName</p>
    //         <p class = "email">UmichEmail</p>
    //         <input class="star" type="checkbox" title="bookmark page" checked/><br/>
    //     </div>
    //     <div class = "tags">
    //         <button class = "info-tag" type = "button">Tag</button>
    //         <button class = "info-tag" type = "button">Tag</button>
    //         <button class = "info-tag" type = "button">Tag</button>
    //         <button class = "info-tag" type = "button">Tag</button>
    //     </div>
    //     <div class = "post-info">
    //         <p class = "study-group">STUDY GROUP</p>
    //         <h1>TITLE</h1>
    //         <p class = "brief-descript">Brief Description</p>
    //         <p>Date</p>
    //         <p class = "label">time</p>
    //         <p class = "add-to-calendar">Add to calendar</p>
    //         <p>Room</p>
    //         <p>Address</p>
    //     </div>
    //     <div class = "join-section">
    //         <h2 class = "rounded-blue-button">Join</h2>
    //     </div>
    // </div>
    );
//}
return <div>Loading...</div>;
}

Post.propTypes = {
// postid: PropTypes.number.isRequired,
postid: PropTypes.number,

};