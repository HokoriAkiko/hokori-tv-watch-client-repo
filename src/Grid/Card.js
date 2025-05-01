import { SpinnerCircular } from "spinners-react";
import { useEffect, useState } from "react";
import Floating from "./Floating";
import env from "react-dotenv";

import "./Grid_Style.css";

const Card = (props)=>{
    const { title, season, viewport } = props;
    const [thumbnail,set_thumbnail] = useState({fetching: true,url : ""});
    const [gap,set_gap]= useState(null);
    const [info,set_info]= useState();

    const get_info = async ()=>{
        const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({title, season, fields: ["context","videos","genre_list","status"] })
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

    const on_enter = (e)=>{
        const gap_in_right = viewport.width - e.clientX;
        const gap_in_bottom = viewport.height - e.clientY;
        set_gap({gap_in_right,gap_in_bottom});
    }
    
    useEffect(()=>{
        get_info();
        get_thumbnail();
    },[])
    
    
    const render_thumbnail  = ()=>{
        if(thumbnail.fetching) return <div className="spinner center_box"><SpinnerCircular color="blue" speed={100} thickness={200}/></div>
        if(thumbnail.url) return <img src={thumbnail.url} alt="Thumbnail"/>
        return <div className="missing center_box">Thumbnail Missing</div>
    }

    const render_info = ()=>{
        return(
            <div className="info reverse_column_box">
                <div className="title text_overflow_box">{title}</div>
                <div className="center_box">
                    <div className="other">{`S ${season}`}</div>
                    <div className="other">{`Eps ${!!info &&  !!info.videos ? info.videos.length : 0}`}</div>
                </div>
            </div>
        )
    }

    return(
        <div className="each" onMouseEnter={on_enter} onMouseLeave={()=>set_gap(null)}>
            <div className="thumbnail">{render_thumbnail()}</div>
            <div className="info">{render_info()}</div>
            <div className="tint"></div>
            <div className="icon"></div>
            {gap ? <Floating gap={gap} {...props} {...info}/> : null}
        </div>
    )
}

export default Card;