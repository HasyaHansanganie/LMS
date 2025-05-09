import React from "react";
import defaultLogo from "../default_logo.svg";

const MyProfile = ({img, })=>{
    return (
        <div className="shadow mt-4">
            <div className="d-flex justify-content-between align-content-center p-5">
                <div>
                    <img src={img || defaultLogo} alt="Profile" className="rounded-circle" style={{height: "15%"}}/>
                    <ul>
                        <li></li>
                    </ul>
                </div>
            </div>
            <p>Hi</p>
        </div>
    );
    
};

export default MyProfile;