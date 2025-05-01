import React, { useEffect, useState } from "react";
import env from "react-dotenv";
import event_handler from "../Event_Handler";

import "./Filter_Style.css";
import { useSearchParams } from "react-router-dom";

const EachGenre = (props)=> <div className={`each center_box ${props.select ? "select" : ""}`} onClick={()=>props.handle_click(props.index)}>{props.value}</div>

const FilterBlock = (props)=>{
    const [params] = useSearchParams();
    const g = params.get("genre");
    const s = params.get("status");
    const t = params.get("title");
    const [title,set_title] = useState(t);
    const [genres,set_genres] = useState([]);
    const [status,set_status] = useState([ { value: "Ongoing" , select: !!s && s=== "Ongoing" }, { value: "Finished" , select:!!s && s==="Finished" } ]);

    const get_genres = async()=>{
        try{
            const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_genre`).then(resp=>resp.json());
            if(!!result) set_genres(result.map((v)=>{ return {value: v,select: !!g && g===v} })); 
        }
        catch(e){console.log("Error in getting genres")}
    }

    const handle_genre_click = (index)=>{
        let temp =[...genres];
        temp[index].select = !temp[index].select;
        set_genres([...temp]);
    }

    const handle_status_click = (index)=>{
        let temp =[...status];
        temp[index].select = !temp[index].select;
        set_status([...temp]);
    }

    const apply_filter = ()=>{
        event_handler.emit("apply_filter",{
            genres: genres.filter((v)=>v.select).map((v)=>v.value),
            status: status.filter((v)=>v.select).map((v)=>v.value),
            title
        });
    }

    const reset_filter = ()=>{
        set_title("");
        set_status([
            { value: "Ongoing" , select: false },
            { value: "Finished" , select: false }
        ]);
        set_genres(arr=>arr.map((v)=>{return {...v,select: false}}));
    }

    useEffect(()=>{
        get_genres();
    },[]);

    useEffect(()=>{
        set_genres(arr=>arr.map((v)=>{return {...v , select : v.value === g}}));
        set_status([ { value: "Ongoing" , select: !!s && s=== "Ongoing" }, { value: "Finished" , select:!!s && s==="Finished" } ])
    },[g,s])

    useEffect(()=>{
        apply_filter()
    },[title,status,genres])
    
    const render_list = (list = [],handler)=> list.map((obj,i)=><EachGenre {...obj} handle_click={handler} index={i} key={`filter block genre ${i}`}/>)

    return(
        <div className="filter_block column_box">
            <label className="row_box"><img src="./filtericon.png" alt="Filter"/>Filter</label>
            <input value={title} onChange={(e)=>set_title(e.target.value)} placeholder="Search By Title"/>
            <label>Genres</label>
            <div className="blocks grid_box">{render_list(genres,handle_genre_click)}</div>
            <label>Status</label>
            <div className="blocks grid_box"> {render_list(status,handle_status_click)} </div>
            <div className="reverse_row_box">
                <button className="center_box" onClick={reset_filter}>Reset</button>
            </div>
        </div>
    )
}

export default FilterBlock;