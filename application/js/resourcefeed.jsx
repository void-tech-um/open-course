import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import '../static/css/style.css';
import Resource from "./resource";

export default function ResourceFeed() {
    const [posts, setPosts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [morePosts, setMorePosts] = useState(false);
    const [url, setUrl] = useState("/api/v1/posts/");
    const [booleanFetch, setBooleanFetch] = useState(true);
    const [titleEntry, setTitleEntry] = useState("");
    const [textEntry, setTextEntry] = useState("");
    const [course_code, setCourseCode] = useState("");



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
    }, []); 

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

    const handleTitleChange = (event) => {
        setTitleEntry(event.target.value);
    };
    const handleTextChange = (event) => {
        setTextEntry(event.target.value);
    };
    const handleCourseChange = (event) => {
        setCourseCode(event.target.value);
    };    
    const handlePostSubmit = (event) => {
        event.preventDefault();

        fetch('/api/v1/posts/', {
            method: "POST",
            credentials: "same-origin",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            //body: JSON.stringify({ title: titleEntry, description: textEntry, course_code : course_code, schedule_link:schedule_link,type :true, tags : []}),
            body: JSON.stringify({ title: titleEntry, description: textEntry, course_code : course_code, schedule_link:schedule_link, location: location, type :true, tags : []}),
          })
            .then((response) => {
              if (!response.ok) throw Error(response.statusText);
              return response.json();
            })
            .then((data) => {
              setPosts([data["post_id"], ...posts, ]);

            })
            .catch((error) => console.log(error));
        setTitleEntry("");
        setTextEntry("");
        setScheduleLink("");
        setLocation("");
        setCourseCode("Select Course");
    };

    return (
        <div>
            {/* <form className="new-post" onSubmit={handlePostSubmit}>
                <div className="new-post--pfp-container">
                    <img src="/static/assets/logo.png" className="new-post--pfp" alt="pfp"></img>
                </div>
                <input type="text" name="enterTitle" className="new-post--title" placeholder="Enter Title" value={titleEntry} onChange={handleTitleChange} />
                <input type="text" name="tellMore" className="new-post--desc" value={textEntry} onChange={handleTextChange}  placeholder="Tell me more about your study group..." />
                <div className="input__bottom">
                    <div className="input__filters">
                        <button className="transparent-button"><img src="/static/assets/upload.svg" alt="upload filter"></img>Upload</button>
                        <button type="button" className="input__popUp-button"><img src="/static/assets/tags.svg" alt="tags filter"></img><p className="input__text--button">Tags</p></button>
                        <select className="custom-select" onChange={handleCourseChange} value={course_code}>
                            <option value="" selected>Select Course</option>
                            {courses.map((courses) => (
                                <option value = {courses.course_code}  className="info-tag tag-spacing" type="button">{courses.course_code}</option>
                            ))}
                        </select>                    
                    </div>     
                    <input className="input__submit" type="submit" name="Post" id="submit-post" value="Post"/>   
                </div>
            </form> */}
            <form className="new-post" onSubmit={handlePostSubmit}>
                <div className="new-post--pfp-container">
                    <img src="/static/assets/logo.png" className="new-post--pfp" alt="pfp"></img>
                </div>
                <input type="text" name="enterTitle" className="new-post--title" placeholder="Enter Title to create your own study group" value={titleEntry} onChange={handleTitleChange} />
                <textarea type="text" rows="10" name="tellMore" className="new-post--desc" value={textEntry} onChange={handleTextChange}  placeholder="Tell me more about your study group..." />
                <div className="input__bottom">
                    <div className="input__filters">
                        <button className="transparent-button"><img src="/static/assets/upload.svg" alt="upload filter"></img>Upload</button>
                        <button type="button" className="input__popUp-button"><img src="/static/assets/tags.svg" alt="tags filter"></img><p className="input__text--button">Tags</p></button>
                        <select className="custom-select" onChange={handleCourseChange} value={course_code}>
                            <option value="" selected>Select Course</option>
                            {courses.map((courses) => (
                                <option value = {courses.course_code}  className="info-tag tag-spacing" type="button">{courses.course_code}</option>
                            ))}
                        </select>                    
                    </div>     
                    <input className="input__submit" type="submit" name="Post" id="submit-post" value="Post"/>   
                </div>
            </form>
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
            <div className="posts-container">
                <div className="feed-container">
                    <Resource></Resource>
                    <Resource></Resource>
                    <Resource></Resource>
                    <Resource></Resource>
                </div>
            </div>

        </div>
    );
}
