import React, { useState, useEffect } from "react";
import '../../static/css/style.css';

export default function PopUp({handleClose, title, alt, img, children}) {

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
                        <h2 id="title">{title}</h2>
                        <img src={img} alt={alt} />

                    </div>
                    <div className="popup__input-container">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
