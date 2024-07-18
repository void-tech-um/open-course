import React, {useState, useEffect } from "react";
import '../static/css/filterpopup.css';

export default function FilterPopUp({handleClose}){

    const [filter,setFilter]=useState([]);

    const [bgColor,setBgColor]=useState("white");
    const [color,setColor]=useState("#045BC0");
    
    const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

    const group=["Open Invite","Closed Invite"];

    const locations=["East Hall","Mason Hall","Angell Hall","CCCB","Shapiro"]; //Dummy Data

    const removeFilter = (index) =>{
        setFilter(filter.filter((_, i) => i !== index));
    }

    const filterOption = filter.map((filter,key)=>
        <div key={key} className="filterButton">{filter}<span style={{color:"black", fontWeight:"bold", backgroundColor:"white",}} onClick={()=>removeFilter(key)}> X </span></div>
    )

    const buttonHover = (event) => {
        event.target.style.backgroundColor = "#045BC0";
        event.target.style.color="white";
    }

    const buttonLeave = (event) => {
        event.target.style.backgroundColor = "white";
        event.target.style.color="black";
    }

    const handleClickButton = (event) =>{
        setFilter((prev)=>[...prev,event.target.textContent]);
        console.log("clicked");
    }

    const daysOption = days.map((day,key)=>
        <button key={key} className="dayButton" onMouseEnter={buttonHover} onClick={handleClickButton}
    onMouseLeave={buttonLeave}>{day}</button>
    )

    const locationsOption = locations.map((location,key)=>
        <button key={key} className="dayButton" onMouseEnter={buttonHover} onClick={handleClickButton}
    onMouseLeave={buttonLeave}>{location}</button>
    )

    const groupOption = group.map((group,key)=>
        <button key={key} className="dayButton" onMouseEnter={buttonHover} onClick={handleClickButton}
    onMouseLeave={buttonLeave}>{group}</button>
    )
    
    return(
        <>
            <div className="filter-popup">
                <div className="filter-popup-elements">
                    <div id="title">SELECTED FILTER</div>
                        <div className="filterSearch">
                            {filterOption}
                        </div>
                    <div className="groupType">
                        <p>Group Type</p>
                        {groupOption }
                    </div>
                    <div className="location">
                        <div>
                            <div className="search">
                                <p>Location</p>
                                <input
                                    className="searchBar"
                                    type="text"
                                    placeholder="Search here"
                                />
                            </div>
                            <div className="days">
                                {locationsOption}
                            </div>
                        </div>
                    </div>
                    <div className="day">
                        <div>
                            <p>Day of the Week</p>
                            <div className="days">
                                {daysOption}
                            </div>
                        </div>
                    </div>
                    <div className="closeHolder">
                        <button className="close" onClick={handleClose} onMouseEnter={buttonHover} onMouseLeave={buttonLeave}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
}