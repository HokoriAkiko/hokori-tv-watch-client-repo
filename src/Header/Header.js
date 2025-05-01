import { NavLink, useNavigate } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";
import env from "react-dotenv";

import "./Header_Style.css";

const Serie = (props)=>{
    const {title,season} = props;
    const [thumbnail,set_thumbnail] = useState({fetching: true,url : ""});

    useEffect(()=>{
        const get_thumbnail = async ()=>{
            const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_thumbnail`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title,season})
            }).then(resp=>resp.json());
    
            if(!!result){ set_thumbnail({fetching : false, url : `${env.REACT_APP_STORAGE_URL}${result}`}) }
            else{set_thumbnail({fetching : false, url : ""}) }
        }
        get_thumbnail();
    },[])

    const render_thumbnail  = ()=>{
        if(thumbnail.fetching) return <div className="spinner center_box"><SpinnerCircular color="blue" speed={100} thickness={200}/></div>
        if(thumbnail.url) return <img src={thumbnail.url} alt="Thumbnail"/>
        return <div className="missing center_box">N.A.</div>
    }

    const render_info = ()=>{
        return(
            <div className="column_box flex_1_box">
                <div className="info text_overflow_box">{title}</div>
                <div className="info">S{season}</div>
            </div>
        )
    }

    return(
        <NavLink className="each row_box" to={`/watch?title=${encodeURIComponent(title)}&season=${encodeURIComponent(season)}`}>
            {render_thumbnail()}
            {render_info()}
        </NavLink>
    )
}

const Series = (props)=>{
    const {navigate} = props;
    const [list,set_list] = useState([]);
    const [title,set_title] = useState("");

    const view_all = ()=>navigate(`/filter?title=${encodeURIComponent(title)}`)

    useEffect(()=>{
        const get_list = async ()=>{
            try{
                const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_series`,{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body : JSON.stringify({title}),
                }).then(data=>data.json());
    
                set_list(result);
            }
            catch(e){console.log("Filtered Results Fetch Error")}
        }

        if(!!title) get_list();
        else{set_list([])}
    },[title])

    return(
        <div className="series">
            <input value={title} onChange={(e)=> set_title(e.target.value)} placeholder="Search Anime" onKeyDown={({key})=>{ if(key === "Enter") view_all(); }}/>
            <div className="list column_box">
                {list.map((v,i)=><Serie {...v} key={`${v.title} - ${v.season} - ${i}`}/>)}
                {!!list.length ? <button className="center_box flex_1_box" onClick={view_all}>View All Results</button> : null}
            </div>
        </div>
    )
}

const Header = (props)=>{
    const [genres,set_genres] = useState([]);
    const navigate = useNavigate();
    const pass = {navigate};

    const get_genres = async()=>{
        try{
            const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_genre`).then(resp=>resp.json());
            if(!!result) set_genres(result) ;
        }
        catch(e){console.log("Error in getting genres")}
    }

    useEffect(()=>{
        get_genres();
    },[]);

    const render_genres = ()=>genres.map((v,i)=><div className="each" key={`genre-${v}-${i}`} onClick={(e)=> navigate(`/filter?genre=${encodeURIComponent(e.target.innerText)}`)}>{v}</div>)

    return(
        <div className="header">
            <div className="row_box">
                <div className="left row_box">
                    <NavLink to="/" className="brand"><img src="./brandname.png" alt="Brand Logo"/></NavLink>
                    <Series {...pass} {...props}/>
                    <NavLink to="/filter" className="nav_link"><button>Filter</button></NavLink>
                    <div className="nav_link"><button>Genres<div className="genres grid_box">{render_genres()}</div></button></div>
                    <NavLink className="nav_link" to={`/filter?status=${encodeURIComponent("Ongoing")}`}><button>Ongoing</button></NavLink>
                    <NavLink className="nav_link" to={`/filter?status=${encodeURIComponent("Finished")}`}><button>Finished</button></NavLink>
                    <NavLink className="nav_link" ><button>Random</button></NavLink>
                </div>
                <div className="right"></div>
            </div>
        </div>
    )
}

export default Header;