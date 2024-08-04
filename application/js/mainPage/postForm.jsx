import React, { useState, useEffect } from "react";
import PopUp from "./popUp";

import '../../static/css/style.css';

export default function PostForm({type, courses, onPost, userInfo}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        tags:[],
        course: "",
        scheduleLink: "",
        type: type === "group" ? true : false
    })

    const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
    const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
    const [error, setError] = useState("");

    const handleChangePost = (data) =>{
      onPost(data);
    };

	  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleCloseTimePopup = () => {
      setIsTimePopupOpen(false);
    };
    const handleCloseLocationPopup = () => {
      setIsLocationPopupOpen(false);
    };
    
    const checkFormData = () => {
      if(!formData.title || !formData.description || !formData.location || formData.course == "Select Course" || !formData.scheduleLink){
        setError("Please fill out all fields.");
        return false;
      }
      return true;
    }

    const handlePostSubmit = async (event) => {
      event.preventDefault();
      if(!checkFormData()){
        return;
      }
      try {
          const response = await fetch('/api/v1/posts/', {
              method: "POST",
              credentials: "same-origin",
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
          });
  
          if (!response.ok) {
              throw new Error(response.statusText);
          }
  
          const data = await response.json();
          handleChangePost(data);
          setFormData({
              title: "",
              description: "",
              location: "",
              tags: [],
              course: "",
              scheduleLink: "",
              type: type,
          });
          setError("")
  
      } catch (error) {
          console.log(error);
      }
    };

    return (
        <div>
            <form className="new-post" onSubmit={handlePostSubmit}>
                <div className="new-post--pfp-container">
                    <img src={userInfo.profile_picture} className="new-post--pfp" alt="pfp"></img>
                </div>
                <input type="text" name="title" className="new-post--title" placeholder = "Enter Title to create your own study group" value={formData.title} onChange={handleChange} />
                <textarea type="text" rows="10" name="description" className="new-post--desc" value={formData.description} onChange={handleChange}  placeholder="Tell me more about your study group..." />
                <div className="input__bottom">
                    <div className="input__filters">
                        <button type="button" className="input__popUp-button" onClick={() =>setIsTimePopupOpen(true)}>
                            <img className="input_icon" src="/static/assets/calendar-plus.svg" alt="calendar filter"></img>
                            <p className="input__text--button">Meeting time</p>
                        </button>
                        {isTimePopupOpen && (
                            <PopUp 
                              handleClose = {handleCloseTimePopup} 
                              title = "Add a Google Calendar Link"
                              img = "/static/assets/calendar-plus.svg"
                              alt = "calendar filter"
                            >
                              <input type="text" name="scheduleLink" className="popup__input" placeholder="Google Meet URL"  value={formData.scheduleLink} onChange={handleChange} autoFocus/>
                              <input className="popup__blue-button" type="submit" name="Post" id="submit-post" value="Submit" onClick={handleCloseTimePopup}/>
                            </PopUp>
                        )}
                        <button type="button" className="input__popUp-button" onClick={() => setIsLocationPopupOpen(true)}>
                            <img src="/static/assets/location.svg" alt="location filter"></img>
                            <p className="input__text--button">Location</p>
                        </button>
                        {isLocationPopupOpen && (
                          <PopUp 
                            handleClose = {handleCloseLocationPopup} 
                            title = "Add Location and Room Number"
                            img = "/static/assets/location.svg"
                            alt = "location filter"
                          >
                            <input type="text" name="location" className="popup__input" placeholder="Add Location and Room Number"  value={formData.location} onChange={handleChange} autoFocus/>
                            <input className="popup__blue-button" type="submit" name="Post" id="submit-post" value="Submit" onClick={handleCloseLocationPopup}/>
                          </PopUp>                          
                        )}
                        <button type="button" className="input__popUp-button"><img src="/static/assets/tags.svg" alt="tags filter"></img><p className="input__text--button">Tags</p></button>
                        <select className="custom-select" name = "course" onChange={handleChange} value={formData.course}>
                            {courses.map((courses) => (
                                <option key ={courses.course_code} value = {courses.course_code}  className="info-tag tag-spacing" type="button">{courses.course_code}</option>
                            ))}
                        </select>                    
                    </div>     
                    <input className="input__submit" type="submit" name="Post" id="submit-post" value="Post"/>   
                </div>
            </form>
            {error !== "" && 
              <div className="input__error">
                <p>{error}</p>
              </div>
            }

        </div>
    );
}