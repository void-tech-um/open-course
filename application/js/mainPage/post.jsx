import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import '../../static/css/style.css';

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
            <div className="post__border">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
                <div className="post__header">
                    <div className="post__header--left">
                        <img src="/static/assets/logo.png" alt="pfp" className="post__profile-pic"></img>
                        <div className="post__profile-info">
                            <p className="post__user-name">{post.username} </p>
                            <p className="post__email">{post.email}</p>
                        </div>
                    </div>
                    <div className="post__header--right">
                        <input className="post__star" type="checkbox" title="bookmark page"/>
                    </div>
                </div>
                <div className="post__tags">
                    {post.tags.map((tag) => (
                        <button className="info-tag tag-spacing" type="button">{tag.tag_name}</button>
                    ))}
                </div>
                <div className="post__info">
                    <p className="post__info--study-group">STUDY GROUP</p>
                    <div className="post__info--body">
                        <h1 className="post__info--title">{post.title}</h1>
                        <p className="post__info--code">{post.course_code}</p>
                        <p className="post__info--description">{post.description}</p>
                    </div>

                    <p className="post__info--date-room"><i className="far fa-calendar"></i> Date</p>
                    <p className="post__info--time-address">{post.schedule_link}</p>
                    <p className="post__info--date-room"><i className="fa fa-map-marker"></i> Room</p>
                    <p className="post__info--time-address">{post.location}</p>
                </div>
                <div className="post__join-section">
                    <h2 className="rounded-blue-button">Join</h2>
                </div>
            </div>

        );
    }
    Post.propTypes = {
        post_id: PropTypes.number,
    }
};
