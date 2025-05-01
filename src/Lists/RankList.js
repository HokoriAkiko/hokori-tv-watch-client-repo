import React, { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";
import { NavLink } from "react-router-dom";
import env from "react-dotenv";

import "./Lists_Style.css";

const Card = (props)=>{
    const { title, season, index } = props;
    const [thumbnail,set_thumbnail] = useState({fetching: true,url : ""});
    const [info,set_info]= useState();

    useEffect(()=>{
        const get_info = async ()=>{
            const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, season, fields: ["genre_list"] })
            }).then(resp=>resp.json());
            set_info(result);
        }
    
        const get_thumbnail = async ()=>{
            const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_thumbnail`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title,season})
            }).then(resp=>resp.json());
    
            if(!!result){ set_thumbnail({fetching : false, url : `${env.REACT_APP_STORAGE_URL}${result}`}) }
            else{set_thumbnail({fetching : false, url : ""}) }
        }

         get_info();
        get_thumbnail();
     },[])
    
    const render_genres = ()=> <div className="row_box genres wrap_box">Genre : {!!info && !!info.genre_list && info.genre_list.length !== 0  ? info.genre_list.map((v,i)=><div key={`rank genre ${i}`}>{i === info?.genre_list.length - 1 ? `${v}.` : `${v},`}</div>) : <div>N.A.</div>}</div>
    const render_thumbnail  = ()=>{
        if(thumbnail.fetching) return <div className="spinner center_box"><SpinnerCircular color="blue" speed={100} thickness={200}/></div>
        if(thumbnail.url) return <img src={thumbnail.url} alt="Thumbnail"/>
        return <div className="missing center_box">N.A.</div>
    }
    const render_info = ()=>{
        return(
            <div className="column_box">
                <div className="title text_overflow_box">{`${title} ${season === 1 ? "":"Season "+ season}`}</div>
                {render_genres()}
            </div>
        )
    }

    return(
        <NavLink className="each row_box" to={`/watch?title=${encodeURIComponent(title)}&season=${encodeURIComponent(season)}`}>
            <div className="position center_box">{`${index+1}`}</div>
            <div className="thumbnail">{render_thumbnail()}</div>
            <div className="info flex_1_box">{render_info()}</div>
        </NavLink>
    )
}

const RankList = (props)=>{
    const [range,set_range] = useState("");
    const [list,set_list] = useState([]);
    const ranges = ["Today", "Week", "Month"];

    const render_ranges = ()=> ranges.map((v,i)=><div className={`flex_1_box center_box ${range === v ? "select" : ""}`} onClick={()=>set_range(v)} key={`range -${i}`} >{v}</div> );

    useEffect(()=>{
        const get_list = async ()=>{
            try{
                const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_series`,{
                    method: "POST",
                    headers: { "Content-Type" : "application/json"},
                    body: JSON.stringify({})
                }).then(resp=>resp.json());
    
                set_list([...result]);
            }
            catch(e){}
        }
        set_range(ranges[0]);
        get_list();
    },[])

    return(
        <div className="list column_box">
            <label className="center_box">Most Popular</label>
            <div className="ranges row_box"> {render_ranges()} </div>
            {list.map((v,i)=><Card index={i} {...v} key={`rank-card-${i}`} {...props}/>)}
        </div>
    )
}

export default RankList;