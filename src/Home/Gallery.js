import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import env from "react-dotenv";

import "./Home_Style.css";

const GalleryCard = (props)=>{
    const {title,season} = props;
    const [url,set_url] = useState(null);
    const [info,set_info] = useState({});

    useEffect(()=>{
        const get_thumbnail = async ()=>{
            try{
                const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_thumbnail`,{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({title,season})
                }).then(resp=>resp.json());

                if(!!result) set_url(`${env.REACT_APP_STORAGE_URL}${result}`);
            }
            catch(e){}
        }
    
        const get_info = async ()=>{
            try{
                const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({title,season,fields: ["genre_list","context","status","videos"]})
                }).then(resp=>resp.json());
    
                set_info(result);
            }
            catch(e){}
        }
        get_thumbnail();
        get_info();
    },[])

    const render_genres = ()=>{
        return(
            <div className="genres row_box">
                Genre :
                {info && info.genre_list && info.genre_list.length !== 0 ? info.genre_list.map((v,i)=> i === info.genre_list.length - 1 ? <div>{v}.</div>: <div>{v},</div>): <div>N.A.</div>}
            </div>
        )
    } 
    const render_thumbnail = ()=><div className="thumbnail center_box"> {!!url ? <img src={url} alt="Thumbnail"/> : <div className="missing center_box">Thumbnail Missing</div>} </div>
    const render_links = ()=>{
        return(
            <div className="row_box">
                <NavLink className="nav_link center_box" to={`/watch?title=${encodeURIComponent(title)}&season=${encodeURIComponent(season)}`}>
                    <img src="./playicon2.png" alt="play" className="play"/>
                    Watch Now
                </NavLink>
            </div>
        )
    }
    const render_info = ()=>{
        return(
            <div className="info column_box flex_1_box">
                <div className="title">{title} Season {season}</div>
                <div className="context text_overflow_box">{info && info.context ? info.context : "N.A."}</div>
                {render_genres()}
                {render_links()}
            </div>
        )
    }
    return(
        <div className="card row_box">
            <div className="back" style={{backgroundImage: `url(${url})`}}></div>
            {render_thumbnail()}
            {render_info()}
        </div>
    )
}

const Gallery = (_)=>{
    const [list,set_list] = useState([]);
    const [card_index,set_card_index] = useState(0);
    const scroll_ref = useRef();

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

    const on_prev = ()=>{
        if(!scroll_ref.current || list.length === 0) return;
        set_card_index(i =>{
            const w = scroll_ref.current.children[0].offsetWidth;
            if(i > 0){ scroll_ref.current.scrollTo((i-1)* w,0); return i - 1; }
            else{ scroll_ref.current.scrollTo((list.length - 1)*w ,0); return list.length - 1; }
        });
    }

    const on_next = ()=>{
        if(!scroll_ref.current || list.length === 0) return;
        set_card_index(i =>{
            const w = scroll_ref.current.children[0].offsetWidth;
            if(i < list.length - 1){ scroll_ref.current.scrollTo((i+1)* w,0); return i + 1; }
            else{ scroll_ref.current.scrollTo(0,0); return 0; }
        });
    }

    useEffect(()=>{ get_list(); },[]);
    useEffect(()=>{ const t = setInterval(()=>on_next(), 3000); return ()=>clearInterval(t); } , [list]);

    const render_arrows = ()=>{
        return(
            <div className="arrows center_box">
                <div className="arrow left" onClick={on_prev}></div>
                {list.map((_,i)=><div className={`ring ${i === card_index ? "fill":""}`}></div>)}
                <div className="arrow" onClick={on_next}></div>
            </div>
        )
    }

    return(
        <div className="column_box">
            <div className="gallery row_box" ref={scroll_ref}> {list.map((v,i)=><GalleryCard {...v} index={i} key={`gallery card ${i}`}/>)} </div>
            {render_arrows()}
        </div>
    )
}

export default Gallery;