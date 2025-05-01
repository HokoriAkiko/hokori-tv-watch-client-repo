import React, { useEffect, useState } from "react";
import event_handler from "../Event_Handler";
import env from "react-dotenv";
import Card from "./Card";

import "./Grid_Style.css";

const FilteredList = (props)=>{
    const [list,set_list] = useState([]);

    const apply_filter = async (filter)=>{
        try{
            const { result } = await fetch(`${env.REACT_APP_STORAGE_URL}/get_series`,{
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify(filter),
            }).then(data=>data.json());

            set_list(result);
        }
        catch(e){console.log("Filtered Results Fetch Error")}
    }

    useEffect(()=>{
        event_handler.push("apply_filter",apply_filter);
        return ()=>event_handler.pop("apply_filter",apply_filter);
    },[]);

    return(
        <div className="container column_box">
            <label>Search Results</label>
            <div className="cards grid_box"> {list.map((v,i)=><Card {...v} key={`serie card ${i}`} {...props}/>)} </div>
        </div>
    )
}

export default FilteredList;