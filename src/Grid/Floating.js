import { NavLink } from "react-router-dom";
import React from "react";

import "./Grid_Style.css";

const Floating = (props)=>{
    const {gap, title,context,genre_list,videos,season,status} = props;

    let my_style={
        left: gap.gap_in_right > 400 ? "100%" : "-100%",
        top:gap.gap_in_bottom > 350 ? "15%" : "-15%"
    };

    const render_genres = ()=>!!genre_list ? genre_list.map((v,i)=>i === genre_list.length - 1 ? <div>{v}.</div>: <div>{v}</div>) : "N.A.";
    const render_navs = ()=>{
        return(
            <div className="flex_1_box">
                <NavLink 
                    to={`/watch?title=${decodeURIComponent(title)}&season=${decodeURIComponent(season)}`} 
                    className="nav_link center_box flex_1_box"
                >Watch</NavLink>
            </div>
        )
    }
    
    return (
        <div className="floating column_box" style={my_style}>
            <div className="title">{title}</div>
            <div className="context">{context ?? "N.A."}</div>
            <div className="other wrap_box" key={1}>Status: <div>{!!status ? status : "N.A."}</div></div>
            <div className="other wrap_box"key={2}>Season: <div>{season}</div></div>
            <div className="other wrap_box"key={3}>Episodes: <div>{videos?.length}</div></div>
            <div className="other wrap_box"key={4}>Genre: {render_genres()}</div>
            {render_navs()}
        </div>
    )
}

export default Floating;