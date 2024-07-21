import React, { useState, useEffect } from "react";
import '../static/css/style.css';

export default function PopUp({handleClose, handleChange, inputValue, placeHolderText, children}) {

    return (
        <div 
            className="popup"
            onClick={(e) => {
                if(e.target.className === "popup" ){
                    handleClose();
                }
            }}
        >
            <div className="popup__box">
                <div className="popup__elements">
                    <div className="popup__title">
                        {children}
                    </div>
                    <div className="popup__input-container">
                        <input type="text" className="popup__input" placeholder={placeHolderText} value={inputValue} onChange={handleChange} autoFocus/>
                        <input className="popup__blue-button" type="submit" name="Post" id="submit-post" value="Submit" onClick={handleClose}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
