import React, { useState, useEffect } from "react";
import '../static/css/style.css';

export default function PopUp({handleClose, handleChange, scheduleLink, placeHolderText, children}) {

    return (
        <div 
            className="time-popup"
            onClick={(e) => {
                if(e.target.className === "time-popup" ){
                    handleClose();
                }
            }}
        >
            <div className="time-popup-elements">
                <div className="new-time-box">
                    <div className="time-title">
                        {children}
                    </div>
                    <div className="time-input">
                        <input type="text" className="enterTitle" id="enter-time" placeholder={placeHolderText} value={scheduleLink} onChange={handleChange} autoFocus/>
                        <input className="time-rounded-blue-button" type="submit" name="Post" id="submit-post" value="Submit" onClick={handleClose}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
