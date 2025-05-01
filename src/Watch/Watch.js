import React, { useEffect, useState } from "react";
import { SpinnerCircular } from "spinners-react";
import SimilarList from "../Lists/SimilarList";
import event_handler from "../Event_Handler";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import env from "react-dotenv";

import "./Watch_Style.css";

const Episodes = (props)=>{
    const { title, season } = props;
    const [data,set_data] = useState({videos: [], custom_names: []});
    const [watch,set_watch] = useState(-1);

    const next_episode = ()=>set_watch(prev=>prev+1);
    const prev_episode = ()=>set_watch(prev=>prev-1);

    useEffect(()=>{
        const get_episodes_list = async ()=>{
            try{
                const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({title,season,fields: ["videos","custom_names"]})
                }).then(resp=>resp.json());
        
                set_data(result);
                set_watch(0);
            }
            catch(e){
                console.log("Error while getting list of episodes");
            }
        }
        get_episodes_list();
        event_handler.push("next",next_episode);
        event_handler.push("prev",prev_episode);

        return ()=>{event_handler.pop("next",next_episode); event_handler.pop("prev",prev_episode);}
    },[])

    useEffect(()=>{
        if(data.videos.length === 0)  return;
        if(watch > data.videos.length-1) set_watch(_ => data.videos.length-1);
        if(watch < 0 ) set_watch(0);
        if(watch >= 0 && watch <= data.videos.length - 1) event_handler.emit("episode",`${env.REACT_APP_STORAGE_URL}/stream_video/${data.videos[watch]}/false`);
    },[watch])

    return(
        <div className="episodes grid_box">
            {data.videos.map((_,i)=><button className={`${i === watch ? "watching":""}`} key={`episode ${i}`} onClick={()=>set_watch(i)}>{i+1}</button>)}
        </div>
    )
}

const CurrentlyWatching = (props)=>{
    const { title, season} = props;
    const [info,set_info] = useState({});
    const [thumbnail,set_thumbnail] = useState({fetching: true,url : ""});

    useEffect(()=>{
        const get_thumbnail = async ()=>{
            try{
                const {result} = await fetch(`${env.REACT_APP_STORAGE_URL}/get_thumbnail`,{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({title,season})
                }).then(resp=>resp.json());
        
                if(!!result){ set_thumbnail({fetching : false, url : `${env.REACT_APP_STORAGE_URL}${result}`}) }
                else{set_thumbnail({fetching : false, url : ""}) }
            }
            catch(e){console.log("error while getting thumbnail",e);}
        }
        const get_info = async ()=>{
            try{
                const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_serie_info`,{
                    method: "POST",
                    headers: {"Content-Type" : "application/json"},
                    body: JSON.stringify({title,season,fields: ["context","genre_list","status","videos"]})
                }).then(resp=>resp.json());
        
                set_info(result);
            }
            catch(e){console.log("error while getting info",e)}
        }
        get_thumbnail();
        get_info();
    },[]);

    const render_thumbnail  = ()=>{
        if(thumbnail.fetching) return <div className="spinner center_box"><SpinnerCircular color="blue" speed={100} thickness={200}/></div>
        if(thumbnail.url) return <img src={thumbnail.url} alt="Thumbnail"/>
        return <div className="missing center_box">N.A.</div>
    }
    const render_genres = ()=> info && info.genre_list && info.genre_list.length !== 0 ?  info?.genre_list?.map((v,i)=> i === info.genre_list.length-1 ? <div className="genre" key={`current genre${i}`}>{v}.</div> : <div className="genre">{v},</div>) : <div className="genre">N.A.</div>;
    const render_info = ()=>{
        return(
            <>
            <label className="title">{title}</label>
            <div className="partition"></div>
            <label>{info?.context}</label>
            <div className="partition"></div>
            <div className="pair row_box">
                <label>Genre</label>
                <div className="row_box wrap_box flex_1_box">{render_genres()}</div>
            </div>
            <div className="pair row_box">
                <label>Status</label>
                <div className="flex_1_box">{info?.status}</div>
            </div>
            <div className="pair row_box">
                <label>Episodes</label>
                <div className="flex_1_box">{info?.videos?.length ?? 0}</div>
            </div>
            <div className="pair row_box">
                <label>Season</label>
                <div className="flex_1_box">{season}</div>
            </div>
            </>
        )
    }

    return(
        <div className="current column_box">
            <div className="thumbnail">{render_thumbnail()}</div>
            {render_info()}
        </div>
    )
}

const VideoPanel = (_)=>{
    const [url,set_url]= useState(null);
    const [auto_play,set_auto_play] = useState(false);
    const [autonext,set_autonext] = useState(false);

    useEffect(()=>{
        event_handler.push("episode",set_url);
        return ()=>event_handler.pop("episode",set_url);
    },[]);

        const render_options = ()=>{
        if(url){
            return(
                <div className="options row_box">
                    <div className="flex_1_box">
                        <button className={`${auto_play ? "enable":""}`} onClick={()=>set_auto_play(!auto_play)}>Auto Play</button>
                        <button className={`${autonext ? "enable":""}`} onClick={()=>set_autonext(!autonext)}>Auto Next</button>
                    </div>
                    <div className="flex_1_box reverse_row_box">
                        <button onClick={()=>event_handler.emit("next")}>Next Episode</button>
                        <button onClick={()=>event_handler.emit("prev")}>Previous Episode</button>
                    </div>
                </div>
            )
        }

        return null;
    }

    if(url){
        return(
            <div className="column_box">
                <video src={url} autoPlay={auto_play} onEnded={()=>{ if(autonext) event_handler.emit("next"); }} controls={true}></video>
                {render_options()}
            </div>
        )
    }

    return(
        <div className="empty center_box">
            <img src="./error.png" alt="Error"/>
            URL Not Found
        </div>
    )
}

const Watch = (props)=>{
    const q = new URLSearchParams(window.location.search);
    const title = q.get("title");
    const season = q.get("season");
    const pass={title,season};
    return(
        <>
        <Header {...props}/>
        <div className="watch">
            <div className="row_box">
                <div className="left">
                    <VideoPanel {...pass} {...props}/>
                    <Episodes {...pass} {...props}/>
                </div>
                <div className="right">
                    <CurrentlyWatching {...pass} {...props}/>
                    <SimilarList {...pass} {...props}/>
                </div>
            </div> 
        </div>
        <Footer {...props}/>
        </>
    )
}

export default Watch;