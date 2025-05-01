import React from "react"

import "./Footer_Style.css";

const Footer = (props)=>{
    return(
        <div className="footer">
            <div className="center_box">
                <div className="content">
                    <div className="img_container abs_box"></div>
                    <div className="tint abs_box"></div>
                    <div className="info_container abs_box">
                        <img className="brand" src={"./brandname.png"} alt="Brand Logo"/>
                        <div className="message">Copyright © hokoritv. All Rights Reserved </div>
                        <div className="message">This site does not store any information of user. All the content is provided by private source.</div>
                        <div className="help row_box">
                            Help
                            <button>About</button>
                            <button>Help Center</button>
                            <button>Privacy Policy</button>
                            <button>Terms of Use</button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;