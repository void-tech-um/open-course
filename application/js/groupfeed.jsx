import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import '../static/css/style.css';
import Post from "./post";

export default function GroupFeed() {
    const [posts, setPosts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [morePosts, setMorePosts] = useState(false);
    const [url, setUrl] = useState("/api/v1/posts/");
    const [booleanFetch, setBooleanFetch] = useState(true);

    useEffect(() => {
        fetch('/api/v1/courses/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
            .then((json) => {
            const fetchedCourses = json.courses;
            setCourses(fetchedCourses);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []); // Empty dependency array means this effect runs once on mount

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
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then((json) => {
            if (!ignoreStaleRequest) {
                setBooleanFetch(false);
            }

            const postsToRender = json.results.map(({ post_id }) => post_id);
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
                        {/* {courses.map((courses) => (
                            <option className="info-tag tag-spacing" type="button">{courses[0]}</option>
                        ))} */}
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
                    <option value="" selected>Group Type</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
                <select className="filter-select">
                    <option value="" selected>Location</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                </select>
                <select className="filter-select">
                    <option value="" selected>Time</option>
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
            <InfiniteScroll className="feed-container"
                    dataLength={posts.length}
                    next={() => setBooleanFetch(true)}
                    loader={<h6> </h6>}
                    hasMore={morePosts}
                    endMessage={
                    <p>Check back later for more posts!</p>
                    }
                >
                    {posts.map((post_id) => (
                        
                        <Post key={post_id} post_id={post_id} />
                    ))}
                </InfiniteScroll>
        </div>
    );
}