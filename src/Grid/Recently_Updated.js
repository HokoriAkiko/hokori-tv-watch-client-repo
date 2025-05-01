import React, { useState, useEffect } from "react";
import env from "react-dotenv";
import Card from "./Card";

import "./Grid_Style.css";

const RecentlyUpdated = (props)=>{
    const [list,set_list] = useState([]);

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

    useEffect(()=>{get_list()},[]);

    return(
        <div className="container column_box">
            <label>Recently Updated</label>
            <div className="cards grid_box"> {list.map((v,i)=><Card {...v} key={`serie card ${i}`} {...props}/>)} </div>
        </div>
    )
}

export default RecentlyUpdated;