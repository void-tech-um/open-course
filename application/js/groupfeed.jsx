import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import '../static/css/style.css';
import Post from "./post";

export default function GroupFeed() {
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
                <textarea name="tellMore" id="tell-me-more" placeholder="Tell me more about your study group..." />
                <div className="filters">
                    <button className="transparent-button"><img src="/static/assets/calendar-plus.svg" alt="calendar filter"></img>Meeting time</button>
                    <button className="transparent-button"><img src="/static/assets/location.svg" alt="location filter"></img>Location</button>
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
            <div className="feed-container">
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </div>
        {/* <InfiniteScroll
            dataLength={posts.length}
            // provide a fcn to be called to get the new posts
            next={() => setBooleanFetch(true)}
            loader={<h4>Loading...</h4>}
            morePosts={morePosts}
            endMessage={
            <p style={{ textAlign: "center" }}>
                <b>No More Posts Available</b>
            </p>
            }
        >
            <div>
            {posts.map((postid) => (
                <Post key={postid} postid={postid} />
            ))}
            </div>
        </InfiniteScroll> */}
        </div>
    );
}