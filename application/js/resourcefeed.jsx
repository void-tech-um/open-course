import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import '../static/css/style.css';
import Resource from "./resource";

export default function ResourceFeed() {
    const [posts, setPosts] = useState([]);
    const [morePosts, setMorePosts] = useState(false);
    const [url, setUrl] = useState("/api/v1/posts/");
    const [booleanFetch, setBooleanFetch] = useState(true);

    useEffect(() => {
        let ignoreStaleRequest = false;
        if (!booleanFetch) {
            return () => {
                ignoreStaleRequest = true;
            };
        }
        fetch(url, {
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
                if (!ignoreStaleRequest) {
                    setBooleanFetch(false);
                }
                const postsToRender = json.results.map(({ postid }) => postid);
                setPosts(posts.concat(postsToRender));

                if (json.next !== "") {
                    setUrl(json.next);
                    setMorePosts(true);
                } else {
                    setUrl("");
                    setMorePosts(false);
                }
                return postsToRender;
            })
            .catch((error) => {
                console.log(error);
            });
        return () => {
            ignoreStaleRequest = true;
        };
    }, [booleanFetch, url, posts]);

    return (
        <div>
            <div className="new-post-box">
                <img src="/static/assets/logo.png" id="pfp" alt="pfp"></img>
                <input name="enterTitle" id="enter-title" placeholder="Enter Title" />
                <textarea name="tellMore" id="tell-me-more" placeholder="Tell me more about your resource post..." />
                <div className="filters">
                    <button className="transparent-button"><img src="/static/assets/upload.svg" alt="upload filter"></img>Upload</button>
                    <button className="transparent-button"><img src="/static/assets/tags.svg" alt="tags filter"></img>Tags</button>
                    <select className="custom-select">
                        <option value="" selected>Select Course</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                    <button className="rounded-blue-button">Post</button>
                </div>
            </div>
            <hr></hr> {/* Horiztonal Line */}
            <div className="search-content">
                <input type="text" id="search" name="search" placeholder="Search Posts, Classes..." />
                <select className="filter-select">
                    <option value="" selected>All Filters</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
                <select className="filter-select">
                    <option value="" selected>Material Type</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
                <select className="filter-select">
                    <option value="" selected>Class</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
            </div>
            <div className="feed-container">
                <Resource></Resource>
                <Resource></Resource>
                <Resource></Resource>
                <Resource></Resource>
            </div>
        </div>
    );
}
