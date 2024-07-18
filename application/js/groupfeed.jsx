import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import '../static/css/style.css';
import Post from "./post";
import PopUp from "./popUp";
import FilterPopUp from "./filterPopUp";
import { createPortal } from "react-dom";
import moment from "moment";
import { Filter } from "lucide-static";


export default function GroupFeed() {
    const [posts, setPosts] = useState([]);
    const [courses, setCourses] = useState([]);
    const [morePosts, setMorePosts] = useState(false);
    const [url, setUrl] = useState("/api/v1/posts/");
    const [booleanFetch, setBooleanFetch] = useState(true);
    const [filters, setFilters] = useState([]);
    const [selected, setSelected] = useState([]);
    const [textEntry, setTextEntry] = useState("");
    const [titleEntry, setTitleEntry] = useState("");
    const [course_code, setCourseCode] = useState("");
    const [schedule_link, setScheduleLink] = useState("");
    const [location, setLocation] = useState("");
    const [tags, setTags] = useState("");
    const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
    const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
    const [isFilterPopOpen, setIsFilterPopOpen] = useState(false);
    const [meetLink, setMeetLink]=useState(""); //ADDED meetLink variable so that user can see an updated (typed) google calender link
    const [meetLocation,setMeetLocation]=useState(""); //Added meetLocation variable so that user can see an updated (typed) meeting location

    const handleSelectChange = (selectedList) => {
        setSelected(selectedList);
        console.log(selected);
    };  
  
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

    useEffect(() => {
        fetch('/api/v1/tags/', {
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
            const fetchedFilters = json.tags;
            setFilters(fetchedFilters);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);


    const handleTextChange = (event) => {
        setTextEntry(event.target.value);
    };
    const handleCourseChange = (event) => {
        setCourseCode(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitleEntry(event.target.value);
    };

    const handleScheduleChange = (event) => {
        setScheduleLink(event.target.value);
    };

    const handleLocatonChange = (event) => {
        setLocation(event.target.value);
        
    };

    const handleCloseTimePopup = () => {
        setIsTimePopupOpen(false);
        setMeetLink(schedule_link);
    };
    const handleCloseLocationPopup = () => {
        setIsLocationPopupOpen(false);
        setMeetLocation(location);
    };
    
    const handleCloseFilterPopup = () =>{
        setIsFilterPopOpen(false);
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
    // "username", "title", "description","course_code","schedule_link", "location", "type", "tags" 
    return (
        <>
        <div>
            <form className="new-post-box" onSubmit={handlePostSubmit}>
                <img src="/static/assets/logo.png" id="pfp" alt="pfp"></img>
                <input type="text" name="enterTitle" id="enter-title" placeholder="Enter Title" value={titleEntry} onChange={handleTitleChange} />
                <textarea name="tellMore" id="tell-me-more" value={textEntry} onChange={handleTextChange}  placeholder="Tell me more about your study group..." />
                <div className="filters">
                    <div>
                    <button type="button" className="transparent-button" onClick={() =>setIsTimePopupOpen(true)}><img src="/static/assets/calendar-plus.svg" alt="calendar filter"></img>Meeting time</button>
                    {isTimePopupOpen && (
                        <PopUp handleClose = {handleCloseTimePopup} handleChange = {handleScheduleChange} inputValue={schedule_link} placeHolderText="Google Meet URL">
                            {/* These two tags are being passed in as a prop called "children" */}
                            <h2 id="title">Add a Google Calendar Link</h2>
                            <img src="/static/assets/calendar-plus.svg" alt="calendar filter" />
                        </PopUp>
                    )}
                    <span className="info">{meetLink}</span>
                    </div>
                    <div>
                    <button type="button" className="transparent-button" onClick={() => setIsLocationPopupOpen(true)}><img src="/static/assets/location.svg" alt="location filter"></img>Location</button>
                    {isLocationPopupOpen && (
                        <PopUp handleClose = {handleCloseLocationPopup} handleChange = {handleLocatonChange} inputValue={location} placeHolderText="Add Location and Room Number">
                            {/* These two tags are being passed in as a prop called "children" */}
                            <h2 id="title">Add Location and Room Number</h2>
                            <img src="/static/assets/location.svg" alt="location filter" />
                        </PopUp>
                    )}
                    <span className="info">{meetLocation}</span>
                    </div>
                    <div>
                    <button type="button" className="transparent-button" onClick={()=>setIsFilterPopOpen(true)}><img src="/static/assets/tags.svg" alt="tags filter"></img>Tags</button>
                    {isFilterPopOpen && (
                        <FilterPopUp handleClose = {handleCloseFilterPopup}></FilterPopUp>
                    )}
                    <select className="custom-select" onChange={handleCourseChange} value={course_code}>
                        <option value="" selected>Select Course</option>
                        {courses.map((courses) => (
                            <option value = {courses.course_code}  className="info-tag tag-spacing" type="button">{courses.course_code}</option>
                        ))}
                    </select>
                    </div>
                    <div>
                        <input className="rounded-blue-button" type="submit" name="Post" id="submit-post" value="Post"/>
                    </div>
                </div>     
            </form>
            <hr></hr> {/* Horiztonal Line */}
            <div className="search-content">
                <input type="text" id="search" name="search" placeholder="Search Posts, Classes..." />
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
        </>
    );
}