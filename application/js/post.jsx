import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import '../static/css/style.css';

// STUDY GROUP POST COMPONENT

export default function Post(props) {
    const { post_id } = props;
    const [post, setPost] = useState([]);
    const [postHasRendered, setPostHasRendered] = useState(false);
    useEffect(() => {
        let ignoreStaleRequest = false;
        const postURL = `/api/v1/posts/${post_id}`;
        fetch(postURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                // do error handling

                if (!response.ok) {
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
                    post_id: post_id,
                    imgUrl: json.imgUrl,
                    username: json.username,
                    email: json.email,
                    title: json.title,
                    description: json.description,
                    course_code: json.course_code,
                    schedule_link: json.schedule_link,
                    type: json.type,
                    tags: json.tags,
                    location: json.location
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
            <div className="post-border">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
                <div className="profile-right">
                    <div className="profile-info circle">
                        <img src="/static/assets/logo.png" alt="pfp" className="circle"></img>
                        <div>
                            <p className="user-name">{post.username} </p>
                            <p className="email">{post.email}</p>
                        </div>
                        <input className="star" type="checkbox" title="bookmark page" checked />
                    </div>
                </div>
                <div className="profile-right">
                    {post.tags.map((tag) => (
                        <button className="info-tag tag-spacing" type="button">{tag.tag_name}</button>
                    ))}
                </div>
                <div className="profile-right">
                    <p className="study-group">STUDY GROUP</p>
                    <h1>{post.title}</h1>
                    <p className="study-group">{post.course_code}</p>
                    <p className="brief-descript">{post.description}</p>
                    <p className="date-room"><i className="far fa-calendar"></i> Date</p>
                    <p className="post-time-address align-with-icon">{post.schedule_link}</p>
                    <p className="date-room"><i className="material-icons"></i>Room</p>
                    <p className="post-time-address align-with-icon">{post.location}</p>
                </div>
                <div className="join-section">
                    <h2 className="rounded-blue-button">Join</h2>
                </div>
            </div>

        );
    }
    Post.propTypes = {
        post_id: PropTypes.number,
    }
};
